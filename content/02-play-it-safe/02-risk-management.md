# Module 2: Risk Management

*"Time for some real talk. Risk management isn't about eliminating all risk—that's impossible and would kill your business. It's about understanding risk, making informed decisions, and getting executive buy-in. Let me break down how the pros actually do this."*

---

## What Risk Actually Means

**CISA's definition (and it's a good one):**

> *"Risk management is the process of identifying, analyzing, assessing, and communicating risk—and accepting, avoiding, transferring, or mitigating it to an acceptable level, considering associated costs and benefits of any actions taken."*

**Key phrase:** *"Acceptable level."*

There's no such thing as zero risk. There's only:
- **Risk you're willing to accept** (monitor it)
- **Risk you're willing to pay to reduce** (mitigate it)
- **Risk that isn't worth the activity** (avoid it)
- **Risk someone else can handle better** (transfer it)

---

## The Risk Equation (Simplified but Useful)

**Risk = Threat × Vulnerability × Impact**

Or more practically:

**Risk = Likelihood × Impact**

| Factor | Questions to Ask |
|--------|------------------|
| **Likelihood** | How probable is this threat? Has it happened before? To organizations like ours? |
| **Impact** | What happens if it succeeds? Financial loss? Reputation damage? Legal liability? |

**Pro tip:** Don't get hung up on precise calculations. Risk assessment is as much art as science. The goal is **comparative prioritization**, not mathematical perfection.

---

## Risk Treatment Options: Your Toolkit

Based on NIST SP 800-30 Rev. 1 (still the authoritative guide):

### 1. Risk Mitigation ⭐ **(Most Common)**

**What:** Implement controls to reduce likelihood and/or impact

**When to use:** When risk exceeds your tolerance and mitigation is cost-effective

**Examples:**
- Deploy MFA (reduces likelihood of credential theft)
- Implement backups (reduces impact of ransomware)
- Network segmentation (limits blast radius)
- Security awareness training (reduces human error)

**Reality check:** This is where most of your effort goes. Choosing the right controls is the art of security.

---

### 2. Risk Acceptance

**What:** Acknowledge the risk, document it, monitor it

**When to use:**
- Residual risk after mitigation
- Low-risk scenarios where mitigation costs exceed benefit
- Business-critical functions with no alternative

**Critical:** Risk acceptance requires **explicit documented approval** from someone with authority. Don't just ignore risks—formally accept them.

**Template:** *"Risk [X] has been assessed as [low/moderate]. Mitigation options [Y] were evaluated and determined to be cost-prohibitive. Risk accepted by [Name], [Title], [Date]. Review scheduled for [Date]."*

---

### 3. Risk Avoidance

**What:** Eliminate the activity or condition causing the risk

**When to use:** When the risk fundamentally exceeds the value of the activity

**Examples:**
- Stop using end-of-life systems that can't be secured
- Don't store data you don't legally need
- Exit business lines with unacceptable risk profiles

**Trade-off:** Risk avoidance eliminates opportunity. Make sure you're not avoiding your core business.

---

### 4. Risk Sharing/Transfer

**What:** Move risk to another party

**Mechanisms:**
- **Cyber insurance** (transfers financial risk)
- **Cloud providers** (transfers infrastructure risk—but not all risk!)
- **Third-party security services** (MSSP, MDR)
- **Contracts and SLAs** (vendor assumes specific liabilities)

**2026 Reality:** Supply chain risk has made this more complex. You can outsource operations, but you can't outsource accountability.

**Key question:** *Does the third party actually reduce risk, or just shift it while adding new risks?*

---

### 5. Risk Rejection (NOT ACCEPTABLE) ❌

**What:** Ignore the risk and hope it doesn't happen

**Status:** **Never acceptable in professional security practice**

If you're tempted to just not deal with a risk—that's rejection, not acceptance. Document it or fix it. Ignoring it is negligence.

---

## Risk Assessment Process: Step-by-Step

### Step 1: Identify Assets

**What do you have that matters?**
- Data (customer records, intellectual property, financial data)
- Systems (servers, applications, cloud services)
- People (employees, contractors, partners)
- Reputation (brand, customer trust)

**Tool:** Asset inventory. If you don't know what you have, stop here and fix that first.

---

### Step 2: Identify Threats

**What could go wrong?**

| Threat Category | Examples |
|-----------------|----------|
| **Malicious** | Hackers, ransomware, insider threats, nation-states |
| **Accidental** | Human error, misconfiguration, lost devices |
| **Environmental** | Natural disasters, power failures, physical damage |
| **Structural** | Software bugs, hardware failure, dependency issues |

