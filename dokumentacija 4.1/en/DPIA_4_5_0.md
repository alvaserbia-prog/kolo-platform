> **Unofficial translation.** This English version is provided for convenience only. The legally authoritative text is the Serbian original; in case of any discrepancy, the Serbian version prevails.

# Data Protection Impact Assessment (DPIA)

*pursuant to Art. 54 of the Law on Personal Data Protection*

*("Official Gazette of the RS", no. 87/2018)*

*Classification: Internal*

## 1. General Information

| **Controller and Document Data** |
| --- |
| **Controller** | KOLO Foundation |
| **Registration number / PIB** | 28836627 / 115840443 |
| **Registered address** | Šetalište 16, 25000 Sombor, Republic of Serbia |
| **Email for data protection** | privatnost@ekolo.rs |
| **Data Protection Officer (DPO)** | Nikola Šarić, alva.serbia@gmail.com |
| **Date of preparation** | 23.05.2026. (last amended 16.06.2026.) |
| **Subject of assessment** | KOLO system — Phase 1, active processing activities no. 1–15, including the activated Module 3 (Social Programs with verifier confirmation), Integrity Monitoring of the Verification System, the public list of donations, the supervision case, the exchange contribution path, and the **activated Module 4 — Children (activity no. 11)** |
| **Related documents** | Rulebook on the KOLO System (v4.4.6), Privacy Policy (v4.5.0), Records of Processing Activities (v4.5.0), Rulebook on Support Programmes (v4.5.0), Rulebook on the Hierarchy of Acts (v4.4.6), Statute (v4.1), Whitepaper (v4.4.6) |
| **Next review** | Upon amendment of the social program confirmation mechanism, upon amendment of the rules of the children's space, or at the latest 12 months from the last amendment |

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

The system in Phase 1 encompasses sixteen processing activities defined by the Records of Processing Activities (v4.5.0). All sixteen activities are active. Activity 16 covers the procurement proposal and participation in collective procurement, introduced by Articles 14a and 51a of the KOLO System Rulebook. Module 3 (Social Programs) was activated by an earlier version of this assessment; activity 13 covers the public list of donations, activity 14 the supervision case introduced by the Rulebook on Proof of Reality 4.2.1, and activity 15 the exchange contribution path introduced by Article 40b of the Rulebook on the KOLO System. **Activity 11 (Module 4 — Children) is activated by this assessment**, together with the Rulebook on the Participation of Children.

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
| No. 9 | Data in a listing by an unverified user | User's consent (Art. 12 para. 1 item 1) | Active |
| No. 10 | Special categories of data (Module 3 — Social Programs with verifier confirmation) | Explicit consent (Art. 17 para. 2 item 1) | Active |
| No. 11 | Data of minors (Module 4 — Children) | Parental consent (Art. 16); legitimate interest for the parent's address (Art. 12(1)(6)) | Active |
| No. 12 | Integrity monitoring of the verification system | Legitimate interest (Art. 12 para. 1 item 6) | Active |
| No. 13 | Publication of the donor's name in the donation list (public donation) | Consent (Art. 12 para. 1 item 1) | Active |
| No. 14 | Supervision case (supervision outcome of a verification) | Performance of the contractual relationship (Art. 12(1)(2)) | Active |
| No. 15 | Enquiry in relation to a listing and the exchange contribution path | Performance of the contractual relationship (Art. 12(1)(2)) | Active |

Detailed categories of data, categories of data subjects, recipients, retention periods, and protection measures for each processing activity are established by the Records of Processing Activities (v4.5.0) applied together with this assessment.

## 2.4. Data Flow

Data in the KOLO system follow this flow:

The user registers on the Platform and enters a pseudonym, email address, and password. The password is hashed before storage. The user may undergo the proof-of-reality procedure (verification based on direct personal acquaintance of the verifier and the verified person), whereby the verification graph is recorded in the system in pseudonymous form. The user may voluntarily enter additional data (name and surname, telephone number) for easier use of the platform.

User activity — dinar donations, reaching thresholds, operational contribution, verification of other users — is automatically recorded in the Protocol through the issuance of POENs. The ledger is pseudonymous and public for verified users. The accounting coefficient that determines the ZRNO value is calculated automatically by a deterministic formula.

The Foundation directly stores the banking documentation of natural persons' donations and the sponsorship record of legal entities. These data are stored separately from platform data.

Technical data (IP address, device data, access log) are collected automatically for platform security purposes.

