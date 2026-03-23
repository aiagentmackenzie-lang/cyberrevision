# Module 1: Asset Management

*"Alright, listen up. You can't protect what you don't know you have. Shadow IT, cloud sprawl, IoT devices under desks—assets are everywhere, and attackers are finding them before you do. Asset management isn't sexy, but it's foundational. In 2026, with AI-powered discovery and cloud-native everything, you need complete visibility. Let's get your house in order."*

---

## Why Asset Management Matters

**You can't secure what you can't see.** The average enterprise has 30-40% more IT assets than they think. Shadow IT, cloud instances spun up by developers, BYOD devices, IoT sensors—every unknown asset is a potential entry point.

**Reality Check:** Most breaches exploit assets the organization didn't know existed. That forgotten server. That cloud storage bucket. That IoT thermostat with default credentials.

---

## Asset Inventory — Your Foundation

### The CMDB (Configuration Management Database)

**Purpose:** Single source of truth for all IT assets—hardware, software, cloud, mobile.

**Modern CMDB Features (2026):**
- **AI-powered discovery** — Automated asset identification across environments
- **Real-time synchronization** — Not periodic audits, continuous updates
- **Multi-cloud visibility** — AWS, Azure, GCP, on-premises, all in one view
- **Relationship mapping** — Dependencies, connections, business impact

### Leading ITAM Platforms 2026

| Platform | Strength | Best For |
|----------|----------|----------|
| **ServiceNow ITAM** | AI agents for lifecycle automation | Large enterprises |
| **Flexera One** | Hybrid IT visibility + FinOps | Multi-cloud organizations |
| **Axonius** | Cybersecurity asset management | Security-first teams |
| **Device42** | Auto-updating CMDB | Mid-market |
| **Lansweeper** | Agentless discovery | Agentless requirements |

**Key Trend:** Convergence of ITAM, SaaS management, and FinOps into unified platforms.

---

## Data Classification — Know Your Data

### The Four Levels

| Level | Description | Examples | Handling |
|-------|-------------|----------|----------|
| **Public** | No restrictions | Marketing materials, website content | Standard controls |
| **Internal** | Organization-only | Org charts, internal policies | Basic access controls |
| **Confidential** | Restricted access | Financial data, customer PII | Need-to-know, encryption |
| **Restricted** | Highly sensitive | Trade secrets, M&A data, passwords | Strict controls, monitoring |

### Classification at Creation

**2026 Best Practice:** Classify data when it's created, not discovered later.

**Automated Classification Tools:**
- **Microsoft Purview** — Auto-labeling based on content inspection
- **Varonis** — Data classification + access analytics
- **BigID** — Discovery and classification at scale
- **ServiceNow** — Integrated with ITAM workflows

**Key Insight:** Data classification drives security controls. You apply different protection to Restricted vs. Public data. Get classification wrong, and you're either over-protecting (waste) or under-protecting (risk).

---

## Data Lifecycle — From Creation to Destruction

### The Six Stages

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ CREATE  │ → │  STORE  │ → │   USE   │ → │  SHARE  │ → │ ARCHIVE │ → │ DESTROY │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

| Stage | Security Controls |
|-------|-------------------|
| **Create** | Input validation, DLP, classification tagging |
| **Store** | Encryption, access controls, backup, versioning |
| **Use** | Access logging, data masking, least privilege |
| **Share** | Secure transfer, encryption in transit, audit trails |
| **Archive** | Cold storage, retention policies, searchability |
| **Destroy** | Cryptographic erasure, physical destruction, certificates |

**Security Principle:** Each stage needs appropriate controls. Data at rest encrypted. Data in transit encrypted. Data in use monitored.

**2026 Automation:** Platforms like ServiceNow and IBM Cloud Object Storage automate lifecycle policies—move data to cheaper storage, delete after retention period, notify before destruction.

---

## Shadow IT — The Problem You Don't See

**Definition:** IT systems, devices, software, and services used without explicit IT department approval.

**The Scale:** Average enterprise has **900+ cloud services** in use; IT knows about 300.

### Discovery Methods

| Method | What It Finds | Tools |
|--------|---------------|-------|
| **Network Traffic Analysis** | All cloud services in use | Cisco Umbrella, Zscaler, Netskope |
| **Identity Log Analysis** | SSO-enabled apps | Okta, Azure AD, Ping Identity |
| **Expense Analysis** | Unsanctioned purchases | Coupa, SAP Ariba |
| **Endpoint Agents** | Installed applications | CrowdStrike, SentinelOne |
| **CASB** | Cloud app visibility | Microsoft Defender CASB |

### Shadow IT Management Strategy

