# Module 1: Security Frameworks

*"Alright, listen up. You've got the foundations down, but now we're getting into the meat of what actually makes security work at scale. Frameworks aren't just documents to check boxes—they're how mature organizations think about risk. Let me show you how the pros do it."*

---

## Why Frameworks Matter

Here's the hard truth: **You can't secure everything.** You don't have infinite budget, infinite time, or infinite staff. So how do you decide what to protect first? How do you know if you're doing enough?

**Frameworks give you structure.** They're the accumulated wisdom of thousands of organizations who've been through this before. Don't reinvent the wheel—stand on the shoulders of giants.

---

## NIST Risk Management Framework (RMF) — The Gold Standard

**Current Version:** NIST SP 800-37 Rev. 2 (December 2018) — **Still the authoritative standard in 2026**

### The 7-Step RMF Process

This isn't academic theory—this is how federal agencies, Fortune 500 companies, and critical infrastructure operators actually manage risk:

| Step | What You Do | Why It Matters |
|------|-------------|----------------|
| **1. Prepare** | Get your organization ready to manage security and privacy risks | Most people skip this. Don't. Preparation prevents poor performance. |
| **2. Categorize** | Classify your system and data based on impact (low/moderate/high) | Not all systems are equal. Your public website ≠ your financial database. |
| **3. Select** | Choose security controls from NIST SP 800-53 based on your risk | This is where the catalog comes in—hundreds of controls, you pick what fits. |
| **4. Implement** | Deploy the controls and document how they actually work | "Implemented" means "working as designed," not "installed and forgotten." |
| **5. Assess** | Verify controls are in place, operating, and effective | Independent assessment. No cheating. |
| **6. Authorize** | Senior official makes a risk-based decision to operate | Someone puts their name on the line. Accountability matters. |
| **7. Monitor** | Continuously watch control effectiveness and emerging risks | **Point-in-time assessments are dead.** Continuous monitoring is the standard now. |

**2026 Update:** NIST updated the RMF page on **February 10, 2026**. The framework now explicitly integrates:
- Security risk
- Privacy risk  
- **Cyber supply chain risk management (SCRM)**

This isn't just for government anymore. If you're building software, operating critical infrastructure, or handling sensitive data—RMF applies to you.

---

## NIST Cybersecurity Framework 2.0 (CSF 2.0)

**Released:** February 2024 — Currently celebrating its 2-year anniversary

While RMF is the "how," CSF 2.0 is the "what." It gives you six core functions to organize your security program:

### The Six Functions

1. **GOVERN** — Organizational risk management strategy
   - Leadership sets the tone
   - Policies actually get enforced
   - Resources allocated appropriately

2. **IDENTIFY** — Asset management, risk assessment, improvement
   - You can't protect what you don't know you have
   - Risk assessment is continuous, not annual

3. **PROTECT** — Access control, security training, data security
   - Your preventative controls
   - The "keep bad things out" layer

4. **DETECT** — Monitoring, anomaly detection, continuous testing
   - **Assume breach.** Detection is how you know it happened.

5. **RESPOND** — Response planning, communications, analysis
   - When (not if) something happens
   - Coordinated, practiced, effective

6. **RECOVER** — Recovery planning, improvements, communications
   - Get back to business
   - Learn and strengthen

### 2026 Updates You Need to Know

| Resource | Status | Deadline |
|----------|--------|----------|
| CSF 2.0 Informative References Quick-Start Guide | Open for public comment | **May 6, 2026** |
| NIST SP 1308 | Available now | — |
| Transit Cybersecurity Framework Community Profile (NIST IR 8576) | Public comment | Feb 23, 2026 |
| **Cyber AI Profile** | Preliminary draft | Jan 2026 workshop |

**The Cyber AI Profile is big.** It's NIST's first serious framework for securing AI/ML systems. If you're working with AI (and who isn't in 2026?), this matters.

---

## CISA Secure by Design (2025-2026 Priority)

Here's a paradigm shift you need to understand: **The burden of security is shifting from consumers to producers.**

### Core Principle

Technology providers must take **ownership at the executive level** to ensure products are secure by design—not bolted on as an afterthought.

### What This Means in Practice

| Old Way | New Way |
|---------|---------|
| Security is a technical feature | Security is a **core business requirement** |
| MFA costs extra | MFA available **at no extra cost** |
| Logging is optional add-on | **Logging included by default** |
| Secure configuration requires expertise | **Secure defaults out-of-the-box** |

**CISA's message to vendors:** If you're shipping products with known exploitable flaws, that's on **you**, not your customers.

---

## Framework Convergence: The Big Picture

Here's what's happening in 2026:

**NIST RMF + CSF 2.0 + CISA Guidance = Aligned ecosystem**

You don't have to choose. These frameworks complement each other:
- **RMF** gives you the process (7 steps)
- **CSF 2.0** gives you the structure (6 functions)
- **CISA** gives you current threat intelligence and priorities

**Real-world adoption:**
- Federal agencies: Required to use RMF
- Critical infrastructure: Expected to align with CSF 2.0
- Private sector: Increasingly adopting both for competitive advantage

---

## ISACA State of Cybersecurity 2025: Industry Reality Check

I pulled the latest data from ISACA's survey of 4,000+ cybersecurity professionals globally:

### What's Actually Happening

| Trend | Reality |
|-------|---------|
| **Threat-led programs** | Organizations moving from compliance-driven to threat-driven security |
| **AI integration** | Risk assessments increasingly using AI/ML for pattern recognition |
| **Physical pen testing** | Still widely overlooked (gap opportunity!) |
| **Deepfake threats** | Authentication challenges in the deepfake era emerging |

---

## Key Takeaways

1. **RMF 7-step process** is the implementation roadmap—still current in 2026
2. **CSF 2.0 six functions** organize your security program—now includes GOVERN
3. **Continuous monitoring** replaces point-in-time assessments
4. **Secure by Design** shifts accountability to manufacturers
5. **Supply chain risk** is now integrated into standard frameworks
6. **Cyber AI Profile** addresses emerging AI/ML security needs

---

## Practical Advice

**If you're implementing a framework:**
1. Start with **CSF 2.0** for high-level organization
2. Use **RMF** for system-level implementation
3. Monitor **CISA** for current threat priorities
4. Track **NIST updates**—comment periods are opportunities to shape standards

**Remember:** Frameworks are tools, not shackles. Tailor them to your organization's specific risk profile and business needs.

---

*"Okay, so you understand the frameworks. Now let's talk about how you actually manage risk—the process, the calculations, the decisions. This is where security becomes business strategy."*

---

**Sources:** NIST SP 800-37 Rev. 2, NIST CSF 2.0, CISA Secure by Design, ISACA State of Cybersecurity 2025
