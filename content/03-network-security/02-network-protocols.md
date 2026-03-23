# Module 2: Network Protocols

*"Alright, now we're getting into the actual protocols—the languages devices use to talk to each other. HTTP, DNS, routing protocols—these are the battlegrounds where attacks happen daily. In 2026, the protocol landscape has shifted: HTTP/3 is mainstream, encrypted DNS is the default, and BGP hijacking remains a persistent threat. Let's dig into what you actually need to know."*

---

## Why Protocols Matter for Security

**Every protocol is a potential attack vector.** HTTP for web attacks, DNS for tunneling and phishing, routing protocols for traffic interception. Understanding protocols isn't academic—it's how you detect anomalies, configure defenses, and respond to incidents.

**The 2026 reality:** Most protocols were designed for a trusted internet. They assume good actors. That assumption is wrong.

---

## HTTP/HTTPS — The Web's Foundation

### Evolution: HTTP/1.1 → HTTP/2 → HTTP/3

| Version | Status | Key Features | Security Notes |
|---------|--------|------------|----------------|
| **HTTP/1.1** | Legacy | Text-based, sequential requests | Plain text; vulnerable to injection |
| **HTTP/2** | Mature | Binary framing, multiplexing, HPACK compression | Server push abused for cache poisoning |
| **HTTP/3** | **Growing rapidly** | QUIC over UDP, eliminates head-of-line blocking | New attack surface (UDP-based) |

### HTTP/3 and QUIC (RFC 9114)

**Released:** June 2022 — now hitting mainstream adoption

**Why It Matters:**
- **UDP-based:** Replaces TCP, eliminates head-of-line blocking
- **Native multiplexing:** Lost packets only affect affected streams
- **Faster handshakes:** Combines crypto + transport in one round-trip
- **~4x faster** than HTTP/1.1 in real-world conditions

**Adoption (2026):**
- **>95% browser support** (Chrome, Firefox, Safari, Edge)
- **~34% of top 10 million websites** (growing)
- **Default in modern CDNs** (Cloudflare, Fastly)

**Security Implications:**
- **New attack surface:** QUIC runs over UDP, which firewalls often handle differently than TCP
- **Encryption by default:** QUIC includes TLS 1.3—no unencrypted version
- **Connection migration:** Clients can change IPs mid-connection (challenges IP-based blocking)
- **UDP amplification:** QUIC must be implemented carefully to avoid DDoS abuse

### HTTPS — Non-Negotiable in 2026

**Current Standard:** TLS 1.3 (defined 2018, now universal)

**Key Improvements:**
- **1-RTT handshakes** vs 2-RTT in TLS 1.2
- **Removed weak algorithms:** MD5, SHA-1, RSA key exchange, CBC ciphers
- **Mandatory forward secrecy** — ephemeral keys only
- **Encrypted server certificates** — reduces metadata leakage

