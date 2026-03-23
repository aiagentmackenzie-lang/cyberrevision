# Module 2: The Security Lifecycle

*"Alright, so you understand what cybersecurity is. Now let's talk about how organizations actually do cybersecurity. Spoiler: It's not just buying a firewall and calling it a day. There's a framework—a continuous cycle of identifying, protecting, detecting, responding, and recovering. Let's break down how the pros actually run security programs."*

---

## The Security Lifecycle: An Overview

You can't protect everything perfectly all the time—that would cost infinite money and stop business cold. So what do you do?

You follow a **lifecycle**—a continuous process of:
1. **Identify** what you have and what risks you face
2. **Protect** with appropriate controls
3. **Detect** when something goes wrong
4. **Respond** to incidents
5. **Recover** and improve

It's not a one-time project. It's a way of operating.

---

## NIST Cybersecurity Framework 2.0 (2024)

**NIST CSF 2.0** (released February 2024) is what most organizations use. There's a critical addition from version 1.1.

### The Six Functions

| Function | Purpose | What It Means |
|----------|---------|---------------|
| **GOVERN** | Risk governance | Leadership sets strategy and oversees execution |
| **IDENTIFY** | Asset management | "What do we have? What's valuable? What could go wrong?" |
| **PROTECT** | Safeguards | "How do we keep threats out?" |
| **DETECT** | Monitoring | "How do we know if something's wrong?" |
| **RESPOND** | Incident response | "What do we do when something goes wrong?" |
| **RECOVER** | Resilience | "How do we get back to normal?" |

**Key Insight:** GOVERN was added because without leadership buy-in and strategy, the other five functions fall apart. **Cybersecurity is a business function, not just IT.**

---

## Breaking Down the Functions

### 🔷 GOVERN (The Foundation)

**Organizational context:**
- Understanding mission, stakeholders, risk tolerance
- Establishing roles and responsibilities
- Creating policies that actually get followed
- **Oversight**—leadership needs visibility

**Real talk:** Companies spend millions on security tools that sit unused because there was no governance. Don't skip this.

---

### 🔍 IDENTIFY

Before you protect anything, know what you have:

**Key Activities:**
- **Asset Inventory:** Hardware, software, data, people
- **Risk Assessment:** What threats apply? What's your exposure?
- **Business Environment:** How does security support mission?

**Hard Truth:** Most organizations can't tell you how many laptops they have, let alone what's on them. Start here.

---

### 🛡️ PROTECT

This is what most people think of as "cybersecurity":

**Key Controls:**
- **Access Control:** Who can access what? (Least privilege)
- **Awareness Training:** Humans are still the weakest link
- **Data Security:** Encryption at rest and in transit
- **Protective Technology:** Firewalls, endpoint protection, email security

**2026 Reality:** With remote work normalized, "perimeter defense" is dead. Protect data wherever it lives.

---

### 👁️ DETECT

You will get breached. The question is: **Will you know?**

**Key Activities:**
- **Continuous Monitoring:** Logs, network traffic, endpoint activity
- **Anomaly Detection:** What's normal? What's suspicious?
- **Detection Processes:** Clear procedures for alerts

**Average breach detection time:** 287 days (almost 10 months of silent compromise). Detection is critical.

---

### 🚨 RESPOND

When (not if) an incident happens, you need a plan:

**Key Components:**
- **Response Planning:** Documented procedures before chaos
- **Communications:** Who do you tell? When? How?
- **Mitigation:** Stopping the attack, containing damage
- **Lessons Learned:** Change so it doesn't happen again

**Pro tip:** Run tabletop exercises. Simulate a ransomware attack at 2 AM. Find gaps fast.

---

### 🔄 RECOVER

Business continuity is the goal:

**Key Activities:**
- **Recovery Planning:** How do we restore operations?
- **Improvements:** What failed? How do we strengthen?
- **Communications:** Keeping stakeholders informed

---

## How It All Fits Together

```
GOVERN → IDENTIFY → PROTECT → DETECT → RESPOND → RECOVER
   ↑                                              ↓
   └────────────── Continuous Loop ←─────────────┘
```

**It's continuous:**
1. Identify new assets and risks
2. Update protections
3. Tune detection
4. Practice response
5. Improve recovery

---

## Other Frameworks

While NIST CSF 2.0 is the standard, organizations also use:

| Framework | Best For | Current Version |
|-----------|----------|-----------------|
| **ISO/IEC 27001** | International certification | 2022 |
| **CIS Controls** | Technical controls | v8.1 (2024) |
| **COBIT** | IT governance | 2019 |
| **CMMC** | U.S. Defense contractors | 2.0 |

**Good news:** They're all compatible. NIST CSF 2.0 maps to ISO 27001, CIS Controls, and others.

---

## 2026 Updates

- **CSF 2.0 expanded scope:** Applies to all organizations, not just critical infrastructure
- **Small org guidance:** NIST recognized not everyone has Fortune 500 budgets
- **Cyber AI Profile:** Preliminary draft for AI system security (January 2026)
- **SP 1308:** Quick-start guide for enterprise risk and workforce management

---

## Key Takeaways

1. **The Security Lifecycle is continuous**—not a one-time project
2. **GOVERN is critical**—leadership sets tone and strategy
3. **You can't protect what you don't know**—asset inventory is foundational
4. **Detection matters as much as protection**—assume breach, plan accordingly
5. **Frameworks provide structure**—use NIST CSF 2.0 as your blueprint

---

*"Okay, we know the lifecycle. Next: the actual frameworks and controls—where theory meets practice."*

---

## References

- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- NIST SP 1308 Quick-Start Guide: https://www.nist.gov/publications/nist-sp-1308
- CISA Cybersecurity Best Practices: https://www.cisa.gov/cybersecurity-best-practices
- NIST CSF 2.0 February 2024 Release: https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-its-cybersecurity-framework
