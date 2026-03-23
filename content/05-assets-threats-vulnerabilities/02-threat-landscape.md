# Module 2: Threat Landscape

*"Alright, now let's talk about who's coming for you. Nation-states, criminal gangs, hacktivists, insiders—the threat landscape in 2026 is more complex than ever. AI-generated attacks, virtualization infrastructure targeting, supply chain compromises. These aren't just hackers in hoodies; they're professional operations with resources and patience. Know your enemy."*

---

## Why Threat Intelligence Matters

**You can't defend generically.** Different adversaries have different goals, different tools, different patience levels. A nation-state APT isn't going to behave like a ransomware gang. Understanding who's attacking you shapes how you defend.

**Reality:** Threat actors share tools, techniques, and infrastructure. If you see one indicator, you can often predict the full attack chain.

---

## Threat Actors — Who's Coming For You

### Nation-State Actors (APT Groups)

| Country | Focus | Key Trends (2026) |
|---------|-------|-------------------|
| **Russia** | Strategic disruption, espionage | Long-term global goals over tactical Ukraine support |
| **China** | Economic espionage, intellectual property | **#1 by volume**; aggressive zero-day exploitation; edge device targeting |
| **Iran** | Regional influence, regime stability | Semi-deniable operations blurring espionage/hacktivism |
| **North Korea** | Financial gain, sanctions evasion | IT worker operations; cryptocurrency theft |

**Notable APT Groups (2026):**

| Group | Origin | Focus | Recent Activity |
|-------|--------|-------|-----------------|
| **COLDRIVER** | Russia | NGOs, policy advisors, dissidents | Evolved after LOSTKEYS disclosure; new malware families within 5 days |
| **LABYRINTH CHOLLIMA** | North Korea | Split into 3 distinct adversaries with specialized tradecraft | |

**Key Insight:** Nation-states have resources and patience. They'll wait months or years for the right moment. They're also increasingly sharing tools and techniques with criminal groups.

### Criminal Actors

| Type | Focus | Motivation |
|------|-------|------------|
| **Ransomware Gangs** | Encryption + extortion | Financial |
| **Initial Access Brokers** | Sell network access | Financial |
| **Financial Fraud** | Credit cards, banking | Financial |
| **Cryptojackers** | Mining cryptocurrency | Financial |
| **Vietnamese Clusters** | Digital advertising/marketing | Fake job posting campaigns |

**2026 Trend:** Criminal actors are becoming more sophisticated, using nation-state techniques. The line between APT and criminal is blurring.

### Hacktivists and Information Operations

| Actor | Goal | Methods |
|-------|------|---------|
| **Pro-Russia IO** | Narrative control | Social media, disinformation |
| **Pro-Ukraine Groups** | Retaliation | DDoS, defacements |
| **Environmental Activists** | Disruption | Targeted attacks on industries |

**2026 Development:** Information operations increasingly combined with cyber attacks for maximum impact.

### Insider Threats

| Type | Risk Level | Indicators |
|------|------------|------------|
| **Malicious Insider** | High | Data exfiltration, privilege abuse |
| **Negligent Insider** | Medium | Misconfiguration, phishing victims |
| **Compromised Insider** | High | Stolen credentials, account takeover |

**Critical Path:** Privileged insiders (admins, developers) have the access to cause maximum damage.

---

## Ransomware Evolution — The Business Model

### 2024-2026 Evolution

| Era | Model | Impact |
|-----|-------|--------|
| **2024** | Encryption-only | Data unavailable |
| **2025** | Double extortion | Encryption + data theft + public shaming |
| **2026** | **Hybrid warfare** | Encryption + exfiltration + third-party targeting + zero-days |

### Current Ransomware Tactics (2026)

1. **Target Virtualization Infrastructure** — ESXi, hypervisors (one compromise = hundreds of systems)
2. **Exploit Zero-Day Vulnerabilities** — For initial access before patches
3. **Attack Third-Party Providers** — Cascading impact across customers
4. **High-Volume Data Exfiltration** — Before encryption, for leverage
5. **AI-Enhanced Social Engineering** — Voice cloning, targeted phishing

### Major Ransomware Groups (2026)

| Group | Tactics | Notable |
|-------|---------|---------|
| **LockBit 3.0** | Affiliate model, fast encryption | Most active group |
| **BlackCat/ALPHV** | Rust-based, highly customizable | Stopped operations late 2024 |
| **Akira** | Double extortion, Linux focus | Rising threat |
| **INC Ransom** | Healthcare targeting | Aggressive extortion |

**Defense Reality:** Ransomware is a business. They want payment, not destruction. Backup strategies and incident response plans are your best defense.

---

## Supply Chain Attacks — Trust No One

### Evolution

| Era | Attack Vector | Example |
|-----|---------------|---------|
| **2020** | Software updates | SolarWinds SUNBURST |
| **2021** | Build process compromise | Codecov, SUNSPOT |
| **2024-2026** | CI/CD pipelines, dependencies | Poisoned pipeline execution |

### Current Attack Vectors

| Vector | Description | MITRE ATT&CK |
|--------|-------------|--------------|
| **CI/CD Compromise** | Manipulate build pipelines | T1677 (Poisoned Pipeline Execution) |
| **Open Source Poisoning** | Malicious packages in npm/PyPI | T1195.001 |
| **Container Supply Chain** | Compromised base images | T1195 |
| **Software Dependencies** | Vulnerable libraries | T1195 |

**Key Insight:** You trust your vendors; attackers compromise your vendors to get to you. SolarWinds: 18,000 organizations compromised via trusted update channel.

### Supply Chain Defense

