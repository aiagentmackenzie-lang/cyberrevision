# Module 3: Network Security

*"Alright, this is where it all comes together. You've learned how networks work and the protocols they use—now let's talk about defending them. Firewalls, VPNs, IDS/IPS, segmentation, and Zero Trust. In 2026, the perimeter is dead, encryption is mandatory, and AI is augmenting every security control. Here's how the pros actually protect networks."*

---

## Why Network Security Matters More Than Ever

**The perimeter is dissolving.** Remote work, cloud services, IoT devices—your network isn't a castle with a moat anymore. It's a sprawling, interconnected ecosystem that requires defense in depth.

**Key Stats (2026):**
- 1 in 4 attacks exploit public-facing application vulnerabilities
- Ransomware attacks happen every 11 seconds
- Average breach detection time: 287 days

**Your job:** Make the cost of attack higher than the value of the target.

---

## Firewalls — Still Your First Line of Defense

### Traditional Firewall Types

| Type | Function | Limitations |
|------|----------|-------------|
| **Packet Filtering** | Inspect headers (IP, port, protocol) | No payload inspection, vulnerable to spoofing |
| **Stateful Inspection** | Track connection state | Limited application awareness |
| **Application Layer (Proxy)** | Inspect application data | Higher latency, complex config |
| **Circuit-Level** | Monitor TCP handshakes | Doesn't inspect actual data |

### Next-Generation Firewalls (NGFW) — Current Standard

**Definition:** Third-generation combining traditional firewall with Deep Packet Inspection (DPI), application control, and IPS.

**Key Features:**
- **Deep Packet Inspection** — Examines actual payload, not just headers
- **Application awareness** — Identifies apps regardless of port (Skype on 443, etc.)
- **TLS/SSL inspection** — Decrypts and re-encrypts HTTPS traffic
- **Content filtering** — Block malware, malicious sites
- **Identity management** — LDAP, RADIUS, Active Directory integration
- **Integrated IPS** — Real-time intrusion prevention

**Why NGFWs Exist:** Traditional port-based blocking fails. Apps tunnel over 80/443. You need to inspect payload, not just ports.

**2026 NGFW Trends:**
- **AI-powered threat detection** — Machine learning for anomaly detection
- **Cloud-native firewall-as-a-service** — Scalable, distributed
- **Zero Trust integration** — Identity-aware policies
- **TLS 1.3 inspection challenges** — Encrypted SNI, faster handshakes

---

## VPNs — Secure Remote Access

### WireGuard — The Modern Standard

**Released:** 2015, Linux kernel 5.6 (March 2020)

**Technical Specs:**
- **Protocol:** UDP only (port 51820 default)
- **Cryptography:**
  - Curve25519 (key exchange)
  - ChaCha20 (symmetric encryption)
  - Poly1305 (authentication)
  - BLAKE2s (hashing)
- **Codebase:** ~4,000 lines vs OpenVPN's 100,000+
- **Performance:** ~3-4x faster than OpenVPN

**Advantages:**
- Minimal attack surface (auditable)
- Kernel-level on Linux (high performance)
- Simple configuration (SSH-like keys)
- Seamless roaming between IPs
- Perfect forward secrecy

**Limitations:**
- UDP-only (blocked by restrictive networks)
- No native obfuscation (traffic identifiable)
- No TCP fallback

**Quantum-Safe Note:** Supports optional pre-shared symmetric keys to mitigate future quantum decryption of captured traffic.

### OpenVPN — The Proven Workhorse

**Since 2001, v2.7.0 released Feb 2026**

**Technical Specs:**
- **Protocols:** UDP (port 1194) or TCP
- **Encryption:** OpenSSL library, TLS key exchange
- **Interface:** TUN (Layer 3) or TAP (Layer 2)
- **Features:** Compression, HMAC authentication

**Advantages:**
- 24+ years battle-tested
- TCP support (bypasses restrictive firewalls)
- Extensive platform support
- Highly configurable

**Limitations:**
- Larger codebase (harder to audit)
- Higher overhead, slower performance
- Complex configuration

### WireGuard vs OpenVPN (2026 Recommendation)

| Factor | WireGuard | OpenVPN |
|--------|-----------|---------|
| Performance | ~3-4x faster | Slower |
| Code Size | ~4,000 lines | ~100,000+ lines |
| Auditability | Easy | Difficult |
| Firewall Traversal | UDP only | TCP/UDP flexible |
| Maturity | Proven (newer) | Very mature |
| **Recommendation** | **New deployments** | Legacy compatibility |

