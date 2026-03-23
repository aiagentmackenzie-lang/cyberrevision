# Module 1: Network Fundamentals

*"Alright, listen up. Before you can secure a network, you need to understand how the damn thing actually works. Networks aren't magic—they're layers of protocols, each with specific jobs. Get this foundation right, or everything else will be built on sand. Let me break down the architecture that powers the internet in 2026."*

---

## Why Network Fundamentals Matter

Here's the truth: **You can't protect what you don't understand.** Most security breaches exploit basic network misconfigurations that wouldn't happen if people understood the fundamentals. subnetting errors, exposed IPv6 traffic bypassing IPv4 firewalls, DNS leaks—these aren't advanced attacks. They're network hygiene failures.

**The OSI model isn't academic theory.** It's the diagnostic framework that tells you exactly where in the stack an attack is happening. Learn this, and you'll troubleshoot like a pro.

---

## The OSI Model — Your Diagnostic Framework

**Still the pedagogical standard in 2026.** Seven layers, each with a specific job:

| Layer | Name | Function | Real-World Examples |
|-------|------|----------|-------------------|
| **7** | Application | User-facing services | HTTP/3, DNS, SSH, SMTP |
| **6** | Presentation | Data formatting, encryption | TLS 1.3, JPEG, MPEG |
| **5** | Session | Session management | NetBIOS, RPC |
| **4** | Transport | End-to-end delivery | TCP, UDP, **QUIC** |
| **3** | Network | Logical addressing, routing | IPv4, IPv6, ICMP |
| **2** | Data Link | Physical addressing, framing | Ethernet, Wi-Fi (802.11), ARP |
| **1** | Physical | Bit transmission | Fiber, copper, radio |

**Key Insight:** OSI predates TCP/IP, but TCP/IP won in deployment. Most teaching now uses a **hybrid 5-layer model** that merges OSI layers 5-7 into Application and splits Link into Data Link and Physical.

**Security Relevance:** When troubleshooting, identify the layer first. Is it a physical cable issue (Layer 1)? A MAC address conflict (Layer 2)? A routing problem (Layer 3)? An application bug (Layer 7)? Each layer has different diagnostic tools.

---

## TCP/IP — The Actual Internet Stack

**This is what really runs the internet.** Four layers, defined in RFC 1122/1123:

| Layer | Purpose | Key Protocols |
|-------|---------|---------------|
| **Application** | Process-to-process | HTTP/3, SSH, DNS, SMTP |
| **Transport** | Host-to-host | TCP, UDP, **QUIC** |
| **Internet** | Internetworking | IPv4, IPv6, ICMP |
| **Link** | Local transmission | Ethernet, Wi-Fi, ARP |

### Recent Evolution (2024-2026)

| Development | Impact |
|-------------|--------|
| **QUIC Protocol** | HTTP/3 now uses QUIC (UDP-based), replacing TCP for ~35-40% of web traffic |
| **HTTP/3** | Eliminates TCP head-of-line blocking, ~4x faster than HTTP/1.1 |
| **TLS 1.3** | Mandatory for modern secure communications |
| **IPv6 Adoption** | Hit 44% globally (India, France, Germany >70%) |

**Critical Security Point:** The **end-to-end principle** means intelligence is at the edges, not the core. That trust model has implications—routers don't inspect payloads, they just forward packets. Firewalls exist to break that model intentionally.

---

## Packet Structure — What Actually Travels the Wire

### IPv4 Header (20-60 bytes)

| Field | Size | Security Relevance |
|-------|------|-------------------|
| Version | 4 bits | IP version (4 for IPv4) |
| IHL | 4 bits | Header length |
| DSCP/ToS | 8 bits | QoS—can be spoofed |
| **Total Length** | 16 bits | Max 65,535 bytes (fragmentation attacks target this) |
| **TTL** | 8 bits | Hop limit—decrements per router; used in traceroute |
| **Protocol** | 8 bits | TCP=6, UDP=17, ICMP=1—firewalls filter on this |
| **Header Checksum** | 16 bits | Weak error detection (collision possible) |
| **Source IP** | 32 bits | **Easily spoofed**—never trust this alone |
| **Destination IP** | 32 bits | Routing target |

### IPv6 Header (Fixed 40 bytes — Simpler, Faster)

| Field | Size | Key Change |
|-------|------|------------|
| Version | 4 bits | IP version (6) |
| Traffic Class | 8 bits | DSCP + ECN combined |
| **Flow Label** | 20 bits | New—QoS flow identification |
| Payload Length | 16 bits | Data after header |
| Next Header | 8 bits | Extension headers or upper protocol |
| **Hop Limit** | 8 bits | TTL equivalent |
| **Source Address** | 128 bits | Massive address space |
| **Destination Address** | 128 bits | Massive address space |

**Key IPv6 Security Changes:**
- **No header checksum** — faster router processing, but no integrity check at network layer
- **No router fragmentation** — only endpoints fragment; prevents fragmentation attacks
- **Extension headers** — replaces options, but can be exploited for evasion

---

## IP Addressing — The Namespace of the Internet

### IPv4 Addressing (32-bit — Running Out Since 2011)

**Format:** `A.B.C.D` (four octets, 0-255 each)
**Total addresses:** ~4.3 billion (not enough for 8 billion humans + IoT devices)

