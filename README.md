# AICTE ICMS - Integrated Institution Complaint Monitoring & Status Dashboard

> **Smart India Hackathon (SIH)** Solution for Problem Statement: **"Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells"**

---

## 🏛️ Executive Summary

The **All India Council for Technical Education (AICTE)** oversees thousands of technical education institutions across India. Grievances and regulatory inquiries are processed across independent bureaus:
- **Regulation Bureau (RB):** Approval Process Handbook (APH) compliance, unapproved courses, faculty cadre ratios, and intake audits.
- **Public Grievance Redressal Cell (PGRC):** Faculty salary non-payment, student capitation fees, retention of original certificates, and ragging complaints.
- **Regional Camp Offices (RO):** Field inspection reports, local ombudsman inquiries, and facility audits.

### The Problem
Previously, cases regarding the **same institution** were received and processed independently in different Bureaus/Cells. This lack of centralized real-time tracking resulted in:
1. **Conflicting Official Actions:** One bureau sending a notice while another conducts independent hearings.
2. **Duplication of Effort:** Multiple independent inspection committees dispatched to the same campus.
3. **Delayed Disposal & Lack of Visibility:** Inability for Apex Leadership to see a single source of truth for an institution's compliance record.

---

## 🚀 Key Innovations & SIH Differentiators

### 1. 🔄 The "Joint Resolution Room" (Core SIH Differentiator)
Rather than simply displaying an "Overlap Detected" badge, the portal launches an interactive **Joint Resolution Room**:
- **Side-by-Side Dual Case File:** Real-time visibility into both RB and PGRC ongoing proceedings.
- **Inter-Bureau Collaborative Minute Sheet:** Secure encrypted dialogue thread between the handling officers.
- **1-Click Joint EVC Recommendation:** Mandates a single combined **Expert Visiting Committee (EVC)**, saving AICTE thousands of inspection hours and preventing contradictory affidavits.
- **File Consolidation:** Merges related inquiries into a primary master case.

### 2. 🧠 Tri-Level Overlap & Deduplication Engine
1. **Level 1 (Exact Match):** Identical AICTE Permanent ID (PID) (e.g. `1-4091823711`).
2. **Level 2 (Fuzzy Entity Matching):** Levenshtein & Soundex string distance matching institution names and geographic districts when the student/complainant omits or misspells the PID.
3. **Level 3 (AI Semantic Match):** Correlates semantically related issues (e.g., *ghost faculty rolls in RB* correlated with *unpaid salaries for assistant professors in PGRC*).

### 3. 🛡️ Institutional Risk Index & EoA Approval Integration
Every institution has an automated **Grievance Risk Index (0 - 100)**:
- Aggregates active complaints across all bureaus.
- Automatically flags defaulting colleges before the annual **Extension of Approval (EoA)** cycle: *"Hold EoA approval pending Joint Inquiry Committee clearance."*

### 4. 📝 Digital Green Note-Sheet (e-Office Parity)
Replicates the official Government of India e-Office green note-sheet (`Tippani`) system with hierarchical ministerial sign-offs, minute annotations, and cryptographic SHA-256 signature verification.

### 5. 🗺️ GIS Regional Office Command Heatmap
Interactive command map across all 8 AICTE Regional Camp Offices:
- Northern (Kanpur), Western (Mumbai), Southern (Chennai), South-Western (Bengaluru), Central (Bhopal), North-Western (Chandigarh), Eastern (Kolkata), South-Central (Hyderabad).

### 6. 🌐 Dual-Mode Citizen Tracking Portal
Allows students and faculty members to track public milestones (`Received -> Under Scrutiny -> Notice Dispatched -> Hearing -> Disposed`) using a secure **Tracking Token** (e.g., `TRK-98124`) with captcha validation.

### 7. 📥 Bulk Data Ingestion Bridge
Allows legacy CSV/Excel spreadsheets from offline bureau registries to be dragged, validated, and ingested with automated syntax check and instant overlap screening.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | **React 18** with **TypeScript** & **Vite** |
| **Styling & Design System** | **Tailwind CSS** with official Government of India & AICTE Palette |
| **Icons & UI Primitives** | **Lucide React** |
| **Analytics & Data Visualizations** | **Recharts** (Bar charts, Donut ageing radars) |
| **Export Engines** | **SheetJS (XLSX)** for Excel export & Browser Print/PDF |
| **Bilingual Localization** | Complete **English / हिन्दी** translation dictionary |
| **State & Offline Persistence** | Reactive Context API with **LocalStorage** caching |

---

## ⚡ Quick Start & Installation

```bash
# 1. Clone the repository
git clone https://github.com/dhanya808/aicte-complaint-portal.git
cd aicte-complaint-portal

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 👥 Demo Officer Roles (Available in Top Header Switcher)

| Name | Role | Bureau | Scope |
| :--- | :--- | :--- | :--- |
| **Dr. Ramesh Chandra** | Advisor & Bureau Head | Regulation Bureau (RB) | Regulatory Norms & SCN |
| **Smt. Priya Sundaram** | Director | Public Grievance (PGRC) | Student & Staff Grievances |
| **Dr. Arvind Mahajan** | Regional Officer | Regional Office (RO) | Northern Region (Kanpur) |
| **Prof. T. G. Sitharam** | Member Secretary / Leadership | Apex Council | Council-wide Executive View |
| **Vipin Kumar** | System Administrator | e-Governance | User Access & SLA Rules |

---

## 📄 License & Attribution
Developed for the **Smart India Hackathon (SIH)**. Designed specifically for the All India Council for Technical Education (AICTE), Ministry of Education, Government of India.
