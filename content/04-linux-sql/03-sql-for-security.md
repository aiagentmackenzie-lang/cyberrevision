# Module 3: SQL for Security

*"Alright, final module of this course. SQL—the language that powers databases, and unfortunately, one of the most exploited attack vectors in web application security. SQL injection has been around for 25+ years and it's still #1 on the OWASP Top 10. Why? Because developers keep making the same mistakes. Learn SQL properly, learn to defend it ruthlessly."*

---

## Why SQL Security Matters

**Databases hold the crown jewels.** User data, credentials, financial records, proprietary information. SQL injection lets attackers bypass authentication, exfiltrate data, modify records, and execute commands on the server.

**The Numbers:**
- SQL injection still accounts for **65% of web application attacks**
- Average cost of a data breach: **$4.88 million** (2024)
- Detection time: often **months** before discovery

**Reality:** Every SQL query that includes user input is a potential vulnerability.

---

## SQL Basics — The Language

### Core Operations

```sql
-- SELECT: Retrieve data
SELECT * FROM users;
SELECT username, email FROM users WHERE active = 1;

-- INSERT: Add records
INSERT INTO users (username, email, password_hash) 
VALUES ('raphael', 'raphael@example.com', '$2y$10$...');

-- UPDATE: Modify records
UPDATE users SET last_login = NOW() WHERE username = 'raphael';

-- DELETE: Remove records (DANGEROUS)
DELETE FROM users WHERE username = 'inactive_user';
-- Without WHERE clause = DELETE EVERYTHING
```

### Joins — Connecting Tables

```sql
-- INNER JOIN: Only matching rows
SELECT users.username, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: All users, even without orders
SELECT users.username, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Multiple joins
SELECT u.username, p.title, c.content
FROM users u
JOIN posts p ON u.id = p.author_id
JOIN comments c ON p.id = c.post_id;
```

### Filtering and Aggregation

```sql
-- WHERE clauses
SELECT * FROM users WHERE age > 18 AND country = 'Brazil';
SELECT * FROM logs WHERE timestamp BETWEEN '2024-01-01' AND '2024-12-31';

-- LIKE patterns (wildcards)
SELECT * FROM users WHERE email LIKE '%@company.com';

-- Aggregation
SELECT country, COUNT(*) as user_count
FROM users
GROUP BY country
HAVING COUNT(*) > 100
ORDER BY user_count DESC;
```

---

## Database Types — Know Your Target

| Database | Use Case | Security Notes |
|----------|----------|----------------|
| **PostgreSQL** | Enterprise, complex queries | Robust permission system, row-level security |
| **MySQL/MariaDB** | Web applications | Widely used, frequent target |
| **SQLite** | Embedded, mobile | File-based, no network access |
| **Microsoft SQL Server** | Enterprise Windows | Common in corporate environments |
| **Oracle** | Large enterprise | Complex, expensive, heavily targeted |

**2026 Context:** PostgreSQL gaining market share for security-critical applications. MySQL still dominates web hosting. SQLite ubiquitous in mobile apps.

---

## SQL Injection — The Attack

### What Is It?

**SQL injection** occurs when untrusted user input is concatenated directly into SQL queries, allowing attackers to modify query structure.

### Classic Example (Vulnerable Code)

