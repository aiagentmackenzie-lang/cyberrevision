# Module 3: Digital Forensics and Investigation

*"Alright, final module of this course. After detection and response comes understanding—what actually happened, how they got in, what they took. Digital forensics is the science of recovering evidence from digital systems. In 2026, with cloud workloads, encrypted endpoints, and anti-forensics techniques, this is more complex than ever. But the fundamentals remain: preserve evidence, analyze methodically, document everything."

---

## Why Digital Forensics Matters

**You can't fix what you don't understand.** Forensics answers the critical questions:
- How did they get in?
- What did they access?
- Are they still here?
- What should we tell stakeholders?

**Legal Relevance:** Forensic evidence supports criminal prosecution, civil litigation, insurance claims, and regulatory compliance.

---

## Forensics Principles

### The Four Principles

1. **Never work on original evidence** — Always work on copies
2. **Document everything** — Chain of custody, every action
3. **Maintain integrity** — Cryptographic hashing to prove evidence hasn't changed
4. **Be prepared to testify** — Your analysis may be challenged in court

### Chain of Custody

**Definition:** Documentation showing who had evidence, when, and what they did with it.

**Critical Elements:**
- Date/time of collection
- Collector identification
- Storage location
- Access log
- Hash values (MD5, SHA-256)

**Break the chain = Evidence inadmissible**

---

## Memory Forensics — Volatile Data

### Why Memory Matters

**Volatile data disappears when power is lost:**
- Running processes
- Network connections
- Decryption keys
- Malware in memory (fileless attacks)
- Command history

### Volatility Framework

**The standard for memory forensics:**

```bash
# Image identification
vol.py -f memory.dmp imageinfo

# List processes
vol.py -f memory.dmp --profile=Win10x64 pslist

# Network connections
vol.py -f memory.dmp --profile=Win10x64 netscan

# Command history
vol.py -f memory.dmp --profile=Win10x64 cmdscan

# Malware detection (malfind)
vol.py -f memory.dmp --profile=Win10x64 malfind

# Registry hives
vol.py -f memory.dmp --profile=Win10x64 hivelist
```

**Key Plugins:**
- `pslist` / `psscan` — Process listing
- `netscan` — Network connections
- `malfind` — Injected code detection
- `cmdscan` / `consoles` — Command history
- `timeliner` — Timeline creation

### Memory Acquisition

**Tools:**
- **DumpIt** — Simple Windows memory dump
- **WinPmem** — Open source Windows acquisition
- **Linux:** `/dev/mem`, `/dev/kmem`, LiME (Linux Memory Extractor)
- **macOS:** osxpmem

**Best Practice:** Capture memory before powering off the system.

---

## Disk Forensics — Persistent Data

### The Sleuth Kit (TSK)

**Command-line forensic toolkit:**

```bash
# File system information
fsstat disk.img

# List files
fls -r disk.img

# File recovery
icat disk.img 12345 > recovered_file

# Timeline analysis
mactime -b bodyfile.txt
```

### Autopsy

**GUI frontend for The Sleuth Kit:**

**Features:**
- Disk imaging and analysis
- File recovery (deleted files)
- Keyword search
- Timeline analysis
- Email analysis
- EXIF data extraction
- Hash filtering (NSRL, custom)

**Workflow:**
1. Create case
2. Add data source (disk image)
3. Ingest modules (hash lookup, file type, EXIF)
4. Analyze results
5. Generate report

### Disk Imaging

**Tools:**
- **dd** — Basic imaging (Linux)
- **ddrescue** — Fault-tolerant imaging
- **FTK Imager** — Windows GUI (AccessData)
- **Guymager** — Linux GUI

**Best Practice:**
- Write-block the source drive
- Image to clean target media
- Verify hashes after imaging
- Create working copies from the image

---

## Network Forensics — Traffic Analysis

### Wireshark

**The standard for packet capture and analysis:**

**Capture:**
```bash
# Capture on interface
tshark -i eth0 -w capture.pcap

# Filter during capture
tshark -i eth0 -f "port 80" -w http.pcap
```

**Analysis:**
```
# Display filters (Wireshark GUI)
ip.addr == 192.168.1.1        # Specific IP
tcp.port == 443              # Specific port
http.request.method == "POST" # HTTP POST requests
dns.qry.name contains "evil" # Suspicious DNS queries
```

### NetworkMiner

**Passive network forensic analysis tool:**

**Features:**
- Extracts files from pcap
- Reconstructs sessions
- Credential extraction
- OS fingerprinting
- GeoIP lookups

**Use Case:** "What files were transferred?" "What credentials were sent in clear text?"

### Zeek for Forensics

**Network security monitoring logs:**

**Log Types:**
- `conn.log` — Connection records
- `http.log` — HTTP requests/responses
- `dns.log` — DNS queries
- `ssl.log` — SSL/TLS handshake info
- `files.log` — File transfer metadata

**Advantage:** High-fidelity transaction logs vs. raw packet capture.

---

## Log Analysis — The Investigation Trail

### SIEM for Forensics

**Key Searches:**

```splunk
# Failed logins followed by success
index=auth (EventCode=4625 OR EventCode=4624)
| stats count by Account_Name, EventCode
| sort -count

# Privilege escalation
index=windows EventCode=4672
| stats count by Account_Name, Process_Name

# Lateral movement
index=auth EventCode=4624 Logon_Type=3
| stats count by Source_IP, Account_Name
```

### Timeline Analysis

**Reconstructing events chronologically:**

