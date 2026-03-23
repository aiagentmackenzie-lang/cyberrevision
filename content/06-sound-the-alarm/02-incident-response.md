# Module 2: Incident Response

*"Alright, so you detected something. Now what? Panic is not a strategy. Incident response is where preparation meets execution. In 2026, with ransomware hitting every 11 seconds and average breach costs at $4.88 million, you need a rock-solid IR plan. NIST framework, playbooks, tabletop exercises—this is how you survive when the worst happens."

---

## Why Incident Response Matters

**Breaches are inevitable.** It's not if, it's when. The difference between a $50k incident and a $5M disaster is how you respond. Speed matters. Preparation matters. Having a plan matters.

**The Numbers:**
- Average time to contain a breach: **277 days**
- Organizations with IR plans: **Save $2.66 million** per breach
- Ransomware attacks: **Every 11 seconds**

**Reality:** Most organizations don't have tested IR plans. They make it up as they go. That's expensive.

---

## NIST SP 800-61r2 — The Gold Standard

### NIST Incident Response Lifecycle

```
┌─────────────┐   ┌────────────┐   ┌──────────┐   ┌─────────────┐   ┌───────────┐   ┌───────────┐   ┌─────────────┐
│ PREPARATION │ → │ DETECTION  │ → │ ANALYSIS │ → │ CONTAINMENT │ → │ ERADICATION │ → │  RECOVERY   │ → │ POST-INCIDENT │
└─────────────┘   └────────────┘   └──────────┘   └─────────────┘   └───────────┘   └───────────┘   └─────────────┘
```

### Phase 1: Preparation

**Before the incident—building capabilities:**

| Activity | Implementation |
|----------|----------------|
| **IR Plan Development** | Documented procedures, roles, responsibilities |
| **Team Training** | Technical skills, soft skills, legal requirements |
| **Tool Deployment** | Forensics workstations, secure communication, jump bags |
| **Playbook Creation** | Specific scenarios: ransomware, phishing, insider threat |
| **Tabletop Exercises** | Simulate incidents, test procedures |
| **Relationships** | Law enforcement contacts, legal counsel, PR firm |
| **Asset Inventory** | Critical systems, dependencies, business priorities |

**2026 Addition:** AI-powered preparation — automated threat simulation, predictive risk assessment.

### Phase 2: Detection & Analysis

**Identifying and understanding the incident:**

| Activity | Key Questions |
|----------|---------------|
| **Initial Detection** | SIEM alert, user report, external notification |
| **Triage** | Is this real? What's the scope? What's the impact? |
| **Analysis** | How did they get in? What did they touch? Are they still here? |
| **Evidence Collection** | Logs, memory dumps, disk images, network captures |
| **Indicator Identification** | IOCs — IPs, hashes, domains, patterns |

**Key Tools:**
- SIEM for log analysis
- EDR for endpoint investigation
- Threat intelligence for context
- Timeline analysis for reconstruction

### Phase 3: Containment

**Stopping the bleeding:**

| Strategy | Use Case |
|----------|----------|
| **Short-term containment** | Immediate isolation — disconnect network, disable accounts |
| **System isolation** | Quarantine compromised systems |
| **Segmentation** | Prevent lateral movement |
| **Evidence preservation** | Image disks before remediation |

**Critical Decision:** Do you shut down production to stop the attacker, or keep running to maintain business? There's no universal right answer.

### Phase 4: Eradication

**Removing the threat:**

| Activity | Details |
|----------|---------|
| **Malware removal** | Antivirus, manual cleanup, reimaging |
| **Backdoor elimination** | Persistence mechanisms, rogue accounts |
| **Vulnerability patching** | Close entry points |
| **Credential reset** | Rotate all potentially compromised credentials |
| **System rebuilding** | Sometimes cleaner than cleaning |

**Best Practice:** Document everything. You'll need to prove the threat is gone.

### Phase 5: Recovery

**Returning to normal operations:**

| Activity | Timeline |
|----------|----------|
| **System restoration** | From known-good backups |
| **Verification** | Testing before going live |
| **Monitoring enhancement** | Increased vigilance post-recovery |
| **Gradual restoration** | Critical systems first, then others |
| **Business validation** | Confirm operations are normal |

**Warning:** Attackers often re-compromise. Monitor closely during recovery.

### Phase 6: Post-Incident Activity

**Learning and improving:**

| Activity | Output |
|----------|--------|
| **Lessons learned** | What worked, what didn't |
| **Evidence retention** | Legal requirements, chain of custody |
| **Report creation** | Executive summary, technical details |
| **Procedure updates** | Revise IR plan based on experience |
| **Training updates** | New scenarios, improved techniques |
| **Metrics capture** | MTTD, MTTR, cost, impact |

---

## Incident Response Playbooks

### Ransomware Playbook (2026)

```
1. DETECTION → SIEM alert, user report, encrypted files
2. CONTAINMENT → Isolate affected systems immediately
3. ASSESSMENT → Determine scope, backup availability
4. DECISION → Pay ransom? (Generally no) / Restore from backup?
5. ERADICATION → Reimage affected systems
6. RECOVERY → Restore from clean backups
7. POST-INCIDENT → Law enforcement report, lessons learned
```