**Python (DON'T DO THIS):**
```python
# VULNERABLE - Never concatenate user input
username = request.form['username']
password = request.form['password']

query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
cursor.execute(query)
```

**Attack:**
```
Username: admin' OR '1'='1
Password: anything
```

**Resulting Query:**
```sql
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
-- '1'='1' is always true, bypasses authentication
```

### Injection Types (2026)

| Type | Description | Example |
|------|-------------|---------|
| **In-Band** | Results visible in same channel | Error-based, Union-based |
| **Blind** | No visible output, infer from behavior | Boolean-based, Time-based |
| **Out-of-Band** | Data exfiltrated via different channel | DNS/HTTP exfiltration |
| **Second-Order** | Malicious input stored, executed later | Stored procedures, triggers |
| **JSON Injection** | Payloads in JSON API requests | Modern API attacks |

### Real-World Attack Patterns

**Union-Based (Data Extraction):**
```
Username: ' UNION SELECT username, password FROM users--
```

**Time-Based Blind (Confirmation):**
```
User ID: 1 AND (SELECT * FROM (SELECT(SLEEP(5)))a)
-- If response takes 5 seconds, injection confirmed
```

**Boolean-Based Blind (Data Extraction):**
```
User ID: 1 AND ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1)) > 64
-- Binary search to extract data character by character
```

**Second-Order (Stored Payload):**
```
-- Attacker registers with malicious "username"
Username: '; DROP TABLE logs; --
-- Application stores username safely (escaped)
-- Later, admin panel displays username without escaping → executes
```

---

## Defense — Parameterized Queries

### The Only Valid Defense

**Parameterized queries** (prepared statements) separate SQL code from data. User input is never parsed as SQL.

### Python (Psycopg2 - PostgreSQL)

```python
# SECURE - Parameterized query
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND password = %s",
    (username, password)
)
# Input is treated as data, never executed as SQL
```

### Python (SQLite3)

```python
import sqlite3

conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# SECURE - Using ? placeholders
cursor.execute(
    "SELECT * FROM users WHERE username = ? AND email = ?",
    (username, email)
)
```

### Node.js (pg - PostgreSQL)

```javascript
// SECURE - Parameterized query
const result = await pool.query(
    'SELECT * FROM users WHERE username = $1 AND password = $2',
    [username, password]
);
```

### PHP (PDO)

```php
// SECURE - Prepared statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch();
```

### Java (JDBC)

```java
// SECURE - PreparedStatement
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE username = ? AND password = ?"
);
stmt.setString(1, username);
stmt.setString(2, password);
ResultSet rs = stmt.executeQuery();
```

### What NOT to Do (2026 Edition)

| Method | Risk | Example |
|--------|------|---------|
| **String concatenation** | CRITICAL | `"SELECT * FROM users WHERE id = " + userId` |
| **String formatting** | CRITICAL | `"...WHERE id = {}".format(userId)` |
| **f-strings** | CRITICAL | `f"...WHERE id = {userId}"` |
| **Escaping** | DANGEROUS | `mysql_real_escape_string()` |
| **Blacklist filtering** | DANGEROUS | Removing "SELECT", "UNION" |

**Rule:** If you're concatenating user input into SQL, you're doing it wrong.

---

## ORM Security — Object-Relational Mappers

### What Are ORMs?

ORMs (SQLAlchemy, Django ORM, Hibernate) abstract SQL into Python/Java objects. Safer—but not foolproof.

### Safe ORM Usage (Django)

```python
# SECURE - ORM query
User.objects.filter(username=username, password=password)
# Automatically parameterized
```

### Vulnerable ORM Patterns

```python
# DANGEROUS - .raw() method
User.objects.raw(f"SELECT * FROM users WHERE id = {user_id}")

# DANGEROUS - .extra()
User.objects.extra(where=[f"username = '{username}'"])

# DANGEROUS - Mass assignment (2024 Laravel incident)
User.objects.create(**request.POST)  # All fields from POST
```

**2026 Alert:** The **2024 Laravel mass assignment vulnerability** exposed millions of records. ORMs can be bypassed if used incorrectly.

---

## Database Hardening

### Principle of Least Privilege

**Application Database User Should NOT:**
- Have `DROP`, `CREATE`, `ALTER` privileges
- Access system tables (`information_schema`, `pg_catalog`)
- Execute shell commands
- Write to filesystem

**Create Limited User:**
```sql
-- PostgreSQL
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
```

### Security Checklist

| Control | Implementation |
|---------|----------------|
| **Remove default accounts** | Delete test users, rename admin |
| **Strong passwords** | Enforce complexity, rotation |
| **Network restrictions** | Firewall, bind to localhost only |
| **Encryption at rest** | TDE, filesystem encryption |
| **Encryption in transit** | TLS 1.3 for connections |
| **Audit logging** | Enable query logging |
| **Query timeout** | Prevent long-running queries |
| **Connection limits** | Prevent DoS via connections |

### Enable Audit Logging

**PostgreSQL (`postgresql.conf`):**
```
log_connections = on
log_disconnections = on
log_statement = 'mod'        # Log DDL and DML
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

**MySQL (`my.cnf`):**
```
general_log = 1
log_output = FILE
general_log_file = /var/log/mysql/query.log
```

---

## Threat Hunting with SQL

### Detect Suspicious Activity

**Failed Login Attempts:**
```sql
-- PostgreSQL (from logs)
SELECT COUNT(*), username 
FROM auth_logs 
WHERE status = 'failed' 
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY username
HAVING COUNT(*) > 5;
```

**Off-Hours Access:**
```sql
-- Users accessing outside business hours
SELECT username, COUNT(*) as access_count
FROM access_logs
WHERE EXTRACT(HOUR FROM timestamp) NOT BETWEEN 8 AND 18
  AND timestamp > NOW() - INTERVAL '7 days'
GROUP BY username
ORDER BY access_count DESC;
```

**Unusual Query Patterns:**
```sql
-- Queries accessing many tables (reconnaissance)
SELECT username, query, tables_accessed
FROM query_logs
WHERE tables_accessed > 5
  AND timestamp > NOW() - INTERVAL '1 day';
```

**Large Result Sets (Data Exfiltration):**
```sql
-- Queries returning >10,000 rows
SELECT username, query, rows_returned
FROM query_logs
WHERE rows_returned > 10000
  AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY rows_returned DESC;
```

### SQL Injection Indicators

**Search Logs for:**
- `UNION SELECT` — Classic extraction
- `OR 1=1` — Authentication bypass
- `SLEEP()`, `BENCHMARK()` — Time-based blind
- `information_schema`, `pg_catalog` — Schema enumeration
- Hex-encoded strings — Obfuscation
- Multiple single quotes — Escaping attempts

---

## Key Takeaways

1. **Parameterized queries are mandatory.** No exceptions. No excuses. This is non-negotiable.

2. **ORMs aren't magic.** `.raw()`, `.extra()`, and mass assignment bypass protections.

3. **Least privilege is critical.** Application users should have minimal database permissions.

4. **Log everything.** Enable query logging. Monitor for suspicious patterns.

5. **SQL injection is still #1.** After 25 years, developers still make these mistakes. Don't be one of them.

---

## Course 4 Summary

| Module | Key Topics |
|--------|------------|
| **Linux Fundamentals** | Distributions, filesystem, permissions, commands |
| **Linux Security** | SELinux/AppArmor, auditd, SSH hardening, containers |
| **SQL for Security** | SQL basics, injection attacks, defense, hardening |

**Status:** ✅ **Complete**

---

*"Course 4 complete. You now have the tools of the trade: Linux for infrastructure, SQL for databases. Next course: Assets, Threats, and Vulnerabilities—understanding what you're protecting and what you're up against."*

---

**Key 2026 Update:** JSON injection in APIs and GraphQL SQL bridges are emerging attack vectors. Same principles apply—parameterize everything, validate input, never trust user data.