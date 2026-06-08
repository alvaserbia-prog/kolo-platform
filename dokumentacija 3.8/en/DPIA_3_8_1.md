> **Unofficial translation.** This English version is provided for convenience only. The legally authoritative text is the Serbian original; in case of any discrepancy, the Serbian version prevails.

# Data Protection Impact Assessment (DPIA)

*Version 3.8.1*

*pursuant to Art. 54 of the Law on Personal Data Protection*

*("Official Gazette of the RS", no. 87/2018)*

Date of preparation: 23.05.2026. — Date of last amendment: 06.06.2026.

*Changes in version 3.8.1: processing activity no. 12 (Integrity Monitoring of the Verification System) has been added — risk R12, measures in section 5.7, proportionality assessment in section 3.4.*

*Classification: Internal*

## 1. General Information

| **Controller and Document Data** |
| --- |
| **Controller** | KOLO Foundation |
| **Registered address** | Šetalište 16, 25000 Sombor, Republic of Serbia |
| **Email for data protection** | privatnost@ekolo.rs |
| **Data Protection Officer (DPO)** | [FULL NAME], [DPO EMAIL] |
| **DPIA version** | 3.8.1 |
| **Date of preparation** | 23.05.2026. (last amended 06.06.2026.) |
| **Subject of assessment** | KOLO system — Phase 1, active processing activities no. 1–10 and no. 12 (including the activated Module 3 — Social Programs with verifier confirmation, and Integrity Monitoring of the Verification System); inactive processing activity no. 11 (Module 4 — Children) |
| **Related documents** | Rulebook on the KOLO System (v3.8.0), Privacy Policy (v3.8.1), Records of Processing Activities (v3.8.1), Rulebook on Support Programmes (v3.8.0), Rulebook on the Hierarchy of Acts (v3.8.0), Statute (v3.8.0), Whitepaper (v3.8.0) |
| **Next review** | Before activation of Module 4, upon amendment of the social program confirmation mechanism, or at the latest 12 months from the last amendment |

This data protection impact assessment (hereinafter: DPIA) is prepared in accordance with Art. 54 of the Law on Personal Data Protection ("Official Gazette of the RS", no. 87/2018, hereinafter: LPDP). The DPIA is based on the provisions of Chapter IX of the Rulebook on the KOLO System (Art. 60–67), the Privacy Policy of the KOLO Platform, and the Records of Processing Activities of Personal Data.

The KOLO system by its nature processes personal data — the verification graph, the contribution ledger, donation data, and, in the context of certain modules, special categories of data. At the same time, the system rests on the principle of data minimization as one of its four structural principles. This DPIA covers all active processing activities in Phase 1 and identifies additional risks arising from the activation of Module 3 (Social Programs) and Module 4 (Children).

## 2. Systematic Description of Processing

## 2.1. System Description

The KOLO system is a platform for recording contributions to the common good, based on the principles of pseudonymity, data minimization, transparency of the ledger, and non-refundability of donations. The system operates through the KOLO Protocol — a technical means of processing that automatically records users' contributions in recording units (POEN).

The KOLO Foundation is the data controller within the meaning of the LPDP — it determines the purposes and means of processing (Art. 2 para. 1 item 8 LPDP). The Foundation is the controller even when it does not physically store user data in its own databases — the legally relevant criterion is the determination of the purpose and means of processing, not the physical storage of data. If the Foundation engages third parties for infrastructure maintenance, those parties are data processors within the meaning of the LPDP (Art. 45), on the basis of a processing agreement.

## 2.2. Design Decisions for Data Protection

Data protection in the system is based on data protection by design and by default (Art. 50 LPDP) and rests on three design decisions:

First design decision — pseudonymity of the ledger. Records in the contribution ledger are tied to pseudonyms, not to users' personal names. No centralized table exists that links pseudonyms to personal identities of users. Pseudonymity is not anonymity — pseudonymized data remain personal data within the meaning of the LPDP because they can, with additional information, be linked to an identified person.

Second design decision — data separation. The Foundation does not store personal data of platform users in its own databases — all user data are stored on the Protocol's infrastructure. The Foundation directly stores only the banking documentation of donations and the record of the link between the legal entity sponsor and the user in whose record the contribution is entered.