A listing by an unverified user contains data about the good or service offered (title, description, category, price, place, photographs) and, at the user's choice, a telephone number. The listing is publicly visible; the telephone number is accessible only to verified users.

## 2.5. Recipients and Processors

The Protocol's infrastructure is maintained by the following processors within the meaning of Art. 45 LPDP, all on the basis of a processing agreement: Vercel Inc. (hosting and application delivery), Neon Inc. (database), Cloudflare, Inc. (image storage — the Cloudflare R2 service; only the image URL is written to the database), Resend, Inc. (delivery of system email messages), and Telegram Messenger Inc. (alert channel to the Foundation). In addition, upon the user's consent, Google Ireland Limited or Google LLC processes traffic data. Banking documentation of donations remains with the Foundation and, if necessary, with the auditor; card payment of a donation is processed by the Foundation's commercial bank and its online payment intermediary, both in the Republic of Serbia.

Vercel Inc. and Neon Inc. are US companies, but **the application is executed and the database is located in the European Union, in the Frankfurt region**. The European Union provides an adequate level of protection, so for those data there is no cross-border transfer within the meaning of Art. 65–69 LPDP; the possibility of access from the USA for administrative and technical purposes remains. A cross-border transfer actually takes place for images (Cloudflare R2), the email sent by the Platform (Resend), alerts to the Foundation (Telegram), and traffic measurement (Google), and is governed in accordance with Art. 65–69 LPDP and Art. 9 of the Privacy Policy.

## 3. Assessment of Necessity and Proportionality

For each processing activity it is assessed whether the processing is necessary to achieve the purpose and whether a less invasive alternative exists.

## 3.1. Processing Activities Based on the Execution of a Contractual Relationship (no. 1, 2, 4, 15)

Registration (pseudonym, email, password) is the minimal set of data necessary for the functioning of the system. Without a pseudonym there is no ledger; without an email address there is no communication and account recovery. The password is stored exclusively in hashed form. Proof of reality (verification graph, reality index) is necessary for ensuring the principle of one person — one user. Activity recording is the essence of the Protocol's functioning — without it the system cannot exist. Pseudonymization reduces the risk, and an alternative (anonymization) would make functioning impossible. Conclusion: the processing activities are necessary and proportionate.

## 3.2. Processing Activities Based on Consent (no. 3, 9)

Voluntarily entered data (name, surname, telephone) are optional — the user enters them only if they wish. Posting a listing constitutes consent, given with a warning that the listing is publicly visible. Consent is voluntary and may be withdrawn at any time by removing the listing, without consequences for status. Conclusion: the processing activities are based on free consent and are proportionate to the purpose.

## 3.3. Processing Activities Based on a Statutory Obligation (no. 5)

Natural persons' donations — the Foundation is required by the Law on Accounting and tax regulations to retain records of donations for 10 years. The identity of the donor is provided through the banking system (verified bank accounts), which is an already existing infrastructure. A less invasive alternative does not exist because the law is mandatory. Conclusion: the processing is necessary and legally obligatory.

## 3.4. Processing Activities Based on Legitimate Interest (no. 6, 7, 12)

Legal entity sponsorship — the processing is necessary for the recording of sponsorship and lawful financial reporting. Proportionality test: the Foundation's interests prevail because the data are limited to the minimum necessary for recording, and the user is informed in advance. Technical data and logs — the processing is necessary for platform security, prevention of misuse, and detection of unauthorized access. The retention period is 12 months, which is proportionate to the purpose. Conclusion: the legitimate interest is justified and proportionate in both cases.