**Private Address Blocks (RFC 1918):**

| Block | Range | Use |
|-------|-------|-----|
| 10.0.0.0/8 | 10.0.0.0 - 10.255.255.255 | Large enterprises (16.7M addresses) |
| 172.16.0.0/12 | 172.16.0.0 - 172.31.255.255 | Medium networks (1M addresses) |
| 192.168.0.0/16 | 192.168.0.0 - 192.168.255.255 | Home/small office (65K addresses) |

**Loopback:** 127.0.0.0/8 (usually 127.0.0.1)
**Link-local:** 169.254.0.0/16 (APIPA — when DHCP fails)

### IPv6 Addressing (128-bit — "340 Undecillion" Addresses)

**Format:** 8 groups of 4 hex digits
**Example:** `2001:0db8:85a3::8a2e:0370:7334`
**Notation:** `::` replaces consecutive zeros (once per address)

**Address Types:**

| Type | Prefix | Description |
|------|--------|-------------|
| **Global Unicast** | 2000::/3 | Routable internet addresses |
| **Link-Local** | fe80::/10 | Auto-configured, non-routable |
| **Unique Local** | fc00::/7 | Private network (like RFC 1918) |
| **Multicast** | ff00::/8 | One-to-many communication |
| **Loopback** | ::1 | Local host |

**IPv6 Adoption (2026):**
- **~44%** of Google users access via IPv6
- **Dual-stack** (IPv4 + IPv6) is current enterprise standard
- **NAT64** replaces deprecated 6to4/Teredo for IPv6-to-IPv4 translation

---

## CIDR and Subnetting — The Language of Network Division

**CIDR (Classless Inter-Domain Routing)** — the slash notation you see everywhere.

### IPv4 Subnet Reference

| CIDR | Subnet Mask | Usable IPs | Typical Use |
|------|-------------|------------|-------------|
| /32 | 255.255.255.255 | 1 | Single host |
| /30 | 255.255.255.252 | 2 | Router-to-router links |
| /24 | 255.255.255.0 | 254 | Standard LAN (Class C replacement) |
| /16 | 255.255.0.0 | 65,534 | Large organization (Class B) |
| /8 | 255.0.0.0 | 16.7M | ISP/very large (Class A) |

### IPv6 Subnetting

| Allocation | Size | Description |
|------------|------|-------------|
| /128 | 1 address | Single interface |
| /64 | 2^64 addresses | **Standard LAN subnet** — all LANs use this |
| /56 | 256 /64 subnets | Large site |
| /48 | 65,536 /64 subnets | Enterprise allocation |

**Critical Security Point:** **SLAAC** (Stateless Address Autoconfiguration) requires /64. If you subnet smaller, you break auto-configuration. This creates tension between security (wanting smaller subnets) and functionality.

---

## Security Implications — What Goes Wrong

### 1. IPv6 Shadow Networks

Many organizations monitor IPv4 but ignore IPv6. Result? **"Shadow" IPv6 traffic bypasses security controls.** Attackers know this. If your firewall is IPv4-only, you're blind to IPv6 attacks.

**Action:** Audit for IPv6 traffic. If you're not using IPv6, explicitly disable it or monitor it.

### 2. Subnet Misconfigurations

Overlapping subnets, wrong subnet masks, broadcast storms—these cause outages and create security gaps. A misconfigured router can expose internal networks to the internet.

**Action:** Document your IP addressing scheme. Use IPAM (IP Address Management) tools.

### 3. Protocol Transition Risks

Dual-stack means **two attack surfaces**. Tunneling protocols (6to4, Teredo, ISATAP) can evade perimeter controls. NAT64 is preferred now, but still adds complexity.

**Action:** Audit tunneling protocols. Disable unused transition mechanisms.

### 4. IPv6 Privacy Implications

IPv6 addresses can embed MAC addresses (modified EUI-64), creating tracking risks. Modern OSes use **temporary addresses** that rotate, but this complicates logging and incident response.

**Action:** Understand your organization's IPv6 addressing policy. Log correlation becomes harder with rotating addresses.

---

## 2026 Real-World Context

**Enterprise Networks:**
- Internal: IPv4 private ranges with NAT
- External: Dual-stack IPv4/IPv6
- Datacenters: Moving to IPv6-only with NAT64 for legacy

**Cloud Providers (AWS/Azure/GCP):**
- VPCs support IPv4 and IPv6
- IPv6-only subnets increasingly available
- Load balancers dual-stack by default

**Mobile Networks (4G/5G):**
- Mandatory IPv6 support per 3GPP specs
- Often IPv6-only with NAT64 for IPv4 content

---

## Key Takeaways

1. **OSI model is your diagnostic framework.** Know which layer a problem lives in.

2. **TCP/IP is what actually runs the internet.** HTTP/3 and QUIC are now mainstream (~35-40% of traffic).

3. **IPv4 vs IPv6 is a security issue.** Dual-stack means dual attack surface. Monitor both.

4. **CIDR notation is non-negotiable.** You must be fluent in subnet calculations.

5. **Transition mechanisms create risk.** Tunnels, dual-stack, NAT64—each adds complexity that attackers exploit.

---

*"Next up: the protocols that actually move data across these networks. HTTP/3, DNS security, routing protocols—how they work, where they break, and what attackers exploit."*