- **Software BOMs** — Know what's in your software
- **Dependency Scanning** — Automated vulnerability checks
- **CI/CD Security** — Pipeline integrity, signed commits
- **Vendor Risk Assessment** — Due diligence before onboarding

---

## Social Engineering — The Human Factor

### 2026 Techniques

| Technique | Description | Example |
|-----------|-------------|---------|
| **AI Voice Cloning (Vishing)** | Hyperrealistic voice impersonation | CEO calls CFO to authorize wire transfer |
| **Deepfake Video** | Synthetic video of executives | "Urgent" video call from "CEO" |
| **Fake Job Postings** | Malicious job ads on legitimate platforms | Application "process" installs malware |
| **Malicious Copy-Paste** | Trick users into pasting malicious commands | "Fix this error: copy this command" |
| **Browser Fingerprint Spoofing** | Evade detection via fake browser signatures | T1036.012 (new in MITRE v18) |

### Phishing Evolution

**2026 Reality:** Phishing isn't just Nigerian princes anymore. It's:
- Highly targeted (spear phishing)
- Context-aware (uses recent events)
- Multi-channel (email + SMS + voice)
- AI-generated (perfect grammar, local context)

**MITRE ATT&CK Updates (v18):**
- **T1036.012** — Browser Fingerprint Masquerading
- **T1204.004** — Malicious Copy-and-Paste
- **T1566.002** v2.7→v2.8 — Spearphishing Link updates

---

## Zero-Day Exploitation — The Unknown Unknowns

### 2026 Trends

| Trend | Description | Impact |
|-------|-------------|--------|
| **Edge Device Targeting** | Routers, firewalls, VPN concentrators | Network infrastructure compromise |
| **Virtualization Exploitation** | ESXi, container runtimes, Kubernetes | Mass lateral movement |
| **Nation-State Aggression** | China particularly aggressive with zero-days | Pre-patch exploitation |

### Notable Ongoing Exploitation

| CVE | Product | Status |
|-----|---------|--------|
| **CVE-2021-44228** (Log4j) | Java logging library | Still exploited in 2026 |
| **Container Escapes** | Docker, containerd, runc | Growing attack surface |
| **Network Device Zero-Days** | Cisco, Fortinet, Palo Alto | Infrastructure targeting |

**Defense Strategy:** Zero-days are unstoppable, but you can:
- Segment networks to contain blast radius
- Monitor for anomalous behavior post-exploitation
- Have incident response ready

---

## MITRE ATT&CK Framework v18 — The Common Language

**Released:** October 2025

### Framework Statistics

- **216 Techniques**
- **475 Sub-techniques**
- **172 Groups**
- **784 Software pieces**
- **52 Campaigns**

### New Techniques (v18)

| Technique | ID | Purpose |
|-----------|----|---------|
| **Poisoned Pipeline Execution** | T1677 | Initial Access via CI/CD compromise |
| **Delay Execution** | T1678 | Anti-analysis/anti-forensics |
| **Local Storage Discovery** | T1680 | Reconnaissance |
| **Search Threat Vendor Data** | T1681 | Reconnaissance |
| **Selective Exclusion** | T1679 | Defense Evasion |

### Updated Techniques (v18)

| Technique | Update | Significance |
|-----------|--------|--------------|
| **Supply Chain Compromise** | T1195 v1.6→v1.7 | CI/CD and dependency focus |
| **System Information Discovery** | T1082 v2.6→v3.0 | Enhanced detection strategies |
| **Unsecured Credentials: Shell History** | T1552.003 v1.2→v2.0 | Persistence via shell history |

### Major Structural Changes (v18)

- **Detection Strategies** replaced technique-level detections
- **Analytics** object added for detection engineering
- **Data Sources deprecated** in favor of Data Components

**How to Use MITRE ATT&CK:**
1. **Threat Intelligence** — Map adversaries to techniques
2. **Gap Analysis** — Identify detection gaps
3. **Purple Teaming** — Simulate attacks, validate defenses
4. **Reporting** — Common language for security teams

---

## Emerging Threats: AI-Generated Attacks

### AI as Attack Tool

| Use Case | Threat Level | Description |
|----------|--------------|-------------|
| **AI-Enhanced Social Engineering** | 🔴 Critical | Voice cloning, personalized phishing at scale |
| **Prompt Injection** | 🔴 Critical | Manipulating enterprise AI systems to bypass security |
| **AI-Generated Malware** | 🟡 High | Automated code generation for evasion |
| **AI-Assisted Vulnerability Discovery** | 🟡 High | Automated fuzzing and bug hunting |
| **Deepfake Content** | 🟠 High | Disinformation, executive impersonation |

### AI-Specific Threat Vectors

**Prompt Injection Attacks:**
- Manipulate AI systems to reveal sensitive data
- Bypass security controls via creative prompting
- Jailbreak LLMs to generate malicious content

**AI Agent Security:**
- AI agents require identity management (new IAM paradigm)
- Autonomous AI systems create new attack surfaces
- Agent-to-agent communication vulnerabilities

**2026 Prediction:** AI moves from "exceptional" to "standard" tool for threat actors. AI vs AI security becomes norm.

---

## Key Takeaways

1. **Know your adversaries.** Nation-states, criminals, hacktivists—different goals, different defenses.

2. **Ransomware is hybrid warfare.** Encryption + exfiltration + third-party targeting. It's not just about backups anymore.

3. **Supply chain is a primary vector.** Trust no one, verify everything, know your dependencies.

4. **AI is a double-edged sword.** Attackers use it; defenders use it. Prompt injection is a critical new threat.

5. **MITRE ATT&CK is the common language.** Learn it, map your defenses to it, speak it with your team.

---

*"Last module of this course: vulnerability management. You know what you have, you know who's attacking—now let's find and fix the holes before they do."*