**Critical Steps:**
- Do NOT negotiate without legal counsel
- Preserve evidence for law enforcement
- Test backup restoration before paying
- Document ransom demand for insurance

### Phishing Playbook

```
1. DETECTION → User reports suspicious email
2. ANALYSIS → Check IOCs, analyze attachment/URL
3. CONTAINMENT → Block IOCs at firewall/email gateway
4. HUNTING → Search for similar emails across organization
5. REMEDIATION → User training, credential reset if clicked
6. REPORTING → Update threat intelligence, share IOCs
```

### Data Breach Playbook

```
1. DETECTION → Unusual data access, external notification
2. CONTAINMENT → Stop exfiltration, preserve evidence
3. ASSESSMENT → What data? How many records? PII involved?
4. LEGAL → Attorney-client privilege, breach notification laws
5. NOTIFICATION → Regulators, affected individuals, media
6. REMEDIATION → Fix cause, enhance monitoring
7. POST-INCIDENT → Compliance audit, procedure review
```

---

## Tabletop Exercises

### Purpose

Test IR procedures without a real incident. Identify gaps. Build muscle memory.

### Exercise Types

| Type | Scope | Duration |
|------|-------|----------|
| **Discussion-based** | Talk through scenarios | 2-4 hours |
| **Simulation** | Walk through with time pressure | Half day |
| **Live exercise** | Technical response (red team) | Full day |
| **Crisis simulation** | Executive decision-making | 4-8 hours |

### Sample Scenarios (2026)

1. **Ransomware at 3 AM** — Encryption spreading, backups compromised
2. **Supply Chain Compromise** — Trusted vendor update is malicious
3. **Insider Threat** — Employee exfiltrating customer data
4. **Cloud Misconfiguration** — Public S3 bucket with PII discovered
5. **AI System Compromise** — Prompt injection in customer-facing AI
6. **Zero-Day Exploitation** — No patch available, active exploitation

### Exercise Structure

```
Inject 1: Initial detection
├─ Discussion: How would you detect this?
├─ Decision: Who do you call?
└─ Action: What do you do first?

Inject 2: Scope expansion
├─ Discussion: What systems are affected?
├─ Decision: Containment strategy?
└─ Action: Execute containment

Inject 3: External pressure
├─ Discussion: Media inquiry, customer complaints
├─ Decision: Communication strategy?
└─ Action: Execute communications

Inject 4: Recovery
├─ Discussion: Lessons learned?
├─ Decision: What would you change?
└─ Action: Update procedures
```

---

## War Room Management

### Physical/Virtual War Room Setup

| Role | Responsibility |
|------|----------------|
| **Incident Commander** | Overall coordination, decision authority |
| **Technical Lead** | Technical response, forensics, containment |
| **Communications Lead** | Internal/external communications |
| **Legal Counsel** | Legal implications, privilege protection |
| **HR Representative** | Employee issues, insider threats |
| **Business Liaison** | Business impact assessment |

### Communication Protocols

**Internal:**
- Secure communication channels (assume primary compromised)
- Regular status updates (every 2 hours during active incident)
- Escalation thresholds

**External:**
- Law enforcement (FBI, Secret Service, local police)
- Cyber insurance carrier
- Legal counsel
- PR firm (if public)
- Customers (if required by breach laws)

---

## Legal and Regulatory Requirements

### Breach Notification Laws (2026)

| Jurisdiction | Timeline | Trigger |
|--------------|----------|---------|
| **GDPR (EU)** | 72 hours to regulator | Personal data breach |
| **US State Laws** | Varies (24 hours to "without unreasonable delay") | Most include PII, health, financial |
| **SEC (Public Companies)** | 4 business days | Material cybersecurity incident |
| **HIPAA (Healthcare)** | 60 days to individuals | PHI breach |
| **State Attorneys General** | Varies by state | Consumer notification requirements |

**2026 Trend:** Increasing specificity, shorter timelines, higher penalties.

### Cyber Insurance

**Coverage Types:**
- Incident response costs
- Business interruption
- Data recovery
- Regulatory fines (where insurable)
- Ransom payments (controversial)
- Crisis management/PR

**Requirements:**
- IR plan documentation
- Regular security assessments
- Specific control implementations
- Incident reporting timelines

---

## 2026 Incident Response Trends

| Trend | Impact |
|-------|--------|
| **AI-Assisted Response** | Automated containment, intelligent triage |
| **Cloud-Native IR** | Container forensics, cloud API integration |
| **Ransomware Specialization** | Dedicated ransomware response firms |
| **Threat Intelligence Integration** | Real-time IOC feeds during incidents |
| **Automation-First** | SOAR playbooks for common scenarios |
| **Remote IR Teams** | Distributed response, virtual war rooms |

---

## Key Takeaways

1. **Preparation prevents panic.** Have a plan before you need it. Test it regularly.

2. **NIST framework works.** Preparation → Detection → Analysis → Containment → Eradication → Recovery → Post-Incident.

3. **Playbooks save time.** Specific procedures for ransomware, phishing, data breach. Don't improvise under pressure.

4. **Tabletop exercises build muscle memory.** Test quarterly. Find gaps before attackers do.

5. **Legal and compliance are critical.** Breach notification laws have teeth. Know your obligations.

---

*"Detection and response are connected. Last module: Digital Forensics—the technical deep dive into understanding what actually happened."*
