# Module 3: Security Frameworks and Controls

*"Alright, time to get tactical. You understand the lifecycle, you know the framework—now let's talk about the actual tools and controls that make security happen. This is where you start thinking like a practitioner, not just a student."*

---

## Security Controls: The Building Blocks

Controls are specific actions, tools, and processes used to reduce risk. You choose based on your organization's threats and risk tolerance.

---

## Types of Controls

### 🔧 Technical Controls

**Hardware, software, and automated systems:**

| Control | Purpose | Examples |
|---------|---------|----------|
| **Firewall** | Filter network traffic | pfSense, Palo Alto, AWS Security Groups |
| **Encryption** | Protect data confidentiality | AES-256, TLS 1.3, BitLocker |
| **IDS/IPS** | Detect/prevent intrusions | Snort, Suricata, Zeek |
| **Endpoint Protection** | Secure devices | CrowdStrike, SentinelOne, Defender |
| **SIEM** | Security monitoring | Splunk, QRadar, Sentinel, Elastic |
| **MFA** | Verify identity | Authenticator apps, hardware keys, biometrics |

**Use case:** First line of defense. Works 24/7 without getting tired.

---

### 📋 Administrative Controls

**Policies, procedures, human-focused processes:**

| Control | Purpose | Examples |
|---------|---------|----------|
| **Security Policies** | Define acceptable use | AUP, Password Policy |
| **Training** | Reduce human error | Phishing simulations, awareness training |
| **Procedures** | Standardize responses | Incident Response Plan, DRP |
| **Background Checks** | Reduce insider threat | Pre-employment screening |
| **Access Reviews** | Maintain least privilege | Quarterly recertification |

**Use case:** When humans are the weak link (often). Technical controls can't stop someone from sharing their password.

---

### 🏢 Physical Controls

**Protection of physical spaces and hardware:**

| Control | Purpose | Examples |
|---------|---------|----------|
| **Locks** | Restrict physical access | Smart locks, badge readers |
| **Guards** | Monitor and respond | Security personnel |
| **Cameras** | Surveillance | CCTV, motion detection |
| **Environmental** | Protect hardware | Fire suppression, HVAC, UPS |
| **Secure Disposal** | Prevent data leakage | Shredders, degaussing |

**Use case:** Data centers, server rooms, sensitive areas. Remember: physical access = owned system.

---

## Defense in Depth: Layering Controls

**Principle:** Never rely on a single control. Layer them so if one fails, others remain.

**Example: Protecting a Database**

| Layer | Control |
|-------|---------|
| **Physical** | Server room locked, badge access |
| **Network** | Firewall, segmentation, IDS |
| **Endpoint** | Server hardening, EDR, logging |
| **Application** | Input validation, parameterized queries |
| **Data** | Encryption at rest, TLS in transit |
| **Access** | RBAC, MFA |
| **Monitoring** | Database activity monitoring, SIEM |

Each layer buys time and increases attacker cost.

---

## Zero Trust Architecture (2026)

**Old way:** "Trust but verify"—inside the network = trusted

**Zero Trust:** **"Never trust, always verify"**

### Core Principles (NIST SP 800-207)

1. **Resource-Based Access:** Every request evaluated independently
2. **Least Privilege:** Minimum necessary access
3. **Assume Breach:** Design as if attacker is already inside
4. **Continuous Verification:** Trust degrades—re-authenticate

**2026 Reality:** Remote work + cloud services = "inside the network" means little. Zero Trust is becoming default.

---

## Framework Implementation

### NIST CSF 2.0 Tiers

| Tier | Characteristics |
|------|-----------------|
| **Tier 1: Partial** | Ad-hoc, reactive, limited awareness |
| **Tier 2: Risk Informed** | Risk-aware, approved processes |
| **Tier 3: Repeatable** | Formal policies, consistent methods |
| **Tier 4: Adaptive** | Dynamic, predictive, automated |

**Most orgs:** Start at Tier 2, aim for Tier 3. Tier 4 is enterprise-grade.

---

## Control Categories

| Type | Purpose | Examples |
|------|---------|----------|
| **Preventive** | Stop before it happens | Firewalls, access controls, encryption, training |
| **Detective** | Alert when it happens | SIEM, log analysis, IDS, anomaly detection |
| **Corrective** | Fix after it happens | Incident response, backup/recovery, patching |
| **Deterrent** | Discourage it | Warning banners, visible security, audit trails |

---

## Real-World Application

**Scenario:** Implementing security for a small healthcare clinic

**GOVERN:** Define roles, risk tolerance

**IDENTIFY:** 15 laptops, 1 server, patient database, WiFi

**PROTECT:**
- Technical: Encrypted laptops, firewall, MFA
- Administrative: Security training, incident response plan
- Physical: Locked server room, cable locks

**DETECT:** Basic SIEM or managed detection service

**RESPOND:** Plan, contacts, isolation procedures

**RECOVER:** Daily encrypted backups, tested monthly

---

## 2026 Emerging Trends

### AI/ML in Security Controls
- **Automated threat detection:** Pattern recognition at scale
- **Behavioral analytics:** UEBA (User and Entity Behavior Analytics)
- **Response automation:** SOAR platforms

### Cloud-Native Controls
- **CASB:** Monitor cloud app usage
- **CWPP:** Secure cloud workloads
- **CSPM:** Configuration monitoring

### Identity-Centric Security
- Identity is the new perimeter
- Continuous authentication beyond network boundaries

---

## Common Mistakes

1. **"We bought the tool, we're secure"** — Tools need configuration and maintenance
2. **"Compliance = Security"** — Checking boxes ≠ actual protection
3. **"Set it and forget it"** — Controls degrade without attention
4. **"Security is IT's job"** — Everyone owns security
5. **"We don't have anything worth stealing"** — Every organization is a target

---

## Key Takeaways

1. **Three control types:** Technical, Administrative, Physical—use all three
2. **Defense in Depth:** Layer controls; never rely on one
3. **Zero Trust:** Never trust, always verify—especially in 2026
4. **Frameworks guide implementation:** Start with NIST CSF 2.0
5. **Controls require maintenance:** They degrade without attention

---

*"Course 1 complete. You now understand what cybersecurity is, how organizations manage it, and the tools they use. Next course: Play It Safe—risk management in depth."*

---

## References

- NIST SP 800-207 (Zero Trust Architecture): https://www.nist.gov/publications/zero-trust-architecture
- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- CISA Cybersecurity Best Practices: https://www.cisa.gov/cybersecurity-best-practices
- NIST CSF Implementation Tiers: https://www.nist.gov/cyberframework/csf-20-implementation-tiers