**2026 update:** AI-generated threats (deepfakes, AI-powered attacks) are now a distinct category.

---

### Step 3: Identify Vulnerabilities

**Where are you weak?**
- Unpatched systems
- Weak passwords
- Missing MFA
- Poor access controls
- Inadequate logging
- Untrained staff

**Sources:**
- Vulnerability scans
- Penetration test reports
- Audit findings
- Incident post-mortems

---

### Step 4: Assess Likelihood

**How probable is this?**

| Rating | Meaning |
|--------|---------|
| **High** | Expected to occur, has happened before, actively exploited |
| **Moderate** | Could occur, some precedent, known vulnerabilities exist |
| **Low** | Unlikely but possible, no immediate threat |

**Be data-driven:**
- CVE databases (what's actually being exploited?)
- Threat intelligence (what are attackers targeting?)
- Your own incident history

---

### Step 5: Assess Impact

**What happens if it succeeds?**

| Impact Area | Questions |
|-------------|-----------|
| **Financial** | Direct losses, regulatory fines, recovery costs |
| **Operational** | Downtime, productivity loss, service disruption |
| **Reputational** | Customer trust, brand damage, media coverage |
| **Legal/Regulatory** | Compliance violations, lawsuits, investigations |
| **Safety** | Physical harm (critical infrastructure, healthcare) |

---

### Step 6: Calculate Risk Level

**Simple matrix approach:**

|  | **Low Impact** | **Moderate Impact** | **High Impact** |
|--|---------------|---------------------|-----------------|
| **High Likelihood** | 🟡 Moderate Risk | 🟠 High Risk | 🔴 Critical Risk |
| **Moderate Likelihood** | 🟢 Low Risk | 🟡 Moderate Risk | 🟠 High Risk |
| **Low Likelihood** | 🟢 Low Risk | 🟢 Low Risk | 🟡 Moderate Risk |

**Prioritize:** Critical → High → Moderate → Low

---

### Step 7: Document and Communicate

**Risk register format:**
| ID | Asset | Threat/Vulnerability | Likelihood | Impact | Risk Level | Treatment | Owner | Review Date |
|----|-------|-------------------|------------|--------|------------|-----------|-------|-------------|
| R001 | Customer DB | SQL injection via web app | High | High | 🔴 Critical | Mitigate (WAF, parameterized queries) | Security Team | Quarterly |

**Communication:**
- Technical details for IT
- Business impact for executives
- Action items for responsible parties

---

## Risk Management Tiers

NIST SP 800-30 defines three tiers of risk assessment:

| Tier | Focus | Example |
|------|-------|---------|
| **Tier 1: Organization** | Mission/business processes | "What's our risk appetite for cloud migration?" |
| **Tier 2: Mission/Business Process** | Operational requirements | "How do we secure our payment processing?" |
| **Tier 3: Information System** | System-level controls | "Is this specific application adequately protected?" |

**Bottom-up vs. Top-down:** Both matter. System-level vulnerabilities can introduce organizational risk. Business decisions can create new system requirements.

---

## Continuous Risk Management: The 2026 Standard

**Old way:** Annual risk assessment, documented in a binder, forgotten until next year

**New way:** Continuous monitoring, real-time dashboards, dynamic risk scoring

**What this looks like:**
- Vulnerability feeds integrated into risk scoring
- Threat intelligence automatically updates likelihood assessments
- Incident response feeds back into risk register
- Quarterly (or monthly) reviews, not annual

**Tools enabling this:**
- GRC platforms (Governance, Risk, Compliance)
- Automated vulnerability management
- Threat intelligence platforms
- SIEM correlation for risk indicators

---

## 💡 Key Takeaways

1. **Risk = Likelihood × Impact** — Simple but powerful
2. **Five treatment options** — Mitigate, Accept, Avoid, Transfer, (never Reject)
3. **Document everything** — Risk register is your accountability trail
4. **Tiered approach** — Organization, process, and system levels
5. **Continuous, not annual** — Real-time risk management is the standard
6. **Business decision** — Security enables business; risk management balances security and operations

---

*"Alright, so you know how to identify and assess risk. Now let's talk about the actual tools—the controls you implement to bring that risk down to acceptable levels. This is where theory becomes reality."*

---

**Sources:** NIST SP 800-30 Rev. 1, CISA Risk Management Guidance, ISACA Risk Management Practices
