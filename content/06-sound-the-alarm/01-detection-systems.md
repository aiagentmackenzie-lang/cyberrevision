# Module 1: Detection Systems

*"Alright, listen up. You can have the best defenses in the world, but if you can't detect when someone gets through, you're flying blind. Detection is where the game is won or lost. In 2026, we're talking about agentic AI, unified platforms, and machine-speed response. SIEM, EDR, NIDS, SOAR—these are your eyes and ears. Let's build a detection program that actually works."*

---

## Why Detection Matters

**Prevention fails.** Firewalls get bypassed. Phishing emails get clicked. Zero-days have no patches. Detection is your safety net—the ability to see attackers inside your environment and respond before damage is done.

**The 2026 Reality:** Alert fatigue is real. 60% of security teams ignore critical alerts because they're drowning in noise. Modern detection isn't about more alerts—it's about intelligent, prioritized, actionable alerts.

---

## SIEM — Security Information and Event Management

### The Big Three (2026)

| Platform | Strength | AI Integration |
|----------|----------|----------------|
| **Splunk Enterprise Security** | Market leader, 100% detection in MITRE evaluations | Charlotte AI, agentic SOC platform |
| **Microsoft Sentinel** | Cloud-native, 350+ connectors, graph-powered | Native AI reasoning, intelligent investigation |
| **Elastic Security** | Open source, no per-endpoint fees, 2,300+ detection rules | GenAI + ML, Elastic AI SOC Engine (EASE) |

### Splunk Enterprise Security

**2026 Focus:** "Agentic SOC Platform" — AI purpose-built for cybersecurity

**Key Capabilities:**
- **Charlotte AI** — 3x faster mean time to respond (MTTR)
- **100% detection** with zero false positives (MITRE Round 7 validated)
- **Shadow AI detection** — Finds unsanctioned AI tools
- **ESCU** (Enterprise Security Content Update) — Continuous detection content

**Best Practice:** Integrates with Cisco for network threat detection. Splunk Attack Range v5 for testing.

### Microsoft Sentinel

**2026 Focus:** "AI-ready platform" — unified cloud-native SIEM

**Key Capabilities:**
- **Model Context Protocol (MCP)** — Agent data access for AI
- **Sentinel Graph** — Correlates posture, activity, threat intel, identity, device
- **350+ pre-built connectors** — Multi-platform, multi-cloud
- **Defender XDR integration** — Unified portal

**Best Practice:** No rip-and-replace. Extends existing Microsoft security ecosystem.

### Elastic Security

**2026 Focus:** "Agentic security operations" — SIEM + XDR + automation

**Key Capabilities:**
- **No per-endpoint fees** — Pricing differentiator
- **2,300+ open-source detection rules** — Community-driven
- **Federated search** — Data mesh architecture
- **Years of archives searchable** — No data movement required

**Best Practice:** Open architecture, no data sampling, built on Elasticsearch.

---

## EDR/XDR — Endpoint Detection and Response

### CrowdStrike Falcon Platform

**2026 Focus:** "Agentic Security Platform" — unified AI-native security

**Key Capabilities:**
- **Single lightweight sensor** — Endpoint, identity, cloud, SaaS, AI protection
- **Falcon Next-Gen SIEM** — Extends endpoint data
- **29-minute average** eCrime breakout time detection
- **AI-trained by elite threat hunters**

**AI Integration:** Charlotte AI assistant, machine-speed protection, automated investigation

### SentinelOne Singularity XDR

**2026 Focus:** "Enterprise-wide security" — See, Protect, Resolve

**Key Capabilities:**
- **100% detection accuracy**, zero delays (MITRE ATT&CK 5 years running)
- **88% less noise** than median vendor
- **Endpoint + Cloud + Identity** coverage
- **Network Discovery** — Rogue device management

**Best Practice:** Used by 4 of Fortune 10. Machine-speed at scale.

### Microsoft Defender for Endpoint

**2026 Focus:** Integrated endpoint protection with automated investigation

**Key Capabilities:**
- **EDR** — Behavioral detection and response
- **Automated Investigation and Response (AIR)**
- **Advanced Hunting** — KQL-based queries
- **Cross-platform** — Windows, Linux, macOS, Android, iOS

**Best Practice:** Native integration with Microsoft 365 and Azure.

---

## NIDS/HIDS — Network and Host Intrusion Detection

### Snort

**Status:** Foremost open-source IPS/IDS

**Modes:**
- **Packet sniffer** — Monitor traffic
- **Packet logger** — Record traffic
- **Full IPS** — Inline blocking

**Rules:**
- **Community Ruleset** — Free
- **Snort Subscriber Ruleset** — Cisco Talos (paid, updated frequently)

**Best Practice:** Rules QAed by Cisco Talos. Regular updates essential.

### Suricata

**Status:** High-performance open-source NIDS/IPS/NSM