Integrity monitoring of the verification system (no. 12) — the processing is necessary to prevent misuse of the proof-of-reality system (false and "farmed" verifications, account multiplication), which would devalue the contribution ledger and governance. No new data are collected — the processing operates on existing pseudonymous data (verification graph, ledger metadata, activity indicators). The system does not make automated decisions within the meaning of Art. 38 LPDP — it only flags accounts or groups for human review, and any measure is taken by an authorised person. Proportionality test: the interest of the Foundation and honest users in the integrity of the system prevails over the minimal intrusion, because no new data are introduced, the processing is pseudonymous, no automated decisions are made, and it is subject to human review and the right to object. Conclusion: the legitimate interest is justified and proportionate.

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
| R5 — Public visibility of a listing by an unverified user | 2 | 2 | 4 | The listing is publicly visible and indexed. The user chooses the content; identifying data are not requested. Measures: content minimum instead of personal data, telephone number not public, at most three active listings, removal at any time. |
| R6 — Errors in automated decision-making | 1 | 3 | 3 | Incorrect POEN calculation may affect the user's position. Measures: public deterministic formula, right to explanation and objection, human review. |
| R7 — Unauthorized use of technical logs | 1 | 2 | 2 | Logs contain IP addresses and device data. Measures: access restricted to DPO and security administrators, 12-month retention period, TLS, protected format. |
| R8 — Cross-border data transfer | 1 | 3 | 3 | Part of the processing takes place outside the Republic of Serbia. Measures, all implemented: the application and the database are executed in the European Union (Frankfurt region), which provides an adequate level of protection, so the greater part of the data never leaves that circle at all; only images, the email sent by the Platform, alerts to the Foundation, and traffic data go to a third country; an alert to the Foundation contains no data from an application for a support programme; data are transferred exclusively to a processor with which a processing agreement containing the safeguards under Art. 65 LPDP has been concluded; the Foundation keeps a copy of each such agreement and verifies at least once a year whether it is in force and whether the list of sub-processors has changed. See section 5.13. |
| R9 — Breach of donation data | 1 | 3 | 3 | Banking documentation is stored directly at the Foundation. Measures: physical and logical protection, access control, separate storage from platform data. |
| R10 — Undermining of ledger integrity | 1 | 4 | 4 | Retroactive modification of records would endanger the common good. Measures: zero-sum invariant (sum of all balances equal to zero) with automatic verification, atomic recording of changes, timestamping of records, audit trail of administrative actions, and regular consistency checks. |
| R11 — Disclosure of special-category membership to verifiers and in the public ledger | 3 | 3 | 9 | In the social program confirmation procedure, the applicant's verifiers learn that the applicant has applied for a specific program, which may indicate special-category membership (e.g. disability, parental status). The record of recorded POEN carries the same information: alongside the user's pseudonym it shows the basis of the recording, including the name of the program, and it is visible to every verified user, permanently. The likelihood is therefore assessed as 3 rather than 2 — the circle of recipients is not limited to the verifiers. Measures: the procedure is initiated exclusively with explicit consent which states the number of persons who will be asked and the publicity of the record; verifiers are not shown the content of the application (children's dates of birth, decision, age); notification exclusively within the platform — the message that leaves it contains neither the name of the program nor the pseudonym; withdrawal of consent is possible at any time, by an action available alongside the program itself, with deletion of the entered data; the entered data are also deleted on any other termination of the application. |
| R12 — Incorrect flagging of an honest user in integrity monitoring | 2 | 2 | 4 | The monitoring system may wrongly flag an honest account or a close-knit real-world community. Measures: the system does not make automated decisions (Art. 38 LPDP) — it only flags for human review; rules prioritise the absence of genuine activity ("hollowness"), not connection density; ability to dismiss findings; right to object; audit trail; no collection of new data. |
| R13 — De-anonymization of a donor through the public donation list | 2 | 3 | 6 | Public publication of the first and last name of a donor who chooses a public donation (with the recording of POEN) makes it possible to link the donor's pseudonymous record with their identity, which may de-anonymize the entire ledger of that user, since the donation is tied to the account/pseudonym. Purpose: transparency and public recognition of the contribution. Legal basis: consent (Art. 12 LPDP). Categories of data: first and last name, donation amount and date, associated pseudonym. Recipients: verified platform users. Measures: the choice is voluntary and made per individual donation; a clear warning before a public donation; the anonymous option without POEN as an alternative; the rule applies only prospectively. |
| R14 — Unfounded suspicion recorded alongside a verification | 2 | 2 | 4 | A supervisor may record the outcome "needs review" or "disputed" without real grounds, leaving a record of suspicion about two people attached to the verification. Measures: closed list of reasons (free text only with "other"); supervision may not be performed by a participant in the verification; the case produces no effect towards a user and is seen only by the Management Board; a case closed without grounds is deleted upon the expiry of 90 days without a request from the data subject; audit log; right to object under Art. 37 LPDP. |

| R16 — Processing of a child's data before consent has been obtained, and the friendship graph | 2 | 4 | 8 | A minor may open an account independently, so until the account is taken over the pseudonym, the data for access to the account, the parent's address, and the records of friendships formed in that period are processed before consent, on the basis of legitimate interest; the friendship graph additionally reveals the child's circle of acquaintances, and the POEN recorded on the basis of that graph is publicly measurable in aggregate. Measures: in the period before consent the scope is reduced to what is necessary for establishing contact with the parent; the Chat Room, listings, communication with adults, and the recording of POEN are closed in that period, so the minor user is not exposed to adults; friendships formed in that period are not public and no contribution is recorded on their basis; the minor user may delete the account themselves at any time; deletion upon expiry of fourteen days without a request from the person, together with the friendship records; only the pseudonym in the message to the parent; two actions to stop the processing without login; full access only once the parent has been confirmed by a third party in the chain of confirmations; the friendship graph is not public and the parent sees it without the content of conversations; the right to object under Art. 37 LPDP. See point 5.11. Stating a school links a pseudonym to a place the minor user attends; school membership is therefore published only in aggregate, while the individual overview is available to signed-in users and gives no access to the profile. A minor user's own email address is voluntary and serves solely to regain access to the account; it is recorded only upon confirmation from that very address, so an incorrectly stated address opens no path to the account, and no notifications are sent to it. |

| R15 — Monitoring of user behaviour through the path counter | 2 | 2 | 4 | The exchange contribution path reads with whom a user exchanged POENs, in what amount, and who contacted them in relation to a listing. Taken together, those data show the circle of people with whom the user deals, beyond what the exchange itself requires. Measures: no new data are collected apart from the fact of the enquiry (without the content of the message); progress along the path is visible only to the user themselves and is not public (Art. 67 of the Rulebook); the data are not used for profiling, recommendations, or advertising; the enquiry record is deleted together with the listing; there is no automated decision-making within the meaning of Art. 38 LPDP — the recording is the application of publicly published rules and does not affect the user's status; right to object under Art. 37 LPDP. |

| R17 — Publication of the order and of participation data in a procurement | 1 | 3 | 3 | Establishing the order by the number of POEN and publishing the list of those who collected a share reveal a user's relative position in the record of contributions and their participation in the distribution. Measures: a proposal contains only the name of a good, without quantity, price, or reasoning; the register of proposals is published in aggregate, without pseudonyms; the number of POEN is not published alongside the list of collectors; the supplier is provided solely with a list of collection codes, without pseudonyms or other data; no evidence of status, occupation, or property is collected; the number of POEN is not collected anew but read from activity No. 4; establishing the order is the application of publicly published rules and does not affect user status, so there is no automated decision-making within the meaning of Art. 38 of the LPDP; the right of objection under Art. 37 of the LPDP and under Article 30 of the Rulebook, decided upon by a human being. See point 5.12. |
*Color scale: green = low risk (1–4), yellow = medium risk (5–9), red = high risk (10–16). No high risks have been identified in the current system configuration.*

## 5. Risk Mitigation Measures

## 5.1. Technical Measures

Pseudonymization of the ledger — records are tied to pseudonyms, without a centralized record linking the pseudonym to the real identity (name and surname, unique citizen identification number). Data separation — identification data (pseudonym, email) are maintained in a separate record from accounting data (contribution ledger, POEN balances). Encryption of data in transit — TLS encryption minimum version 1.2 for all communications. Encryption of data at rest — encryption at the hosting infrastructure level. Ledger integrity — zero-sum invariant (sum of all balances equal to zero) with automatic verification, atomic recording and timestamping of records; deviations are visible and subject to review. Password hashing — passwords are stored exclusively in hashed form. Audit trail — administrative actions and the initiation of conversations regarding a listing are logged in the audit trail.

## 5.2. Organizational Measures

Access control based on the principle of minimum necessity — every user, administrator, and process has access only to the necessary data (Art. 51 para. 2 LPDP). Multi-factor authentication for administrative access to the infrastructure. Confidentiality obligation for all persons with access to data. Regular training of employees and associates on data protection. Regular security checks and penetration testing of the system. Defined procedure for managing security incidents with notification of the Commissioner within 72 hours (Art. 52 LPDP).

## 5.3. Measures Specific to a Listing by an Unverified User

Minimization by design — publication requires a content minimum about the GOOD or SERVICE (photograph, description, category, place), not about the person; a photograph of the face, name, and surname are neither requested nor required. The telephone number is not public — it is accessible exclusively to verified users. A visible mark that the advertiser is not verified — protects the other party to the exchange. Restriction to three active listings per unverified user. Removal of the listing at any time, which also withdraws consent, without a written request.

*Note on the amendment.* This version abolishes the former guarantee board and with it the processing of the "recognition card" (name, surname, year of birth, place, nickname, description of occupation, telephone number, and consent to being called) — the most sensitive processing of personal data the system had. All data collected through it have been deleted. The amendment removes processing; risk R5 thereby falls from 6 to 4.

## 5.4. Measures for Automated Decision-Making

Deterministically defined public formula for the accounting coefficient — every user can verify the calculation logic. The user's right to an explanation of the processing logic. Right to human review — the user may request that the decision be reconsidered by an authorized person. Right to object in accordance with Art. 38 LPDP.

## 5.5. Measures for Backup and Recovery

Data are regularly backed up to geographically separate locations. Backup includes the Protocol's ledger, identification data, and system configuration. Recovery procedures are regularly tested. Backup data are subject to the same protection measures as primary data — encryption, access control, access logging.

## 5.6. Measures for Social Programs (Module 3 — Verifier Confirmation)

Explicit consent — the application to the program and the request for confirmation from verifiers are initiated exclusively with the applicant's explicit consent. Consent is requested before confirmation is requested from anyone and expressly states: how many persons will be asked; that those persons learn which program is concerned and that this may reveal their special-category membership; and that the record of recorded POEN — with the name of the program and alongside the pseudonym — is visible to all verified users. Minimization toward verifiers — verifiers are not shown the content of the application (children's dates of birth, disability decision, age); they confirm exclusively on the basis of personal acquaintance with the applicant. Limited circle of recipients in the procedure — the request for confirmation is received only by the applicant's own verifier network (persons who already know them personally), not the broader community. Special categories only with the application processor — the entered data are accessible exclusively to the person at the Foundation processing the application, who alone is authorized to decide on it. No external channels — the notification of a request for confirmation is displayed exclusively within the platform; the message the platform sends by electronic mail or to the user's device contains neither the name of the program nor the applicant's pseudonym. Hard block and responsibility — the application is not approved until all verifiers confirm under full responsibility; a refusal requires a reason. Withdrawal of consent — implemented as an action available to the user alongside the program itself, at any time and without stating reasons; withdrawal terminates the procedure, ends the recording, and deletes the entered data. Deletion of entered data upon termination of the application — the data entered in the application are also deleted when the application is refused, suspended at the review of status, or when the user's status ceases; a new application requires re-entry and fresh confirmation by all verifiers. Closing the procedure — once the procedure has ended, the confirmation requests and the notifications about them are removed from the verifiers' accounts. Proof of disability status is a decision of the competent authority — medical documentation and diagnosis are not collected (minimization of special categories).