1. **Discover** — Complete visibility before enforcement
2. **Assess** — Risk classification (low/medium/high/critical)
3. **Sanction** — Formal path to approve legitimate tools
4. **Block** — Prevent high-risk apps at network/proxy level
5. **Educate** — Training on approved alternatives

**Leading SaaS Management 2026:** Flexera One, Zylo, Productiv, Torii

---

## Cloud Assets — The New Perimeter

### CSPM (Cloud Security Posture Management)

**Purpose:** Continuously monitor cloud configurations for security and compliance.

**Core Capabilities:**
- Misconfiguration detection
- Compliance monitoring (CIS, PCI-DSS, HIPAA)
- Asset inventory across clouds
- IAM analysis (excessive permissions)
- Container security

### 2026 CSPM Leaders

| Platform | Strength | Coverage |
|----------|----------|----------|
| **Wiz** | Agentless, unified visibility | AWS, Azure, GCP, Kubernetes |
| **Orca Security** | Side-scanning, full-stack | AWS, Azure, GCP, Alibaba |
| **Prisma Cloud** | CWPP + CSPM integration | Multi-cloud + containers |
| **Microsoft Defender** | Native Azure integration | Azure-first, multi-cloud |

**Critical Cloud Assets to Track:**
- Compute instances (VMs, serverless)
- Storage buckets (S3, Blob, Cloud Storage)
- Databases (RDS, Cosmos DB, Cloud SQL)
- Identity (IAM roles, service accounts)
- Networks (VPCs, subnets, security groups)
- Containers (EKS, AKS, GKE clusters)

**Security Tagging Strategy:** Consistent resource tagging enables cost allocation, security scanning, and automated policy enforcement.

---

## BYOD — Personal Devices, Corporate Risk

### BYOD Security Framework

| Component | Implementation |
|-----------|----------------|
| **MDM** (Mobile Device Management) | Device enrollment, policy enforcement |
| **MAM** (Mobile Application Management) | App-level control, data containerization |
| **Conditional Access** | Risk-based access decisions |
| **Containerization** | Separate work/personal data |

### Key Controls

- **Certificate-based authentication** — Device identity verification
- **App allowlisting** — Only approved corporate apps
- **Remote wipe** — Selective wipe of corporate data (not personal)
- **Data loss prevention** — Prevent copy/paste to personal apps
- **OS version requirements** — Minimum security patch levels
- **Jailbreak/root detection** — Block compromised devices

### Leading MDM/MAM 2026

| Platform | Focus |
|----------|-------|
| **Microsoft Intune** | Deep Azure integration, conditional access |
| **VMware Workspace ONE** | Unified endpoint management |
| **Jamf Pro** | Apple-focused (macOS, iOS) |

---

## IoT Assets — The Invisible Attack Surface

### IoT Challenges

| Challenge | Risk | Mitigation |
|-----------|------|------------|
| **Device Discovery** | Unknown devices on network | Network scanning, MAC profiling |
| **Firmware Management** | Unpatched vulnerabilities | OTA update systems |
| **Long Lifecycles** | Devices live 10+ years | Retirement planning |
| **Shadow IoT** | Consumer devices | Network access control (NAC) |

### IoT Security Framework

1. **Discover** — Identify all IoT/OT devices
2. **Classify** — Categorize by function and risk
3. **Assess** — Evaluate vulnerabilities and exposure
4. **Segment** — Isolate IoT from critical networks
5. **Monitor** — Continuous behavioral analysis
6. **Patch** — Firmware update automation
7. **Decommission** — Secure disposal procedures

**Leading IoT Security Tools:** Armis (agentless discovery), Claroty (industrial IoT), Microsoft Defender for IoT, Forescout (NAC)

---

## Asset Valuation — What's It Worth?

### Key Metrics

| Metric | Purpose | Calculation |
|--------|---------|-------------|
| **TCO** | Long-term cost planning | Purchase + Maintenance + Support |
| **Risk-Adjusted Value** | Security prioritization | Asset Value × Risk Factor |
| **Business Criticality** | Prioritization matrix | Impact × Probability |

**Security Application:** Assets with high business criticality and high exposure get priority for security controls.

---

## Key Takeaways

1. **You can't protect what you can't see.** AI-powered discovery tools are essential in 2026.

2. **Classify data at creation.** Don't try to classify data you already have—it's too late.

3. **Shadow IT is real.** 900+ cloud services, IT knows about 300. Discovery tools find the rest.

4. **Cloud assets need CSPM.** Misconfigurations are the #1 cloud security risk.

5. **IoT is invisible.** Network scanning and segmentation are mandatory.

---

*"Next up: the threat landscape. Who's attacking you, what they want, and how they operate. Understanding your adversaries is half the battle."*