**Reality Check:** If your site isn't HTTPS-only in 2026, you're negligent. Certificate Authorities are free (Let's Encrypt), browsers warn on HTTP, and attackers easily intercept plain text.

---

## DNS — The Internet's Directory, Under Attack

### DNS Security Extensions (DNSSEC)

**Purpose:** Cryptographically authenticate DNS data—prove responses came from the legitimate domain owner.

**Status (2026): Spotty Adoption**

| Metric | Status |
|--------|--------|
| ccTLDs signed | ~83/195 (45%) |
| .com/.net signed | ~4-5% |
| Major domains | Google, Amazon, Microsoft remain unsigned |

**Why Low Adoption?**
- Complex deployment and key management
- No confidentiality—responses authenticated but visible
- Breaks on misconfiguration (users can't reach your site)
- Adds latency (larger responses)

**Security Verdict:** DNSSEC prevents cache poisoning and spoofing, but deployment friction keeps it niche. Monitor your critical domains—consider signing them.

### Encrypted DNS — Now Default

| Protocol | Mechanism | Status |
|----------|-----------|--------|
| **DoH (DNS over HTTPS)** | Port 443, wrapped in HTTPS | Default in Firefox (US), Chrome, Safari |
| **DoT (DNS over TLS)** | Port 853, dedicated TLS | Alternative to DoH |
| **ODoH (Oblivious DoH)** | Hides client IP from resolver | Experimental (RFC 9230, 2022) |

**Why This Matters:**
- **Prevents man-in-the-middle** attacks on DNS
- **Prevents eavesdropping** on DNS queries (ISPs can't sell your browsing history)
- **Bypasses DNS blocking** (censorship circumvention)
- **Apple iOS 14+ and macOS 11+** support natively

**Enterprise Consideration:** DoH bypasses traditional DNS monitoring and filtering. You need visibility—either block DoH at the firewall or run your own DoH resolver.

### DNS Tunneling — Data Exfiltration Via DNS

**Attack Method:** Embed data in DNS queries/responses to bypass firewalls.

- Firewalls often allow DNS (port 53) to any server
- Queries can carry data in subdomain labels
- Slow but effective for exfiltrating data

**Detection:**
- Monitor for unusual query volumes
- Look for long subdomain names
- Track queries to suspicious domains

---

## DHCP — Automatic Address Assignment

**Function:** Automatically assigns IP addresses to devices joining a network.

**Vulnerabilities:**

| Attack | Method | Defense |
|--------|--------|---------|
| **Rogue DHCP Server** | Attacker sets up server, assigns malicious gateway | DHCP Snooping on switches |
| **DHCP Starvation** | Exhaust address pool with spoofed requests | Rate limiting, port security |
| **DHCP Spoofing** | Respond to requests before legitimate server | Authorized server lists |

**DHCP Snooping — Essential Layer 2 Security:**
- Switch feature that filters untrusted DHCP messages
- Creates binding table (IP → MAC → port)
- Blocks rogue servers on untrusted ports
- **Enable this on all access switches.**

---

## ARP — The Trust Problem at Layer 2

**Function:** Maps IP addresses to MAC addresses on local networks.

**Critical Flaw:** **No authentication.** ARP responses are trusted blindly.

### ARP Spoofing/Poisoning Attack

1. Attacker sends falsified ARP messages
2. Associates attacker's MAC with legitimate IP
3. Victims send traffic to attacker instead of real destination
4. Attacker forwards traffic (man-in-the-middle)

**Impact:**
- Traffic interception
- Session hijacking
- Data modification
- Denial of service

### Defenses

| Defense | Mechanism | Limitations |
|---------|-----------|-------------|
| **Static ARP entries** | Manually configure IP→MAC mappings | Impractical for large networks |
| **Dynamic ARP Inspection (DAI)** | Switch validates ARP packets against DHCP snooping table | Requires DHCP snooping enabled |
| **Private VLANs** | Isolate ports at Layer 2 | Limits network design flexibility |
| **ARP spoofing detection** | Tools like arpwatch, XArp | Reactive, not preventive |

**Bottom Line:** ARP is inherently insecure. In a hostile network, assume ARP is poisoned. Use encryption (HTTPS, VPNs) to protect against interception.

---

## Routing Protocols — How Traffic Gets Routed

### BGP (Border Gateway Protocol) — The Internet's Routing Protocol

**Function:** Routes traffic between autonomous systems (AS) — the organizations that make up the internet.

**Critical Vulnerability:** **No built-in authentication.** BGP trusts routing announcements implicitly.

**BGP Hijacking:**
- Attacker announces IP prefixes they don't own
- Traffic routes through attacker's network
- Interception, monitoring, or blackholing

**Notable Incidents:**
| Year | Incident | Impact |
|------|----------|--------|
| 2008 | Pakistan Telecom YouTube hijack | Global YouTube outage |
| 2018 | Russian BGP hijack | Financial services traffic intercepted |
| Ongoing | Route leaks and hijacks | Regular outages and interception |

**BGP Security Extensions:**

| Technology | Purpose | Adoption |
|------------|---------|----------|
| **RPKI (Resource Public Key Infrastructure)** | Cryptographically verifies route origins | Growing but incomplete |
| **BGPsec** | Cryptographic path validation | Limited deployment (complexity) |
| **Route filters** | Prefix lists, AS-path filters | Best practice but not universal |

**Security Action:** If you manage an AS, deploy RPKI. It's the best defense against accidental and malicious hijacks.

### OSPF (Open Shortest Path First) — Internal Routing

**Function:** Routes within a single organization (interior gateway protocol).

**Versions:**
- OSPFv2 — IPv4 (RFC 2328)
- OSPFv3 — IPv6 (RFC 5340)

**Security Features:**
- Authentication: None, simple password, MD5 (RFC 2328), SHA (RFC 5709)
- OSPFv3 uses IPsec for security

**Vulnerabilities:**
- Falsified Link State Advertisements (LSAs)
- Area border router attacks
- Default authentication is **none**

**Action:** Enable MD5 or SHA authentication on all OSPF routers. Don't run routing protocols unsecured.

---

## Switches vs Routers — Know the Difference

| Feature | **SWITCH** | **ROUTER** |
|---------|------------|------------|
| **OSI Layer** | Layer 2 (Data Link) — MAC addresses | Layer 3 (Network) — IP addresses |
| **Scope** | LAN only | LAN to WAN/Internet |
| **Decision Speed** | Very fast (hardware ASICs) | Slower (complex routing decisions) |
| **Broadcast Domain** | Same (per VLAN) | Separates broadcast domains |
| **Intelligence** | MAC learning table | Routing table (OSPF, BGP) |

**Layer 3 Switches:** Hybrid devices combining switch speed with routing intelligence. Common in enterprise networks for inter-VLAN routing at wire speed.

---

## 2026 Security Best Practices

### Network Infrastructure

1. **Enable DHCP Snooping** — Block rogue DHCP servers
2. **Enable Dynamic ARP Inspection** — Prevent ARP poisoning
3. **Use port security** — Limit MAC addresses per port
4. **Deploy RPKI** — For BGP route validation
5. **Segment networks** — VLANs reduce broadcast domains

### DNS Security

1. **Deploy DoH/DoT** — Encrypt DNS queries
2. **Monitor for DNS tunneling** — Unusual query patterns
3. **Keep resolvers updated** — Patch vulnerabilities
4. **Consider DNSSEC** — For critical domains

### Routing Security

1. **BGP filters** — Prefix lists, AS-path filters
2. **RPKI validation** — Verify route origins
3. **OSPF authentication** — MD5 or SHA
4. **Monitor routing tables** — Alert on changes

### Transport Layer

1. **Migrate to HTTP/3** — Performance + security
2. **Enforce TLS 1.3** — Minimum standard
3. **Monitor QUIC traffic** — New protocol, new risks

---

## Key Takeaways

1. **HTTP/3 is here.** ~34% of websites, >95% browser support. Learn QUIC's security implications.

2. **Encrypted DNS is default.** DoH/DoT prevent eavesdropping but bypass traditional monitoring.

3. **BGP is still trust-based.** RPKI adoption is critical but incomplete. Route hijacking remains a threat.

4. **ARP is fundamentally insecure.** Assume Layer 2 is hostile. Encrypt traffic.

5. **Layer 2 security features matter.** DHCP snooping and DAI aren't optional—they're baseline.

---

*"Now let's put it all together. Firewalls, VPNs, IDS/IPS, network segmentation—how to actually defend networks in 2026."*