Third design decision — data minimization. The Platform collects only the data necessary for the functioning of the system. Data minimization is a structural principle of the KOLO system that cannot be abolished by any governance decision.

## 2.3. Overview of Processing Activities

The system in Phase 1 encompasses twelve processing activities defined by the Records of Processing Activities (v3.8.1). Activities 1–10 and 12 are active (Module 3 — Social Programs is activated by this assessment); activity 11 is inactive until the activation of Module 4.

| **Activity** | **Name** | **Legal basis** | **Status** |
| --- | --- | --- | --- |
| No. 1 | Registration and user account management | Execution of a contractual relationship (Art. 12 para. 1 item 2) | Active |
| No. 2 | Proof of reality (user verification) | Execution of a contractual relationship (Art. 12 para. 1 item 2) | Active |
| No. 3 | Voluntarily entered data | User's consent (Art. 12 para. 1 item 1) | Active |
| No. 4 | User activity and contribution ledger | Execution of a contractual relationship (Art. 12 para. 1 item 2) | Active |
| No. 5 | Donations by natural persons | Statutory obligation (Art. 12 para. 1 item 3) | Active |
| No. 6 | Sponsorship by legal entities | Legitimate interest (Art. 12 para. 1 item 6) | Active |
| No. 7 | Technical data and logs | Legitimate interest (Art. 12 para. 1 item 6) | Active |
| No. 8 | Automated decision-making | Execution of contractual relationship / explicit consent | Active |
| No. 9 | Data published on the guarantee board | User's consent (Art. 12 para. 1 item 1) | Active |
| No. 10 | Special categories of data (Module 3 — Social Programs with verifier confirmation) | Explicit consent (Art. 17 para. 2 item 1) | Active |
| No. 11 | Data of minors (Module 4) | Parental consent (Art. 16) | Inactive |
| No. 12 | Integrity monitoring of the verification system | Legitimate interest (Art. 12 para. 1 item 6) | Active |

Detailed categories of data, categories of data subjects, recipients, retention periods, and protection measures for each processing activity are established by the Records of Processing Activities (v3.8.1) applied together with this assessment.

## 2.4. Data Flow

Data in the KOLO system follow this flow:

The user registers on the Platform and enters a pseudonym, email address, and password. The password is hashed before storage. The user may undergo the proof-of-reality procedure (verification based on direct personal acquaintance of the verifier and the verified person), whereby the verification graph is recorded in the system in pseudonymous form. The user may voluntarily enter additional data (name and surname, telephone number) for easier use of the platform.

User activity — dinar donations, reaching thresholds, operational contribution, verification of other users — is automatically recorded in the Protocol through the issuance of POENs. The ledger is pseudonymous and public for verified users. The accounting coefficient that determines the ZRNO value is calculated automatically by a deterministic formula.

The Foundation directly stores the banking documentation of natural persons' donations and the sponsorship record of legal entities. These data are stored separately from platform data.

Technical data (IP address, device data, access log) are collected automatically for platform security purposes.

The guarantee board enables an unverified user to publish a presentation text and contact details for the purpose of establishing contact with verifiers. The text is visible to all registered users, contact details only to verified users, with logging of disclosure.

## 2.5. Recipients and Processors

The hosting provider maintaining the Protocol's infrastructure is a data processor within the meaning of Art. 45 LPDP, on the basis of a processing agreement. Banking documentation of donations remains with the Foundation and, if necessary, with the auditor. Cross-border data transfers are governed in accordance with Art. 65–69 LPDP and Art. 9 of the Privacy Policy.

## 3. Assessment of Necessity and Proportionality

For each processing activity it is assessed whether the processing is necessary to achieve the purpose and whether a less invasive alternative exists.

## 3.1. Processing Activities Based on the Execution of a Contractual Relationship (no. 1, 2, 4)

