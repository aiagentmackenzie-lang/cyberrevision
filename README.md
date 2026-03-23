# CyberRevision

A no-nonsense revision tool for cybersecurity. Whether you're studying for a cert, switching careers, or just want to solidify your fundamentals, this gets the job done without getting in your way.

## Why this exists

I needed a fast, distraction-free way to revise cybersecurity material. Everything out there was either bloated with sign-up walls and tracking, or buried inside some LMS I didn't want to deal with. So I built this instead.

It's a static site. No accounts. No analytics. No build step. Open it in a browser and start studying.

## Who it's for

Anyone learning cybersecurity: cert students, working professionals brushing up on basics, career switchers getting their feet wet, or self-taught folks who just want a clean way to work through the material systematically.

## What it covers

8 courses, 25 modules, covering the full security lifecycle:

**Foundations of Cybersecurity.** Intro concepts, the security lifecycle, frameworks and controls.

**Play It Safe: Manage Security Risks.** Deeper dive into frameworks, risk management, and security controls.

**Connect and Protect: Networks & Network Security.** Network fundamentals, protocols, and how to secure them.

**Tools of the Trade: Linux & SQL.** Linux basics and security, plus SQL for security work.

**Assets, Threats, and Vulnerabilities.** Asset management, the threat landscape, vulnerability management.

**Sound the Alarm: Detection & Response.** Detection systems, incident response, forensics and investigation.

**Automate Cybersecurity Tasks with Python.** Python fundamentals, writing security scripts, automation and orchestration.

**Put It to Work: Prepare for Cybersecurity Jobs.** Job search strategy, resume and portfolio building, interview prep, and how to keep learning after you land the role.

## Tech stack

Plain HTML5, vanilla CSS (split into modular files for nav, content, and main styles), and vanilla JavaScript using ES modules for routing, navigation, and markdown rendering. Marked.js handles the Markdown parsing, DOMPurify sanitizes it, and the fonts are Inter + JetBrains Mono pulled from Google Fonts.

No frameworks. No bundlers. Nothing to install.

## Design decisions

Dark theme, because if you're going to stare at study material for hours, your eyes shouldn't pay the price. The layout is a split-pane setup with persistent navigation on the left and content on the right. Routing is hash-based so you can link directly to any module. The grid is responsive, and there's a simple visited-modules counter so you can see where you've been.

## Getting started

Clone the repo (or just download it), open `index.html` in any modern browser, and start navigating through the sidebar. That's it. Works offline once loaded.

## The thinking behind it

Study tools should disappear. You should be thinking about security concepts, not fighting the interface. So: no bloat, clean typography, keyboard navigation, screen-reader support, and it runs anywhere you have a browser.

## Contributing

Spotted a mistake? Want to improve something? PRs are welcome.

## License

Proprietary. All rights reserved.

---

*Built during the Google Cybersecurity Certificate grind.*