Accepted consequence of the ledger's publicity — the name of the program alongside the pseudonym remains visible to verified users even after the application ends, because recorded POEN is not annulled. This is knowingly accepted: the verifiability of the ledger rests on every entry being attributable to a basis, and the sum of the records in the Protocol is zero. The mitigation lies in the fact that consent is given after this consequence has been expressly stated, together with the only alternative — that the user does not apply for the program.

## 5.7. Measures for Integrity Monitoring of Verifications

No collection of new data — monitoring operates exclusively on data that are already lawfully processed (verification graph, POEN ledger metadata, activity indicators), in pseudonymous form. No automated decision-making — the system does not take any action on an account; it exclusively flags accounts or groups and a numerical risk score for review, and every measure is taken by an authorised person (superadministrator). Emphasis on hollowness, not density — the rules prioritise the absence of genuine activity, so that a close-knit real-world community is not wrongly treated as misuse. Ability to dismiss — the reviewer may mark a finding as unfounded, whereupon the account is not re-flagged for a defined period. Right to object — the user may contest a measure in accordance with Art. 37 LPDP. Audit trail — all actions taken on findings are recorded in the audit trail. Restricted access — findings are accessible exclusively to superadministrators; the alert channel contains only aggregate numbers, without personal data. Retention period — resolved findings are retained for at most 12 months, then deleted.