Registration (pseudonym, email, password) is the minimal set of data necessary for the functioning of the system. Without a pseudonym there is no ledger; without an email address there is no communication and account recovery. The password is stored exclusively in hashed form. Proof of reality (verification graph, reality index) is necessary for ensuring the principle of one person — one user. Activity recording is the essence of the Protocol's functioning — without it the system cannot exist. Pseudonymization reduces the risk, and an alternative (anonymization) would make functioning impossible. Conclusion: the processing activities are necessary and proportionate.

## 3.2. Processing Activities Based on Consent (no. 3, 9)

Voluntarily entered data (name, surname, telephone) are optional — the user enters them only if they wish. The guarantee board requires separate consent for each publication, with an explicit warning about the circle of persons who will see the data. Consent is voluntary, may be withdrawn at any time without consequences for status, and has an automatic expiry of 30 days. Conclusion: the processing activities are based on free consent and are proportionate to the purpose.

## 3.3. Processing Activities Based on a Statutory Obligation (no. 5)

Natural persons' donations — the Foundation is required by the Law on Accounting and tax regulations to retain records of donations for 10 years. The identity of the donor is provided through the banking system (verified bank accounts), which is an already existing infrastructure. A less invasive alternative does not exist because the law is mandatory. Conclusion: the processing is necessary and legally obligatory.

## 3.4. Processing Activities Based on Legitimate Interest (no. 6, 7, 12)

Legal entity sponsorship — the processing is necessary for the recording of sponsorship and lawful financial reporting. Proportionality test: the Foundation's interests prevail because the data are limited to the minimum necessary for recording, and the user is informed in advance. Technical data and logs — the processing is necessary for platform security, prevention of misuse, and detection of unauthorized access. The retention period is 12 months, which is proportionate to the purpose. Conclusion: the legitimate interest is justified and proportionate in both cases.

Integrity monitoring of the verification system (no. 12) — the processing is necessary to prevent misuse of the proof-of-reality system (false and "farmed" verifications, account multiplication), which would devalue the contribution ledger and governance. No new data are collected — the processing operates on existing pseudonymous data (verification graph, ledger metadata, activity indicators). The system does not make automated decisions within the meaning of Art. 38 LPDP — it only flags accounts or groups for human review, and the measure is taken by an authorised person. Proportionality test: the interest of the Foundation and honest users in the integrity of the system prevails over the minimal intrusion, because no new data are introduced, the processing is pseudonymous, no automated decisions are made, and it is subject to human review and the right to object. Conclusion: the legitimate interest is justified and proportionate.

## 3.5. Automated Decision-Making (no. 8)

POEN issuance and calculation of the accounting coefficient are automated processing activities that may have a legal or significant effect on a person within the meaning of Art. 38 LPDP. The Foundation provides: a deterministically defined public formula for the accounting coefficient, the user's right to an explanation of the logic, the right to human review, and the right to object. The public nature of the formula and the deterministic approach reduce the risk of arbitrariness. Conclusion: the processing is necessary for the functioning of the system, with adequate guarantees.

## 4. Identification and Assessment of Risks to the Rights and Freedoms of Persons

Risks are assessed according to the probability × severity matrix, whereby the risk level is determined as: low (1–4), medium (5–9), or high (10–16). Probability and severity are rated on a scale of 1–4 (negligible, low, medium, high).