**2026 Best Practice:** Deploy WireGuard for new infrastructure. Use OpenVPN only where TCP fallback or maximum compatibility is required.

---

## Encryption — The Foundation of Trust

### TLS 1.3 — Universal Standard

**Defined:** August 2018, now widely adopted

**Key Improvements:**
- **1-RTT handshakes** vs 2-RTT (faster)
- **Removed weak algorithms:** MD5, SHA-1, RSA key exchange, CBC, RC4
- **Mandatory forward secrecy** — Ephemeral keys only
- **Encrypted server certificates** — Less metadata leakage
- **0-RTT mode** — Resumption for returning clients (replay risk trade-off)

**Cipher Suites (TLS 1.3 only):**
- AES-128-GCM
- AES-256-GCM
- ChaCha20-Poly1305

**2026 Status:** Nearly universal. Required for HTTP/3 (QUIC).

### Post-Quantum Cryptography — The Coming Storm

**The Threat:** Quantum computers running Shor's algorithm can break RSA, ECC, and Diffie-Hellman.

**"Y2Q" / "Q-Day":** When quantum computers become cryptographically relevant.

**"Harvest now, decrypt later":** Adversaries storing encrypted traffic today to decrypt when quantum computers available.

**NIST Standards (Released August 2024):**

| Algorithm | Purpose | Type |
|-----------|---------|------|
| **ML-KEM (Kyber)** | Key encapsulation | Lattice-based |
| **ML-DSA (Dilithium)** | Digital signatures | Lattice-based |
| **SLH-DSA (SPHINCS+)** | Stateless signatures | Hash-based |

**Mosca's Theorem:**
```
If X + Y > Z → Migrate urgently
Where:
- X = Time to migrate systems
- Y = Time data must remain secure
- Z = Time until quantum computers available
```

**2026 Status:**
- NIST standards finalized
- Hybrid TLS deployments being tested
- Crypto-agility emphasized (swap algorithms easily)
- Government mandates beginning

**Action:** Start planning PQC migration now for long-term confidentiality needs.

---

## IDS/IPS — Detect and Prevent Intrusions

### Intrusion Detection System (IDS)

**Function:** Monitors network/systems for malicious activity, alerts administrators.

**Types:**

| Type | Scope | Examples |
|------|-------|----------|
| **NIDS** (Network) | Entire network traffic | Snort, Suricata, Zeek |
| **HIDS** (Host-based) | Single host | OSSEC, Wazuh, Tripwire |

**Detection Methods:**

1. **Signature-based:** Match known attack patterns
   - Pros: Low false positives for known threats
   - Cons: Can't detect zero-days

2. **Anomaly-based:** Detect deviations from "normal"
   - Pros: Can detect unknown attacks
   - Cons: Higher false positives, requires training

3. **Reputation-based:** Check threat intelligence feeds
   - Pros: Fast identification of known-bad
   - Cons: Relies on data quality

**AI/ML in IDS (2026):**
- Artificial Neural Networks for pattern recognition
- Behavioral analytics for user/entity behavior
- Automated threat hunting
- **99.9%+ detection rates** reported

### Intrusion Prevention System (IPS)

**Function:** Detects AND blocks intrusions in real-time.

**Key Difference:** Inline deployment—traffic flows through the IPS. Can terminate connections automatically.

**Deployment Modes:**
- **Inline:** Real-time blocking (highest protection, disruption risk)
- **Tap/SPAN:** Passive monitoring (IDS mode)

**2026 Capabilities:**
- NGFW integration
- Cloud-based threat intelligence
- Automated response playbooks
- SIEM integration

---

## Network Segmentation — Contain the Blast Radius

**Definition:** Dividing network into subnetworks to improve security and performance.

### Why Segmentation Matters

| Benefit | Description |
|---------|-------------|
| **Reduced Attack Surface** | Compromised host can't easily pivot |
| **Containment** | Breach limited to one segment |
| **Least Privilege** | Only access required resources |
| **Compliance** | PCI-DSS, HIPAA require segmentation |
| **Performance** | Reduced broadcast domains |

### Segmentation Methods

1. **VLANs (Virtual LANs)** — Layer 2 separation, cost-effective
2. **Firewalls** — Layer 3/4 separation with policy enforcement
3. **SDN (Software-Defined Networking)** — Micro-segmentation, programmable
4. **ZTNA (Zero Trust Network Access)** — Application-level, identity-based

### Recommended Security Zones

