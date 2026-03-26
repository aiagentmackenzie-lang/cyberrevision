// api/chat.js - Claude API proxy
// Receives: POST { messages, systemPrompt, moduleContext, endSession? }
// Returns: text/plain chunked stream of raw text tokens

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { messages = [], systemPrompt = '', moduleContext = '', endSession = false } = body;

  const fullSystem = systemPrompt.replace('{moduleContext}', moduleContext);

  const anthropicMessages = [...messages];
  if (endSession && anthropicMessages.length > 0) {
    anthropicMessages.push({
      role: 'user',
      content: '[END_SESSION] Please provide your final summary now.'
    });
  }

  let anthropicRes;
  try {
    anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: fullSystem,
        messages: anthropicMessages,
        stream: true
      })
    });
  } catch (err) {
    return res.status(503).json({ error: 'Service unavailable — try again' });
  }

  if (!anthropicRes.ok) {
    const status = anthropicRes.status;
    if (status === 401) return res.status(401).json({ error: 'Authentication failed' });
    if (status === 429) return res.status(429).json({ error: 'Rate limit reached — try again shortly' });
    return res.status(503).json({ error: 'Service unavailable — try again' });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');

  const reader = anthropicRes.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        let parsed;
        try { parsed = JSON.parse(data); } catch { continue; }

        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          res.write(parsed.delta.text);
        }
      }
    }
  } catch (err) {
    // Stream interrupted — end gracefully
  }

  res.end();
}
