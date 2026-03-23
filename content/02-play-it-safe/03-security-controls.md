# Module 3: Security Controls

*"This is where the rubber meets the road. You've assessed your risk, you've got executive buy-in—now what? You implement controls. But not just any controls. The right controls, implemented correctly, monitored continuously. Let me show you how the catalog works and how to choose wisely."*

---

## NIST SP 800-53: The Security Control Catalog

**Current Version:** Revision 5 (with updates) — **The definitive control framework**

Originally built for U.S. federal agencies, SP 800-53 has become the global gold standard for security controls. **Any organization can adopt it**, and many do.

### Why This Matters

When someone asks *"Are we secure?"* — this catalog gives you the vocabulary to answer. It's not vague hand-waving; it's specific, testable controls.

---

## Control Baseline Levels

NIST 800-53 doesn't expect everyone to implement everything. It uses **three baselines** based on impact:

### Low-Impact Systems

**Controls:** 149 controls and enhancements

**Characteristics:**
- Limited adverse effects if compromised
- Public information or non-sensitive data
- Basic security is sufficient

**Example:** Public website, marketing blog, general information systems

---

### Moderate-Impact Systems ⭐ **(Most Common)**

**Controls:** 138-287 controls and enhancements

**Characteristics:**
- Serious adverse effects possible
- Contains internal or sensitive data
- Requires robust security measures

**Example:** Email systems, internal databases, customer management systems

---

### High-Impact Systems

**Controls:** 370+ controls and enhancements

**Characteristics:**
- Severe or catastrophic effects if compromised
- Critical infrastructure, classified data, financial systems
- Maximum security measures required

**Example:** Power grid control systems, classified networks, core financial transaction processing

---

## The Three Control Categories

### 1. Management Controls 🏢

**Focus:** Policies, procedures, risk management, governance

| Control ID | Control Name | What It Means |
|------------|--------------|---------------|
| **PM-1** | Information Security Program Plan | Document your security program—what you're doing and why |
| **RA-1** | Risk Assessment Policy | Formal policy requiring regular risk assessments |
| **IR-1** | Incident Response Policy | Documented incident response capability |
| **AU-1** | Audit and Accountability Policy | Logging requirements and review procedures |

**Why they matter:** You can have the best technical controls in the world, but if there's no policy, no accountability, and no process—it doesn't count.

---

### 2. Operational Controls ⚙️

**Focus:** People, processes, physical security

| Control ID | Control Name | What It Means |
|------------|--------------|---------------|
| **AT-2** | Security Awareness Training | Users must understand threats and their responsibilities |
| **PS-3** | Personnel Screening | Background checks commensurate with risk |
| **MP-2** | Media Access | Control physical access to storage media |
| **PE-2** | Physical Access Authorizations | Who can enter sensitive areas |
| **MA-1** | System Maintenance Policy | Controlled maintenance procedures |

**Why they matter:** Humans are often the weakest link. These controls address the "people problem."

---

### 3. Technical Controls 🔧

**Focus:** Hardware, software, automated mechanisms

| Control ID | Control Name | What It Means |
|------------|--------------|---------------|
| **AC-2** | Account Management | Proper lifecycle for user accounts |
| **AC-17** | Remote Access | Secure remote access requirements |
| **SC-7** | Boundary Protection | Firewalls, network segmentation |
| **SC-13** | Cryptographic Protection | Encryption for data at rest and in transit |
| **SI-4** | Information System Monitoring | SIEM, intrusion detection, log analysis |

**Why they matter:** These are your automated defenses—the workhorses that operate 24/7.

---

## Control Implementation: The Enhancement System

Here's where it gets interesting. NIST controls have **enhancements**—additional requirements that increase rigor:

**Example: AC-2 (Account Management)**
- **AC-2(1):** Automated account management
- **AC-2(2):** Removal of temporary accounts
- **AC-2(3):** Disable accounts after inactivity
- **AC-2(4):** Automated audit actions

**Each enhancement adds specificity.** You're not just "managing accounts"—you're automatically disabling dormant accounts, removing temporary access, and auditing privileged actions.

---

## C-SCRM: Cybersecurity Supply Chain Risk Management

**Current Standard:** NIST SP 800-161 Rev. 1 (May 2022)

This is **critical in 2026.** Your security is only as strong as your weakest supplier.

### The Supply Chain Problem

| Stage | Risk |
|-------|------|
| **Design** | Backdoors in specifications |
| **Development** | Malicious code insertion |
| **Production** | Counterfeit components |
| **Distribution** | Tampering in transit |
| **Acquisition** | Compromised vendor |
| **Maintenance** | Unauthorized updates |
| **Disposal** | Data not properly destroyed |