| Timestamp | Source | Event | Significance |
|-----------|--------|-------|--------------|
| 2026-03-23 02:15 | Firewall | Port scan detected | Reconnaissance |
| 2026-03-23 02:47 | Web server | SQL injection attempt | Initial access |
| 2026-03-23 03:12 | Domain controller | New admin account created | Persistence |
| 2026-03-23 04:30 | File server | Bulk file access | Exfiltration |

**Tools:**
- **Plaso / log2timeline** — Automated timeline creation
- **Autopsy** — Integrated timeline
- **Excel/Grafana** — Manual timeline visualization

---

## Cloud Forensics — New Challenges

### Cloud-Specific Considerations

| Challenge | Solution |
|-----------|----------|
| **No physical access** | API-based acquisition |
| **Ephemeral resources** | Snapshots, logging, backup policies |
| **Multi-tenant environments** | CSP cooperation, legal requests |
| **Jurisdiction issues** | Data location, legal agreements |

### AWS Forensics

**Key Data Sources:**
- **CloudTrail** — API activity logs
- **VPC Flow Logs** — Network traffic metadata
- **S3 Access Logs** — Object access records
- **EC2 Snapshots** — Disk acquisition
- **CloudWatch Logs** — Application and system logs

**Acquisition:**
```bash
# Snapshot compromised instance
aws ec2 create-snapshot --volume-id vol-12345

# Copy snapshot for analysis
aws ec2 copy-snapshot --source-snapshot-id snap-12345
```

### Azure Forensics

**Key Data Sources:**
- **Activity Logs** — Control plane operations
- **Diagnostic Logs** — Resource-specific logs
- **Network Watcher** — NSG flow logs, packet capture
- **Snapshots** — Disk acquisition

### GCP Forensics

**Key Data Sources:**
- **Cloud Audit Logs** — Admin, data access, policy
- **VPC Flow Logs** — Network metadata
- **Cloud Monitoring** — Metrics and logs
- **Disk Snapshots** — Persistent disk imaging

---

## Mobile Forensics

### Device Types

| Type | Challenges | Tools |
|------|------------|-------|
| **iOS** | Encryption, locked bootloader | Cellebrite, GrayKey, checkra1n |
| **Android** | Fragmentation, encryption variations | Cellebrite, Oxygen, ADB |
| **Tablets** | Same as phones | Same tools |

### Data Sources

- **File system** — Apps, media, documents
- **Databases** — SQLite (most app data)
- **Keychain/Keystore** — Saved passwords
- **Cloud backups** — iCloud, Google Drive
- **App data** — WhatsApp, Signal, Telegram

**Legal Note:** Mobile forensics often requires physical device access and may need warrants.

---

## Anti-Forensics — What Attackers Do

### Common Techniques

| Technique | Countermeasure |
|-----------|----------------|
| **Log deletion** | Centralized logging, WORM storage |
| **Timestamp manipulation** | Corroborate with multiple sources |
| **File encryption** | Memory analysis for keys, legal decryption orders |
| **Steganography** — Hiding data in images/audio | Statistical analysis, specialized tools |
| **Data destruction** — Secure deletion | File carving, backup recovery |
| **Rootkits** — OS-level hiding | Offline analysis, live forensics |

### Identifying Anti-Forensics

**Indicators:**
- Log gaps (missing time periods)
- Suspicious file timestamps (all identical)
- Presence of secure deletion tools
- Modified system binaries
- Disabled logging services

---

## Evidence Preservation

### Hashing

**Purpose:** Prove evidence integrity

```bash
# SHA-256 hash
sha256sum disk.img > disk.img.sha256

# Verify
sha256sum -c disk.img.sha256
```

**Types:**
- **MD5** — Fast, legacy (collisions possible)
- **SHA-1** — Better (collisions possible)
- **SHA-256** — Recommended standard

### Write Blocking

**Purpose:** Prevent modification of original evidence

**Hardware:**
- Tableau write blockers
- WiebeTech write blockers

**Software:**
- Linux: `mount -o ro,loop` (read-only)
- Windows: Registry settings for USB devices

---

## Reporting and Testimony

### Forensic Report Structure

1. **Executive Summary** — For non-technical stakeholders
2. **Investigation Scope** — What was examined, timeframe
3. **Methodology** — Tools and techniques used
4. **Findings** — Technical details of what was found
5. **Timeline** — Chronological reconstruction
6. **Conclusions** — Interpretation of findings
7. **Recommendations** — Security improvements

### Expert Testimony

**If called to testify:**
- Explain methods clearly (jury may not be technical)
- Stick to facts, not speculation
- Acknowledge limitations
- Maintain objectivity
- Document everything

---

## Key Takeaways

1. **Preserve evidence first.** Memory before disk, hashes for integrity, chain of custody.

2. **Work on copies, never originals.** One mistake can destroy evidence.

3. **Document everything.** Your analysis may be challenged in court.

4. **Cloud forensics is different.** API-based, ephemeral, multi-jurisdictional.

5. **Anti-forensics is real.** Attackers hide evidence. Look for gaps and anomalies.

---

## Course 6 Summary

| Module | Key Topics |
|--------|------------|
| **Detection Systems** | SIEM, EDR/XDR, NIDS/HIDS, SOAR, agentic AI |
| **Incident Response** | NIST framework, playbooks, tabletop exercises, legal |
| **Digital Forensics** | Memory, disk, network, cloud, mobile, anti-forensics |

**Status:** ✅ **Complete**

---

*"Course 6 complete. You now know how to detect, respond to, and investigate security incidents. Next course: Automate with Python—scripting for security operations."