## 5.9. Measures for the Supervision Case

No new data from users — a case arises from the supervisor's assessment of a record that is already lawfully processed. Closed list of reasons — the reason is selected from a predetermined list, and free text is possible only with the reason "other", which prevents arbitrary observations about a person from being entered. No conflict of interest — supervision may not be performed by anyone who took part in the verification, on either side, nor may the same supervisor act twice on the same record. No decision-making — the case is a record, not a body; a false verification is established solely by the Management Board, so there is no automated decision-making within the meaning of Art. 38 LPDP. Narrow circle of recipients — the case is seen only by a superadministrator; the verifier and the verified user do not see it. Deletion by time limit — a suspicion that was not confirmed is deleted 90 days after the case is closed, automatically and without a request from the data subject. Audit log — the opening and every resolution of a case are recorded. Right to object — Art. 37 LPDP and objection to a decision under the Terms of Use.

## 5.10. Measures for the Exchange Contribution Path

Minimisation — the only new datum is the fact of the enquiry (which user made contact and in relation to which listing); the content of messages is not processed for this purpose, and a repeated contact regarding the same listing does not create a new record. No new collection — the remainder is read from data already lawfully processed: records of POEN ledger updates (activity no. 4) and the verification graph (activity no. 2). Narrow purpose — the data are used solely to establish the steps passed; they are not used for profiling, recommendations, ranking, or advertising. Non-publicity — progress along the path is visible only to the user themselves (Art. 67 of the Rulebook); it does not enter public aggregates or the view of other users. No decision-making — the recording is the application of publicly published rules and produces no consequences for the user's status, so there is no automated decision-making within the meaning of Art. 38 LPDP. Deletion — the enquiry record is deleted together with the listing to which it relates. Right to object — Art. 37 LPDP.