- **Internet-facing** — Web servers, DMZ
- **Internal** — User workstations
- **Critical** — Databases, core systems
- **Management** — Admin systems, jump hosts
- **Third-party** — Vendor access
- **IoT/OT** — Industrial devices, sensors

**2026 Trend:** Micro-segmentation—per-workload isolation using software-defined policies.

---

## Zero Trust Architecture — "Never Trust, Always Verify"

**Core Principle:** No implicit trust based on network location. Verify every access request, regardless of origin.

### NIST SP 800-207 — Five Tenets

1. **All resources accessed securely** — regardless of location
2. **Least privilege access** — only explicitly authorized
3. **Assume breach** — inspect and verify all traffic
4. **Dynamic authentication** — continuous verification
5. **Comprehensive monitoring** — visibility into all activity

### Implementation Approaches

| Approach | Description |
|----------|-------------|
| **Identity-based** | Enhanced IAM, Attribute-Based Access Control |
| **Micro-segmentation** | Network-level isolation per workload |
| **Software-Defined Perimeter** | Overlay networks hiding resources |

### ZT-Kipling Methodology (2026)

Five iterative steps using Kipling Criteria (what, why, when, where, who, how):

1. **Define the protected surface** — What are you protecting?
2. **Map transaction flows** — How does data move?
3. **Build Zero Trust Architecture** — Implement controls
4. **Create Zero Trust policy** — Explicit authorization rules
5. **Monitor and maintain** — Continuous cycle

### Zero Trust Components

| Component | Function |
|-----------|----------|
| **Identity Provider (IdP)** | Authentication source (Okta, Azure AD) |
| **Device Trust** | Posture assessment, compliance |
| **Policy Decision Point** | Authorization engine |
| **Policy Enforcement Point** | Access control enforcement |
| **SIEM/SOAR** | Monitoring and response |

**2026 Adoption:**
- Federal mandate (US Executive Orders)
- Enterprise standard for remote work
- Integration with SASE (Secure Access Service Edge)
- Google's BeyondCorp model widely referenced

---

## Current Threats and Defenses (2026)

### Major Threat Categories

| Threat | Description | Defense |
|--------|-------------|---------|
| **Ransomware** | Encrypts data, demands payment | Segmentation, backups, EDR |
| **Supply Chain Attacks** | Compromise via trusted vendor | Zero trust, vendor segmentation |
| **API Abuse** | Exploit API vulnerabilities | API gateways, rate limiting |
| **Credential Stuffing** | Automated credential reuse | MFA, breach detection |
| **Living off the Land** | Use legitimate tools maliciously | Behavioral analytics |
| **AI-Generated Attacks** | Deepfakes, automated phishing | AI-based detection |
| **IoT Botnets** | Compromised devices for DDoS | Network segmentation |

### Emerging Defenses

1. **AI/ML in Security**
   - Predictive threat intelligence
   - Automated incident response
   - Behavioral biometrics

2. **Extended Detection and Response (XDR)**
   - Unified visibility across endpoints, network, cloud
   - Correlated threat detection

3. **Security Service Edge (SSE)**
   - Cloud-delivered security (CASB, SWG, ZTNA)
   - Part of broader SASE architecture

---

## Key Takeaways

1. **NGFWs are baseline.** Deep inspection, application awareness, identity integration—not optional.

2. **WireGuard for new VPNs.** ~3-4x faster, auditable codebase. OpenVPN for legacy only.

3. **PQC migration is coming.** Start planning for quantum-resistant algorithms now.

4. **IDS/IPS with AI** achieves 99.9%+ detection. Layer this with human analysis.

5. **Zero Trust is the new perimeter.** "Never trust, always verify"—implement identity-aware, micro-segmented architectures.

6. **Network segmentation contains breaches.** Don't let a compromised workstation reach your crown jewels.

---

*"Course 3 complete. You now understand networks from the wire up—how they work, the protocols they speak, and how to defend them. The internet in 2026 is encrypted by default, distributed across clouds, and under constant attack. Your job is to make your network a hard target."*

---

## Course 3 Summary

| Module | Key Topics |
|--------|------------|
| **Network Fundamentals** | OSI model, TCP/IP, IPv4/IPv6, CIDR, subnetting |
| **Network Protocols** | HTTP/3, DNS security, DHCP, ARP, BGP, OSPF |
| **Network Security** | Firewalls, VPNs, encryption, IDS/IPS, Zero Trust |

**Status:** ✅ **Complete**

**Next:** Course 4 — Tools of the Trade (Linux, SQL, Command Line)
