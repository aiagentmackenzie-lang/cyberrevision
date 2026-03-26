// quiz.js - MCQ quiz engine
// Exports: initQuiz(courseId, moduleId, quizFile)
// Dispatches: document 'quizComplete' { courseId, moduleId, score, total }

export async function initQuiz(courseId, moduleId, quizFile) {
  const panel = document.getElementById('content-panel');
  const url = `content/${courseId}/${quizFile}`;

  let data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    data = await res.json();
  } catch (err) {
    console.error('Failed to load quiz:', url, err);
    const errEl = document.createElement('div');
    errEl.className = 'content-error';
    errEl.textContent = 'Could not load quiz. Please try again.';
    const inner = document.createElement('div');
    inner.className = 'content-inner';
    inner.appendChild(errEl);
    panel.replaceChildren(inner);
    return;
  }

  const questions = data.questions || [];
  if (!questions.length) return;

  const container = document.createElement('div');
  container.className = 'quiz-container';

  let currentIndex = 0;
  let score = 0;

  function showQuestion(index) {
    container.textContent = '';
    const q = questions[index];

    const progress = document.createElement('div');
    progress.className = 'quiz-progress';
    progress.textContent = `Question ${index + 1} of ${questions.length}`;

    const questionEl = document.createElement('div');
    questionEl.className = 'quiz-question';
    questionEl.textContent = q.question;

    const optionsEl = document.createElement('div');
    optionsEl.className = 'quiz-options';

    const explanationEl = document.createElement('div');
    explanationEl.className = 'quiz-explanation';
    explanationEl.style.display = 'none';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-next-btn';
    nextBtn.textContent = index < questions.length - 1 ? 'Next \u2192' : 'See Results';
    nextBtn.style.display = 'none';
    nextBtn.addEventListener('click', () => {
      if (index < questions.length - 1) {
        currentIndex++;
        showQuestion(currentIndex);
      } else {
        showScore();
      }
    });

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        optionsEl.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });
        if (i === q.correct) {
          btn.classList.add('correct');
          score++;
        } else {
          btn.classList.add('incorrect');
          optionsEl.children[q.correct].classList.add('revealed');
        }
        explanationEl.textContent = q.explanation;
        explanationEl.style.display = 'block';
        nextBtn.style.display = 'inline-block';
      });
      optionsEl.appendChild(btn);
    });

    container.appendChild(progress);
    container.appendChild(questionEl);
    container.appendChild(optionsEl);
    container.appendChild(explanationEl);
    container.appendChild(nextBtn);
  }

  function showScore() {
    container.textContent = '';

    const screen = document.createElement('div');
    screen.className = 'quiz-score-screen';

    const scoreNum = document.createElement('div');
    scoreNum.className = 'quiz-score-number';
    scoreNum.textContent = `${score}/${questions.length}`;

    const label = document.createElement('div');
    label.className = 'quiz-score-label';
    const pct = score / questions.length;
    label.textContent = pct === 1
      ? 'Perfect score!'
      : pct >= 0.7 ? 'Good work — keep studying!'
      : 'Keep reviewing and try again.';

    const actions = document.createElement('div');
    actions.className = 'quiz-score-actions';

    const reviewBtn = document.createElement('a');
    reviewBtn.className = 'quiz-action-btn';
    reviewBtn.textContent = '\u2190 Review Module';
    reviewBtn.href = '#' + courseId + '/' + moduleId;

    const retryBtn = document.createElement('button');
    retryBtn.className = 'quiz-action-btn primary';
    retryBtn.textContent = 'Try Again';
    retryBtn.addEventListener('click', () => {
      score = 0;
      currentIndex = 0;
      showQuestion(0);
    });

    actions.appendChild(reviewBtn);
    actions.appendChild(retryBtn);
    screen.appendChild(scoreNum);
    screen.appendChild(label);
    screen.appendChild(actions);
    container.appendChild(screen);

    localStorage.setItem(
      `quiz:${courseId}/${moduleId}`,
      JSON.stringify({ score, total: questions.length, attempted: true })
    );

    document.dispatchEvent(new CustomEvent('quizComplete', {
      detail: { courseId, moduleId, score, total: questions.length }
    }));
  }

  showQuestion(0);

  const inner = document.createElement('div');
  inner.className = 'content-inner';
  inner.appendChild(container);
  panel.replaceChildren(inner);
  panel.scrollTop = 0;
}