## 5.11. Measures for the Children's Space (Module 4 — Children)

**Minimization in the period before consent** — until the account is taken over by a parent, the pseudonym, the data necessary for access to the account, the parent's email address, and the records of friendships formed in that period are processed; the date of birth is not requested from the child but entered by the parent, and is not changed thereafter. **Functions closed in that period** — the Chat Room, listings, communication with adults, and the recording of POEN are unavailable until the account is taken over, so the minor user is not exposed to adults in that period; a friendship is formed solely by scanning a code in person, with another minor user. **The minor user's own way out** — a minor user whose account is awaiting takeover may delete it themselves at any time, without the parent's involvement and without addressing the Foundation. **The period as a measure** — an account that nobody takes over within fourteen days is deleted without a request from the person. **No identifying data in the message to a third party** — the invitation to the parent states only the pseudonym, never the name, because the accuracy of the address is not verified. **Two exits without login** — the recipient of the message may declare that they are not the child's parent and may delete the account. **Indirect but real verification of the parent's identity** — full access and the recording of contributions open only once the parent becomes a verified user through the chain of confirmations. **Narrowed parental insight** — conversations between minor users are not shown to the parent; friendships with dates and conversations without content are shown. **Notification of the adult party** — in a conversation with a minor user, the adult user is shown that the conversation is read by a parent. **Filtering of the children's Chat room by the friendship graph** — a minor user sees the messages of their friends, and replying by quoting another's message is not supported so that the filter cannot be circumvented. **Non-publicity of the graph** — friendships are not public and do not enter public aggregates. **No automated decision-making** — the recording of a contribution is an application of publicly published rules and does not affect the user's status (Art. 38 LPDP). **Closed profile of a minor user** — adult users are shown a notice with the parent's pseudonym instead of the profile; parental consent does not open the profile but governs communication and exchange. **Aggregate nature of the overview by school** — only numbers and shares are published publicly, with no personal data; the individual overview of a single school is available to signed-in users and gives no access to the profile. **No history of school choices** — only the current value and the moment of the last change are kept, with a thirty-day interval between two changes. **Confirmation of the minor user's own address** — an address stated by a minor user is recorded only after they confirm it by opening a link sent to that address; a typing error therefore does not hand access to the account to a third party. **Purpose narrower than the channel** — no notifications are sent to a minor user's address; it serves only for setting a new password. **A way out even without an address** — where a minor user has no address of their own, the parent sets the new password, with notice to the minor user, so a forgotten password does not mean the loss of the account. **Balancing test for processing on the basis of legitimate interest** — the processing of the parent's email address and of the minor user's data in the period before the account is taken over rests on legitimate interest (Art. 12 para. 1 item 6 LPDP). The interest is obtaining the consent required by law: without contact with the parent the consent cannot even be requested, so without this processing the minor cannot be given lawful access. The processing is necessary because no less intrusive means exists — the parent's address is the only datum the minor has, and without a record of the account itself the invitation could not be tied to anyone. The interests and rights of the minor prevailed where they could: the scope is reduced to what is necessary, the period is limited to fourteen days, the functions that would expose the minor user to adults are closed, the message to the parent contains only the pseudonym, the recipient of the message has two ways out without login, and the minor user has their own. The expectations of the data subject are respected in that the processing is initiated only by the minor, by entering their parent's address, and that its only outcome is a message to that parent. **Accepted consequence of deletion without login** — the account may be deleted from the invitation without logging in, on the basis of the one-time authorization in the message, so whoever holds the message may delete the account even when they are not that child's parent. The consequence is accepted: the alternative is that the account continues to use the address of a person unconnected with the minor user, and the only person the system can ask at that moment is the one holding the message.