### Key C-SCRM Controls

| Control | Purpose |
|---------|---------|
| **SA-12** | Supply Chain Protection |
| **SR-3** | Supply Chain Risk Assessment |
| **SR-4** | Provenance |
| **SR-5** | Acquisition Strategies |
| **SR-6** | Supplier Assessments |

**2026 Priority:** The **ICT SCRM Task Force** (co-chaired by CISA and industry) is active through January 2026. **AI supply chain security** is now an emerging workstream.

---

## SBOM: Software Bill of Materials

**What:** A nested inventory of software components

**Analogy:** Like an ingredient list for food, but for software

**Why it matters:**
- You can't patch what you don't know you have
- Log4j (2021) showed us the danger of unknown dependencies
- **CISA is actively promoting SBOM adoption**

**Implementation:**
- SPDX format (Linux Foundation)
- CycloneDX format (OWASP)
- Automatic generation in CI/CD pipelines

**Related:** **VEX (Vulnerability Exploitability eXchange)** — attestation that products aren't affected by specific CVEs

---

## Third-Party Risk Management (TPRM)

**The uncomfortable truth:** Your risk extends through your entire supply chain. Your contractors. Their contractors. All the way down.

### TPRM Process

| Step | Action |
|------|--------|
| **1. Inventory** | Who are your third parties? What do they have access to? |
| **2. Assess** | Security questionnaires, SOC 2 reports, penetration tests |
| **3. Categorize** | Critical vs. important vs. low-risk vendors |
| **4. Contract** | Security requirements in agreements |
| **5. Monitor** | Continuous monitoring, not just annual reviews |
| **6. Respond** | Incident response coordination |

### Red Flags 🚩

- Vendor won't share security documentation
- No incident response plan
- No evidence of security testing
- Outsourced to fourth parties without your knowledge
- No business continuity plan

---

## Continuous Control Monitoring

**The 2026 Standard:** Controls aren't "set and forget"

### What Continuous Monitoring Looks Like

| Control | Traditional | Continuous |
|---------|-------------|------------|
| **Access Reviews** | Quarterly manual review | Automated daily attestation with anomaly alerts |
| **Vulnerability Scanning** | Monthly scan | Continuous automated scanning with ticketing |
| **Log Review** | Weekly manual review | Real-time SIEM correlation with automated response |
| **Penetration Testing** | Annual test | Continuous attack simulation (BAS) |

**Tools enabling this:**
- GRC platforms with real-time feeds
- Automated control testing
- Security orchestration (SOAR)
- Continuous compliance monitoring

---

## Selecting the Right Controls

### Framework-Driven Approach

1. **Start with your baseline** (Low/Moderate/High)
2. **Tailor to your environment** — Remove irrelevant, add specific
3. **Document your rationale** — Why did you choose these?
4. **Implement with rigor** — "Implemented" means "working," not "installed"
5. **Assess independently** — Third-party validation
6. **Monitor continuously** — Are they still effective?

### Risk-Based Approach

**Don't implement controls in a vacuum.** Map them to your risk register:

| Risk | Controls That Address It |
|------|--------------------------|
| Credential theft | MFA (IA-2), strong passwords (IA-5), monitoring (SI-4) |
| Data breach | Encryption (SC-28), access controls (AC-3), DLP (SI-4) |
| Ransomware | Backups (CP-9), segmentation (SC-7), email security (SC-7) |

---

## Common Control Implementation Mistakes

1. **"Checkbox security"** — Implemented technically, but not operationally effective
2. **Scope creep** — Implementing high controls for low-risk systems (waste of money)
3. **Documentation gaps** — "We do this" but can't prove it
4. **Assessment shortcuts** — Self-assessment only, no independent validation
5. **No monitoring** — Controls implemented but never checked

---

## 💡 Key Takeaways

1. **NIST SP 800-53 Rev. 5** is the control catalog—149 controls for Low, up to 370+ for High
2. **Three categories:** Management, Operational, Technical—all necessary
3. **Enhancements add rigor** — Base control + specific requirements
4. **Supply chain is critical** — C-SCRM (SP 800-161), SBOM adoption
5. **Continuous monitoring** — Real-time validation, not annual checkbox
6. **Map controls to risk** — Don't implement blindly; tie to specific risks

---

*"Alright, you've got frameworks, risk management, and controls down. You now understand how mature organizations approach security systematically. Course 2 complete. Next up: Course 3—Connect and Protect, where we dive into networks and network security."*

---

**Sources:** NIST SP 800-53 Rev. 5, NIST SP 800-161 Rev. 1, CISA ICT SCRM Task Force, CISA SBOM Guidance