| **Identified risk** | **Probability** | **Severity** | **Level** | **Explanation** |
| --- | --- | --- | --- | --- |
| R1 — Unauthorized access to infrastructure | 2 | 4 | 8 | Compromise of servers would expose pseudonymous data and email addresses. Measures: TLS, encryption at rest, MFA for admin access, access control based on minimum necessity. |
| R2 — Re-identification of pseudonymized data | 2 | 3 | 6 | Combining the pseudonymous ledger with external sources may lead to identification. Measures: no centralized linking table, separation of identification and accounting data. |
| R3 — Loss or destruction of data | 1 | 3 | 3 | Infrastructure failure or security incident. Measures: backup to geographically separate locations, regular recovery testing, backup encryption. |
| R4 — Misuse of the verification graph | 2 | 2 | 4 | Mapping of social graph through analysis of who verified whom. Measures: pseudonymity of records, anonymization of connections upon status termination, restricted access. |
| R5 — Exposure on the guarantee board | 2 | 3 | 6 | The user voluntarily publishes personal data visible to other users. Measures: separated visibility, automatic 30-day expiry, logging of disclosure, one active per user. |
| R6 — Errors in automated decision-making | 1 | 3 | 3 | Incorrect POEN calculation may affect the user's position. Measures: public deterministic formula, right to explanation and objection, human review. |
| R7 — Unauthorized use of technical logs | 1 | 2 | 2 | Logs contain IP addresses and device data. Measures: access restricted to DPO and security administrators, 12-month retention period, TLS, protected format. |
| R8 — Cross-border data transfer | 2 | 3 | 6 | If servers outside the Republic of Serbia are used. Measures: provider selection takes server location into account, application of Art. 65–69 LPDP, adequacy decision or appropriate protective measures. |
| R9 — Breach of donation data | 1 | 3 | 3 | Banking documentation is stored directly at the Foundation. Measures: physical and logical protection, access control, separate storage from platform data. |
| R10 — Undermining of ledger integrity | 1 | 4 | 4 | Retroactive modification of records would endanger the common good. Measures: zero-sum invariant (sum of all balances equal to zero) with automatic verification, atomic recording of changes, timestamping of records, audit trail of administrative actions, and regular consistency checks. |
| R11 — Disclosure of special-category membership to verifiers | 2 | 3 | 6 | In the social program confirmation procedure, the applicant's verifiers learn that the applicant has applied for a specific program, which may indicate special-category membership (e.g. disability, parental status). Measures: the procedure is initiated exclusively with explicit consent; the circle of recipients is limited to the applicant's own verifiers, persons who already know them personally; verifiers are not shown the content of the application (children's dates of birth, decision, age); notification exclusively within the platform (in-app), without external channels; possibility of withdrawing consent at any time. |
| R12 — Incorrect flagging of an honest user in integrity monitoring | 2 | 2 | 4 | The monitoring system may incorrectly flag an honest account or a tight real-world community. Measures: the system does not make automated decisions (Art. 38 LPDP) — it only flags for human review; rules prioritise the absence of genuine activity ("hollowness"), not connection density; ability to dismiss findings; right to object; audit trail; no collection of new data. |

*Color scale: green = low risk (1–4), yellow = medium risk (5–9), red = high risk (10–16). No high risks have been identified in the current system configuration.*

## 5. Risk Mitigation Measures

## 5.1. Technical Measures

Pseudonymization of the ledger — records are tied to pseudonyms, without a centralized record linking the pseudonym to the real identity (name and surname, unique citizen identification number). Data separation — identification data (pseudonym, email) are maintained in a separate record from accounting data (contribution ledger, POEN balances). Encryption of data in transit — TLS encryption minimum version 1.2 for all communications. Encryption of data at rest — encryption at the hosting infrastructure level. Ledger integrity — zero-sum invariant (sum of all balances equal to zero) with automatic verification, atomic recording and timestamping of records; deviations are visible and subject to review. Password hashing — passwords are stored exclusively in hashed form. Audit trail — administrative actions and disclosure of contact details on the guarantee board are logged in the audit trail.

## 5.2. Organizational Measures

Access control based on the principle of minimum necessity — every user, administrator, and process has access only to the necessary data (Art. 51 para. 2 LPDP). Multi-factor authentication for administrative access to the infrastructure. Confidentiality obligation for all persons with access to data. Regular training of employees and associates on data protection. Regular security checks and penetration testing of the system. Defined procedure for managing security incidents with notification of the Commissioner within 72 hours (Art. 52 LPDP).

## 5.3. Measures Specific to the Guarantee Board

Separated visibility — the presentation text is visible to all registered users, contact details only to verified users. Logging of disclosure — every display of contact details is recorded. Automatic expiry of request activity after 30 days. Restriction to one active request per user. Data are not accessible to non-registered persons and are not indexed by search engines. Withdrawal of consent is carried out in the user interface without a written request.

## 5.4. Measures for Automated Decision-Making

Deterministically defined public formula for the accounting coefficient — every user can verify the calculation logic. The user's right to an explanation of the processing logic. Right to human review — the user may request that the decision be reconsidered by an authorized person. Right to object in accordance with Art. 38 LPDP.

## 5.5. Measures for Backup and Recovery

Data are regularly backed up to geographically separate locations. Backup includes the Protocol's ledger, identification data, and system configuration. Recovery procedures are regularly tested. Backup data are subject to the same protection measures as primary data — encryption, access control, access logging.

## 5.6. Measures for Social Programs (Module 3 — Verifier Confirmation)

Explicit consent — the application to the program and the request for confirmation from verifiers are initiated exclusively with the applicant's explicit consent, which includes notification that data about the program may reveal the applicant's special-category membership to verifiers. Minimization toward verifiers — verifiers are not shown the content of the application (children's dates of birth, disability decision, age); they confirm exclusively on the basis of personal acquaintance with the applicant. Limited circle of recipients — the request for confirmation is received only by the applicant's own verifier network (persons who already know them personally), not the broader community. Special categories only with the application processor — the entered data are accessible exclusively to the person at the Foundation processing the application. No external channels — notification of verifiers takes place exclusively within the platform (in-app notification). Hard block and responsibility — the application is not approved until all verifiers confirm under full responsibility; a refusal requires a reason. Withdrawal of consent — possible at any time, with cessation of the procedure and recording. Proof of disability status is a decision of the competent authority — medical documentation and diagnosis are not collected (minimization of special categories).

## 5.7. Measures for Integrity Monitoring of Verifications

No collection of new data — monitoring operates exclusively on data that are already lawfully processed (verification graph, POEN ledger metadata, activity indicators), in pseudonymous form. No automated decision-making — the system does not take any action on an account; it exclusively flags accounts or groups and a numerical risk score for review, and every measure is taken by an authorised person (superadministrator). Emphasis on hollowness, not density — rules prioritise the absence of genuine activity so that a tight real-world community is not incorrectly treated as misuse. Ability to dismiss — the reviewer may mark a finding as unfounded, whereupon the account is not re-flagged for a defined period. Right to object — the user may contest a measure in accordance with Art. 37 LPDP. Audit trail — all actions taken on findings are recorded in the audit trail. Restricted access — findings are accessible exclusively to superadministrators; the alert channel contains only aggregate numbers, without personal data. Retention period — resolved findings are retained for at most 12 months, then deleted.

## 5.8. Residual Risk

After the application of all stated measures, the residual risk is assessed as acceptable. The highest residual risks are R1 (unauthorized access), R2 (re-identification), R5 (guarantee board), R8 (cross-border transfer), and R11 (disclosure of special-category membership to verifiers), all at the medium level (5–8). These risks are further mitigated by continuous monitoring, regular testing, and updating of measures.

## 6. Rights of Data Subjects

Users of the KOLO system have all the rights guaranteed to them by the LPDP. The Foundation provides an accessible mechanism for submitting requests and responds within 30 days, with the possibility of extension by a further 60 days in complex cases (Art. 21 para. 3 LPDP).

| **User rights and how to exercise them** |
| --- |
| **Right of access (Art. 26)** | The user may request confirmation that their data are being processed and obtain a copy. |
| **Right to rectification (Art. 29)** | The user may request the rectification of inaccurate or completion of incomplete data. |
| **Right to erasure (Art. 30)** | Limited in two cases: statutory retention obligation and ledger integrity — anonymization applies (Art. 34 of the Rulebook, Art. 11 of the Privacy Policy). |
| **Right to restriction of processing (Art. 31)** | Temporary restriction while a complaint or correction is being resolved. |
| **Right to portability (Art. 36)** | Data in a structured, machine-readable format. |
| **Right to object (Art. 37)** | For processing based on legitimate interest — the Foundation ceases processing unless it demonstrates overriding legitimate grounds. |
| **Right to withdraw consent** | For voluntary data, guarantee board data, and special categories — withdrawal at any time without consequences. |
| **Right to explanation (Art. 38)** | For automated decision-making — explanation of logic, human review, objection. |
| **Right to lodge a complaint** | Commissioner for Information of Public Importance and Personal Data Protection, Bulevar kralja Aleksandra 15, Belgrade. |

Mechanics of anonymization upon status termination: the email address is deleted, connections in the verification graph are anonymized, records in the ledger remain under an identifier that no longer enables identification — whereby they cease to be personal data within the meaning of the LPDP and are retained permanently as part of the common good.

## 7. Consultation with the Data Protection Officer

| **DPO's Opinion** |
| --- |
| **DPO** | [FULL NAME] |
| **Date of consultation** | [DATE] |
| **Opinion** | [Opinion of the data protection officer on the assessment results, acceptability of the residual risk, and any recommendations for additional measures.] |
| **DPO's signature** | [SIGNATURE] |

## 8. Plan for Modules Activated Subsequently

## 8.1. Module 3 — Social Programs (activated by this assessment)

Module 3 is activated by this assessment, in accordance with Art. 57 of the Rulebook and the Rulebook on Support Programmes (v3.8.0). The system introduces the processing of special categories of data — parental status, age, disability (competent authority's decision — not diagnosis), student status (Art. 17 LPDP). The legal basis is the explicit consent of the user (Art. 17 para. 2 item 1 LPDP). The Foundation does not retain copies of submitted documentation — only the minimum record of group membership and the date of verification remains.

To protect the integrity of programs from false applications, before approval the fulfilment of conditions is confirmed by all of the applicant's verifiers, under full responsibility and on the basis of personal acquaintance, without access to the entered data; a refusal requires a reason, and the application is not approved until all confirm (hard block). This procedure introduces risk R11 (disclosure of special-category membership to the applicant's own verifiers), for which measures are established in section 5.6.

Additional risks introduced by the module: the processing of special categories carries an inherently higher risk for persons' rights and freedoms; possibility of discrimination based on status; need for enhanced access control and separate storage. Measures are established in sections 5.1, 5.2, and 5.6. The next amendment to this DPIA is required upon any amendment of the confirmation mechanism or introduction of new data categories.

## 8.2. Module 4 — Children

Upon activation of Module 4 in accordance with Art. 58 of the Rulebook, the system introduces the processing of data of minors (Art. 16 LPDP). The legal basis is the consent of the parent or legal guardian, with additional restrictions for persons under fifteen years of age. Consent is recorded and stored separately.

Additional risks: minors are a particularly vulnerable category; processing requires enhanced protection measures; a special rulebook defining rules for access, scope of activities, exchange restrictions, and protection measures is necessary. Activation requires a prior update of this DPIA, the adoption of a Rulebook on the Children Module, and a special risk assessment before commencement of processing.

## 9. Conclusion and Decision

On the basis of the assessment conducted:

Twelve risks to the rights and freedoms of data subjects have been identified. No risk has been assessed as high. Five risks are at the medium level (R1, R2, R5, R8, R11), and seven at the low level (R3, R4, R6, R7, R9, R10, R12).

For each identified risk, appropriate technical and organizational protection measures have been applied. The residual risk after the application of measures is assessed as acceptable.

Processing may continue with the application of all described protection measures. Consultation with the Commissioner for Information of Public Importance and Personal Data Protection in accordance with Art. 55 LPDP is not necessary because no risk has been assessed as high and impossible to mitigate by measures.

This DPIA is updated in the following cases: before the activation of Module 4 (Children), upon amendment of the social program verifier confirmation mechanism or introduction of new data categories, before the introduction of a guarantee board mechanism that would expand the circle of visible data, upon amendment of the integrity monitoring system (e.g. introduction of rules that use new data or automated action-taking), upon a significant change of infrastructure or processors, upon a change in the legal framework, or at the latest 12 months from the last amendment.

| **Document Approval** |
| --- |
| **Prepared by** | [FULL NAME] |
| **Date of preparation** | 23.05.2026. |
| **Approved by — President of the Management Board** | |
| **Signature** | |
| **Date of approval** | |
| **DPO's opinion** | Acceptable / Acceptable with recommendations / Not acceptable |
| **DPO's signature** | |

In Sombor, on 23.05.2026.

**FOR THE MANAGEMENT BOARD**

President of the Management Board

_________________________

Jelena Stijepović