## 5.12. Measures for Collective Procurement

**Minimisation of the proposal** — a procurement proposal contains only the name of a good; quantity, price, reasoning, and any other data are not requested. **Aggregate publication** — the register of proposals is published without pseudonyms; an individual proposal is not published. **No proof of status** — no eligibility criteria are set, so no documents or statements about a user's occupation, property, or circumstances are collected. **No new collection** — the number of POEN by which the order is established is read from activity No. 4. **The supplier receives no personal data** — solely a list of collection codes is provided to it. **Narrowed publication of the outcome** — the pseudonym and position in the order are published alongside the list of those who collected a share, but not the number of POEN in the record. **No automated decision-making** — establishing the order is the application of publicly published rules and produces no consequences for user status (Art. 38 of the LPDP), with an express right of objection decided upon by a human being. **Deletion** — a proposal is deleted by choosing another name, by removal, by the carrying out of a procurement for that name, and at the latest upon the expiry of twelve months.

## 5.13. Measures for Cross-Border Transfer

**Processing in the European Union** — the application is executed and the database is located in the Frankfurt region. The Protocol's ledger, the data from applications for support programmes, messages between users, and the data of minor users therefore remain within a circle with an adequate level of protection. **A narrow scope of what leaves** — only the images uploaded by users, the email sent by the Platform, the alerts sent to the Foundation, and traffic data go to a third country. **The alert channel is reduced to a minimum** — an alert to the Foundation contains the pseudonym and the type of event, and contains neither the data entered in an application for a support programme nor the content of users' messages. **An agreement as a condition of transfer** — data are transferred exclusively to a processor with which a processing agreement containing standard contractual clauses or other safeguards under Art. 65 LPDP has been concluded. **Annual verification** — the Foundation keeps a copy of each such agreement and verifies at least once a year whether it is in force and whether the list of sub-processors has changed. **Traffic measurement upon consent** — Google Analytics is not loaded until the user consents, and cookieless measurement sets no cookies and does not track the user across websites.

## 5.8. Residual Risk