**Advantages:**
- **Multi-threaded** — Better performance than single-threaded alternatives
- **Lua scripting** — Custom detection logic
- **File extraction** — Automatic file capture
- **Protocol detection** — HTTP, TLS, DNS, etc.

**2026:** Emerging ML-based detection modules.

### Zeek (formerly Bro)

**Status:** Evidence-based network security monitoring

**Key Concept:** Zeek is **not** an active defense—it's passive traffic analysis

**Capabilities:**
- **High-fidelity transaction logs**
- **File content extraction**
- **Customizable outputs** for SIEM integration
- **Deep network insights**

**Best Practice:** Ideal for manual review and SIEM integration.

---

## Threat Intelligence Platforms

### MISP (Malware Information Sharing Platform)

**Status:** Open-source threat intelligence sharing

**Capabilities:**
- **IOC collection, storage, distribution**
- **Structured threat information**
- **Galaxy clusters** — MITRE ATT&CK, threat actors, ransomware
- **Taxonomies** — TLP, GDPR, VERIS
- **PyMISP** — Python library for API access

**Best Practice:** Join existing MISP communities. Automate exports to IDS/SIEM.

**Cost:** Free, open-source

### ThreatConnect

**Focus:** "Threat and Risk-Informed Defense"

**Capabilities:**
- **Intel Hub** — Threat intel + risk quantification + security operations
- **Risk quantification** — Dollar terms for board reporting
- **ROI measurement** — Security investment justification
- **Polarity integration** — Federated search

**Best Practice:** Focus on operationalizing intelligence, not just managing it.

---

## SOAR — Security Orchestration, Automation and Response

### Palo Alto Cortex XSOAR

**2026 Focus:** "Agentic SOC" — AI agent workforce

**Capabilities:**
- **Cortex AgentiX** — AI agent workforce
- **900+ prebuilt integrations**
- **90% time savings** on incidents
- **Virtual war room** — Collaboration
- **Visual playbook editor** — Code-free automation

**Best Practice:** Automation-first mindset. 1,000+ security actions for DIY playbooks.

### Splunk SOAR (Phantom)

**Status:** Integrated into Splunk's Agentic SOC Platform

**Capabilities:**
- Playbook automation
- Case management
- Integrated threat intelligence

---

## Detection Engineering — Building Detections That Work

### The Detection Lifecycle

```
Research → Develop → Test → Deploy → Tune → Retire
```

**Research:**
- MITRE ATT&CK mapping
- Threat intelligence
- Attack simulations

**Develop:**
- Logic definition
- Data source identification
- Threshold tuning

**Test:**
- Red team validation
- Synthetic data testing
- False positive analysis

**Deploy:**
- Production rollout
- Alert routing
- Playbook association

### Alert Fatigue Mitigation (2026)

**The Problem:** 60% of teams ignore critical alerts due to volume

**Solutions:**

| Approach | Implementation |
|----------|----------------|
| **AI-driven triage** | Automated alert prioritization |
| **Context enrichment** | Add asset value, threat intel, user behavior |
| **Automated investigation** | Run playbooks before human review |
| **Noise reduction** | 88% less noise with modern platforms |
| **Correlation** | Multi-source alerts into single incidents |

**Key Metric:** Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR)

---

## 2026 Detection Trends

| Trend | Description |
|-------|-------------|
| **Agentic AI** | AI agents that act autonomously, not just assist |
| **Unified Platforms** | SIEM + XDR + SOAR convergence |
| **OpenTelemetry** | Standardized telemetry, avoid vendor lock-in |
| **Shadow AI Detection** | Finding unsanctioned AI tools |
| **Graph-Based Security** | Understanding entity relationships |
| **Federated Search** | No data movement for analysis |

---

## Technology Stack Recommendations

| Function | Open Source | Commercial |
|----------|-------------|------------|
| **SIEM** | Elastic | Splunk, Sentinel |
| **EDR/XDR** | Wazuh | CrowdStrike, SentinelOne, Defender |
| **NIDS** | Suricata, Zeek | Corelight |
| **Threat Intel** | MISP | ThreatConnect, Recorded Future |
| **SOAR** | Shuffle, n8n | Cortex XSOAR, Splunk SOAR |

---

## Key Takeaways

1. **SIEM is evolving.** From log aggregation to AI-driven agentic platforms. Splunk, Sentinel, Elastic lead.

2. **EDR is foundational.** Every endpoint needs behavioral detection. CrowdStrike, SentinelOne, Defender are top choices.

3. **Open source is viable.** Suricata, Zeek, MISP, Elastic provide enterprise-grade capabilities.

4. **SOAR automates response.** Playbooks reduce MTTR from hours to minutes. Cortex XSOAR leads.

5. **Alert fatigue is real.** Modern platforms use AI to reduce noise 80%+. Quality over quantity.

---

*"Detection is only half the battle. Once you detect, you need to respond. Next module: Incident Response—the playbook for when everything goes wrong."*