After the application of all stated measures, the residual risk is assessed as acceptable. The highest residual risks are R1 (unauthorized access), R2 (re-identification), R11 (disclosure of special-category membership to verifiers and in the public ledger), R13 (de-anonymization of a donor through the public list of donations), and R16 (the children's space), all at the medium level (5–9). Risk R8 (cross-border transfer) falls to a low level (3) because the application and the database are executed in the European Union, so the greater part of the data never leaves the circle with an adequate level of protection. Risk R5 (public visibility of a listing) falls to a low level (4) with the abolition of the board and the narrowing of the processing. These risks are further mitigated by continuous monitoring, regular testing, and updating of measures.

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
| **Right to withdraw consent** | For voluntary data, published listings, and special categories — withdrawal at any time without consequences. |
| **Right to explanation (Art. 38)** | For automated decision-making — explanation of logic, human review, objection. |
| **Right to lodge a complaint** | Commissioner for Information of Public Importance and Personal Data Protection, Bulevar kralja Aleksandra 15, Belgrade. |

Mechanics of anonymization upon status termination: the email address is deleted, connections in the verification graph are anonymized, records in the ledger remain under an identifier that no longer enables identification — whereby they cease to be personal data within the meaning of the LPDP and are retained permanently as part of the common good.

## 7. Consultation with the Data Protection Officer

| **DPO's Opinion** |
| --- |
| **DPO** | Nikola Šarić |
| **Date of consultation** | 16.06.2026 |
| **Opinion** | Following the application of the technical and organizational measures set out in Section 5, the residual risk is assessed as acceptable. Processing may commence subject to regular monitoring of the measures and updating of this assessment in the cases set out in Section 8 (in particular before the activation of Module 4 and upon any significant change of infrastructure or processors). |
| **DPO's signature** | Nikola Šarić |

## 8. Plan for Modules Activated Subsequently

## 8.1. Module 3 — Social Programs (activated by this assessment)

Module 3 is activated by this assessment, in accordance with Art. 57 of the Rulebook and the Rulebook on Support Programmes (v4.5.0). The system introduces the processing of special categories of data — parental status, age, disability (competent authority's decision — not diagnosis), student status (Art. 17 LPDP). The legal basis is the explicit consent of the user (Art. 17 para. 2 item 1 LPDP). The Foundation does not retain copies of submitted documentation — only the minimum record of group membership and the date of verification remains.

To protect the integrity of programs from false applications, before approval the fulfilment of conditions is confirmed by all of the applicant's verifiers, under full responsibility and on the basis of personal acquaintance, without access to the entered data; a refusal requires a reason, and the application is not approved until all confirm (hard block). This procedure introduces risk R11 (disclosure of special-category membership to the applicant's own verifiers and, through the public ledger, to all verified users), for which measures are established in section 5.6.

Additional risks introduced by the module: the processing of special categories carries an inherently higher risk for persons' rights and freedoms; possibility of discrimination based on status; need for enhanced access control and separate storage. Measures are established in sections 5.1, 5.2, and 5.6. The next amendment to this DPIA is required upon any amendment of the confirmation mechanism or introduction of new data categories.

## 8.2. Module 4 — Children

This assessment **activates** Module 4, together with the Rulebook on the Participation of Children. The system processes data of minors (Art. 16 LPDP) on the basis of the consent of a parent or legal guardian, with additional restrictions for persons under fifteen years of age.

**Two entry paths and a window before consent.** A minor user's account is opened by a parent from their own account, or by the minor themselves. In the latter case there is a window in which data are processed BEFORE parental consent has been obtained. The period is deliberately reduced to a minimum: the pseudonym, the data necessary for access to the account, the parent's email address, and the records of friendships formed in that period are processed; the Chat Room, listings, and communication with adults are closed, no contribution is recorded, the minor user may delete the account themselves, and an account that nobody takes over within fourteen days is deleted. Processing in that period rests on legitimate interest (Art. 12 para. 1 item 6 LPDP), with the balancing test in section 5.11. The fourteen-day period is a protective measure, not an operational convenience.

**The parent's address as third-party data.** The address is entered by the minor and its accuracy is not verified. It is processed on the basis of legitimate interest (Art. 12(1)(6) LPDP) for the purpose of obtaining the consent required by law. Proportionality test: the interest prevails because the processing is reduced to a single message, the message states only the pseudonym (never the name), the address is not recorded as the address of the minor user's account and opens no path to login, and the recipient of the message has two actions that stop the processing — a declaration that they are not the child's parent, and deletion of the account, both without login.

**Consent is stronger than the reasonable-effort standard.** A minor user's account gains full access and the recording of contributions only once the parent becomes a verified user through the chain of confirmations — that is, once their identity has been confirmed by a third party in the real world. Common practice is satisfied by pressing a button in a message; here that check is indirect but real.

**Parental insight is NARROWED compared with the previous version.** The parent does not read conversations between minor users, because such insight also touches another child whose parent has not granted it; they see the list of friendships and the list of conversations without content. The parent does read a conversation with an adult user, and this is expressly shown to the adult party. This is the only amendment in the history of this assessment that **removes** processing rather than adding it.

**A new recording channel.** A friendship between minor users records a contribution (Art. 15, item 9 of the Rulebook). The recording is an application of publicly published rules and produces no consequences for the user's status, so there is no automated decision-making within the meaning of Art. 38 LPDP.

Additional risks: minors are a particularly vulnerable category; the friendship graph reveals the child's circle of acquaintances; the window before consent. The risk is described as **R16**, and the measures in point **5.11**. The next amendment of this assessment is required upon any amendment of the rules of the children's space.

## 9. Conclusion and Decision

On the basis of the assessment conducted:

Seventeen risks to the rights and freedoms of data subjects have been identified. No risk has been assessed as high. Five risks are at the medium level (R1, R2, R11, R13, R16), and twelve at the low level (R3, R4, R5, R6, R7, R8, R9, R10, R12, R14, R15, R17).

For each identified risk, appropriate technical and organizational protection measures have been applied. The residual risk after the application of measures is assessed as acceptable.

Processing may continue with the application of all described protection measures. Consultation with the Commissioner for Information of Public Importance and Personal Data Protection in accordance with Art. 55 LPDP is not necessary because no risk has been assessed as high and impossible to mitigate by measures.

This DPIA is updated in the following cases: before the activation of Module 4 (Children), upon amendment of the social program verifier confirmation mechanism or introduction of new data categories, upon amendment of the integrity monitoring system (e.g. introduction of rules that use new data or automated action-taking), upon a significant change of infrastructure or processors, upon a change in the legal framework, or at the latest 12 months from the last amendment.

| **Document Approval** |
| --- |
| **Prepared by** | Nikola Šarić |
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
