> **Unofficial translation.** This English version is provided for convenience only. The legally authoritative text is the Serbian original; in case of any discrepancy, the Serbian version prevails.

# Records of Processing Activities of Personal Data

*Version 4.0.0*

*Amendment 4.0.0 (22.07.2026): consolidation of the entire documentation set to version 4.0 upon the entry of the KOLO Foundation in the Register of Endowments and Foundations (registration number 28836627, PIB 115840443). The Foundation's registration details have been added and version references updated; the Statute of the Foundation applies in version 4.1. Otherwise unchanged in substance.*

Date of last amendment: 16.06.2026.

*These Records are adopted on the basis of Art. 47 of the Law on Personal Data Protection ("Official Gazette of the RS", no. 87/2018, hereinafter: LPDP), Art. 62 and 63 of the Rulebook on the KOLO System (version 4.0.0), and Art. 9 of the Rulebook on the Hierarchy of Acts of the KOLO System. They are applied together with the Privacy Policy of the KOLO Platform (version 4.0.0) and the Rulebook on Support Programmes (version 4.0.0).*

**CONTROLLER DETAILS**

| **Controller** | KOLO Foundation |
| --- | --- |
| **Registered address** | Šetalište 16, 25000 Sombor, Republic of Serbia |
| **Registration number** | 28836627 |
| **Tax ID (PIB)** | 115840443 |
| **Email** | privatnost@ekolo.rs |
| **Data Protection Officer** | Nikola Šarić, alva.serbia@gmail.com |

**Processing activity no. 1 — Registration and user account management**

| **Purpose of processing** | Functioning of the system, identification of the user within the system, communication, account verification, and access security. |
| --- | --- |
| **Categories of data subjects** | Users of the KOLO Platform. |
| **Categories of data** | Pseudonym (username), email address, password (stored exclusively in hashed form), date of joining the system. |
| **Legal basis** | Execution of a contractual relationship (Art. 12 para. 1 item 2 LPDP) — by joining the system, the user accepts the terms of use. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement in accordance with the law. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | While the user account remains active. Upon termination of status, the email address is deleted, and the remaining data are anonymized in accordance with Art. 34 of the Rulebook and Art. 11 of the Privacy Policy. |
| **Protection measures** | Password hashing, TLS encryption in transit (min. version 1.2), encryption at rest at the hosting infrastructure level, access control based on the principle of minimum necessity, multi-factor authentication for administrative access. |

**Processing activity no. 2 — Proof of reality (user verification)**

| **Purpose of processing** | Ensuring the principle of one person — one user and the integrity of the common-good ledger. |
| --- | --- |
| **Categories of data subjects** | Platform users undergoing the verification procedure. |
| **Categories of data** | Verification graph (record of who verified whom, in pseudonymous form), reality index (numerical value of the degree of verification), verification records (verifier's pseudonym, verification sequence number, verified person's pseudonym, timestamp, supervisor's pseudonym). |
| **Legal basis** | Execution of a contractual relationship (Art. 12 para. 1 item 2 LPDP). |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | While the user account remains active. Upon termination of status, connections in the verification graph are anonymized; records remaining under an identifier that does not enable identification cease to be personal data within the meaning of the LPDP. |
| **Protection measures** | Pseudonymization, separation of identification from accounting data, TLS encryption, encryption at rest, access control. |
| **Note** | The verification graph, even in pseudonymous form, constitutes the processing of personal data within the meaning of the LPDP. |

**Processing activity no. 3 — Voluntarily entered data**

| **Purpose of processing** | Facilitating the use of the platform and communication among users, at the user's discretion. |
| --- | --- |
| **Categories of data subjects** | Platform users who voluntarily enter additional data. |
| **Categories of data** | Name and surname, telephone number, address, other contact data, profile picture (avatar) and description, images attached to listings. |
| **Legal basis** | User's consent (Art. 12 para. 1 item 1 LPDP). Consent is voluntary and may be withdrawn at any time. Entering these data is not a condition for proof of reality or for access to system functions. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. Images (avatar and listing images) are stored with the processor Cloudflare, Inc. (Cloudflare R2 service, USA); only the internet address (URL) of the image is written to the database. Data that the user chooses to make visible (name, surname, telephone) are accessible to verified Platform users. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | Until withdrawal of consent or deletion by the user. Upon termination of the user's status, deleted in their entirety. |
| **Protection measures** | TLS encryption, encryption at rest, access control, possibility of deletion by the user at any time. |

**Processing activity no. 4 — Activity records (POEN transactions)**

| **Purpose of processing** | Maintaining the common-good ledger and the functioning of the accounting framework of the system. |
| --- | --- |
| **Categories of data subjects** | Platform users participating in exchanges and contributions. |
| **Categories of data** | Amount of the POEN ledger update, time of update, pseudonyms of parties to the recorded exchange. |
| **Legal basis** | Execution of a contractual relationship (Art. 12 para. 1 item 2 LPDP) while the user participates in the system. After termination of status and anonymization, records cease to be personal data. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. The ledger is public in pseudonymous form — verified users may view amounts, timestamps, and the pseudonyms of parties. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | 10 years from creation, in accordance with tax and accounting regulations, in pseudonymous form. Upon termination of the user's status, identification data are deleted, and the numerical history is retained under an identifier that does not enable identification. |
| **Protection measures** | Pseudonymization, ledger integrity (zero-sum invariant with automatic verification, atomic recording and timestamping of records), TLS encryption, encryption at rest at the hosting infrastructure level. |

**Processing activity no. 5 — Donations by natural persons**

| **Purpose of processing** | Fulfilment of the statutory obligation of financial reporting. |
| --- | --- |
| **Categories of data subjects** | Donors — natural persons donating funds to the Foundation. |
| **Categories of data** | Donation amount, donation date, donor identity (provided through the banking system — the Foundation receives donations from verified bank accounts). |
| **Legal basis** | Statutory obligation (Art. 12 para. 1 item 3 LPDP). |
| **Recipients / processors** | Foundation (stores data directly), banking institution, auditor (if applicable). |
| **Transfer to a third country** | No — banking documentation is stored within the Foundation. |
| **Retention period** | 10 years from creation, in accordance with the Law on Accounting and tax regulations. The user does not have the right to request deletion before the expiry of the statutory retention period. |
| **Protection measures** | Physical and logical protection of documentation, access control, separate storage from platform data. |

**Processing activity no. 6 — Sponsorship by legal entities**

| **Purpose of processing** | Recording of sponsorship and fulfilment of the financial reporting obligation. |
| --- | --- |
| **Categories of data subjects** | Contact persons of legal entity sponsors, users in whose records the contribution is entered. |
| **Categories of data** | Data on the legal entity's contribution, link between the legal entity sponsor and the user in whose record the contribution is entered. |
| **Legal basis** | Legitimate interest of the Foundation (Art. 12 para. 1 item 6 LPDP) and statutory obligation of maintaining financial records. |
| **Recipients / processors** | Foundation (stores data directly), auditor (if applicable). |
| **Transfer to a third country** | No. |
| **Retention period** | 10 years, in accordance with the Law on Accounting. |
| **Protection measures** | Access control, physical and logical protection. |
| **Note** | This is the only point in the system where the Foundation stores data linking the external and internal ledger. Proportionality test of the legitimate interest: the processing is necessary for the recording of sponsorship and lawful financial reporting; the Foundation's interests prevail because the data are limited to the minimum necessary for recording, and the user is informed in advance. |

**Processing activity no. 7 — Technical data and logs**

| **Purpose of processing** | Platform security, prevention of misuse, detection of unauthorized access, technical support. |
| --- | --- |
| **Categories of data subjects** | All users and visitors of the platform. |
| **Categories of data** | IP address, device and browser data, time and date of access, access log (who accessed, when, which data, from which device). |
| **Legal basis** | Legitimate interest (Art. 12 para. 1 item 6 LPDP). |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | 12 months. |
| **Protection measures** | Administrative actions and disclosure of contact details are logged in the audit trail, access control restricted to the data protection officer and security administrators, TLS encryption. |

**Processing activity no. 8 — Automated decision-making**

| **Purpose of processing** | Issuance of POENs, calculation of the accounting coefficient, automatic recording in social programs (upon activation of Module 3). |
| --- | --- |
| **Categories of data subjects** | Platform users. |
| **Categories of data** | Data on contributions, accounting framework parameters, data on membership in qualifying groups (upon activation of Module 3). |
| **Legal basis** | Execution of a contractual relationship (Art. 12 para. 1 item 2 LPDP); for social programs — explicit consent (Art. 17 para. 2 item 1 LPDP). |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | As for processing activity no. 4 (10 years). |
| **Protection measures** | Deterministically defined public formula for the accounting coefficient, the user's right to an explanation of the logic, human review, and objection (Art. 38 LPDP). |
| **Note** | These automated processing activities may have a legal or significant effect on a person within the meaning of Art. 38 LPDP. |

**Processing activity no. 9 — Data published on the guarantee board**

| **Purpose of processing** | Enabling the establishment of contact between an unverified user and potential verifiers for the purpose of conducting verification within the meaning of the Rulebook on Proof of Reality. |
| --- | --- |
| **Categories of data subjects** | Unverified Platform users who publish a vouching request. |
| **Categories of data** | Presentation text (where the user is from and the reason for joining the system) and contact details of the user's own choice (name and surname, telephone number, email address, or an identifier on another communication channel). |
| **Legal basis** | User's consent (Art. 12 para. 1 item 1 LPDP), given separately for each publication, with an explicit warning about the circle of persons who will see the text and contact details respectively. Consent is voluntary and may be withdrawn at any time by withdrawing the request, without consequences for the user's status in the system. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. The presentation text is accessible to all registered Platform users. Contact details are accessible exclusively to verified users and are displayed only upon explicit disclosure, which is logged in the access log. Data are not accessible to non-registered persons and are not indexed by search engines. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | For as long as the request remains active. An active request that has not been concluded by a completed verification, withdrawal, or removal automatically ceases to be active upon the expiry of 30 days from publication. Once the request ceases to be active, the presentation text and contact details are deleted from the board display; a pseudonymous record of the existence and outcome of the request (published, withdrawn, expired, removed, completed by verification) is retained as part of the vouching chain ledger. Upon termination of the user's status, data are deleted in their entirety. |
| **Protection measures** | Separation of visibility (presentation text visible to all registered users, contact details only to verified users with disclosure logging), automatic expiry of request activity after 30 days, restriction to one active request per user, TLS encryption, access control. |
| **Note** | The user may have only one active request on the board. Withdrawal of consent is carried out by withdrawing the request in the user interface and does not require submission of a written request. |

**Processing activity no. 10 — Special categories of data (Module 3 — Social Programs)**

| **Status** | ACTIVE — Module 3 is activated in accordance with Art. 57 of the Rulebook and the Rulebook on Support Programmes (v4.0.0); activation is accompanied by an updated DPIA (v4.0.0). |
| --- | --- |
| **Purpose of processing** | Automatic recording of contributions in POENs for users belonging to qualifying groups, with confirmation of fulfilment of conditions by the applicant's verifiers (protecting the integrity of programs from false applications). |
| **Categories of data subjects** | Users belonging to qualifying groups (parents, elderly persons, persons with disabilities, students) and their verifiers. |
| **Categories of data** | Parental status, age, disability (disability decision of the competent authority — not medical documentation or diagnosis), student status or belonging to another qualifying group, date of status verification. The Foundation does not retain copies of submitted documentation — only the minimum record of group membership remains in the system. In the confirmation procedure, the verifiers are informed of the fact that the applicant (pseudonym) has applied for a specific program — which may indicate membership in a special category — but not of the content of the entered data. |
| **Legal basis** | Explicit consent of the user (Art. 17 para. 2 item 1 LPDP), given separately for the application and for requesting confirmation from verifiers. Consent may be withdrawn at any time, with the consequence of ceasing the procedure and automatic recording. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. The person at the Foundation processing the application has access to the entered data. The applicant's verifiers receive exclusively the request for confirmation (program name and the pseudonym of the applicant whom they personally know) — without access to the entered data. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | Until withdrawal of consent by the user. Records of verifiers' confirmations (confirmed/rejected, reason for rejection) are retained with the application while the status lasts. |
| **Protection measures** | Data are maintained pseudonymously and accessible only to the person at the Foundation processing the application; verifiers and other users do not have access to the entered data. Minimization: only dates are recorded (children's dates of birth without names, date of disability decision without number/diagnosis). The application requires a full reality index (100%) and explicit consent. Hard block: the application is not approved until all verifiers confirm; a refusal requires a reason. Notification of verifiers exclusively within the platform (in-app), without external channels. Minimization: the content of the application is not displayed to the verifier. |

**Processing activity no. 11 — Data of minors (Module 4 — Children)**

| **Status** | INACTIVE — activated upon the launch of Module 4 in accordance with Art. 58 of the Rulebook. Activation requires a prior DPIA update and the adoption of a special rulebook. |
| --- | --- |
| **Purpose of processing** | Enabling minor users to participate in the system under a special limitation regime. |
| **Categories of data subjects** | Minor Platform users. |
| **Categories of data** | Data of minor users, consent of the parent or legal guardian, restrictions applicable to the minor user. |
| **Legal basis** | Consent of the parent or legal guardian (Art. 16 LPDP), with additional restrictions for persons under fifteen years of age. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | To be established by a special rulebook with enhanced requirements. |
| **Protection measures** | Separate storage of consent, enhanced access control, enhanced protection measures in accordance with Art. 16 LPDP. |

**Processing activity no. 12 — Integrity monitoring of the verification system (prevention of misuse)**

| **Purpose of processing** | Protection of the integrity of proof of reality and the common-good ledger — detection of patterns indicating misuse (false or "farmed" verifications, account multiplication, POEN pooling) in order to preserve the authenticity of verifications, the ledger, and governance. |
| --- | --- |
| **Categories of data subjects** | Platform users (through the verification graph and contribution ledger). |
| **Categories of data** | No collection of new data. Existing pseudonymous data are processed: verification graph (who verified whom, supervision, timestamps), account creation time, POEN ledger metadata (type, amount, time), activity indicators (existence of messages/listings/exchanges — yes/no, without content), user type, reality index. Derived record: risk finding (pseudonym or group of pseudonyms, labels of violated rules, numerical score, status). |
| **Legal basis** | Legitimate interest of the Foundation (Art. 12 para. 1 item 6 LPDP) — protecting the system from misuse and preserving the integrity of the ledger and governance. |
| **Recipients / processors** | Exclusively superadministrators (Management Board of the Foundation). Infrastructure: Vercel Inc. (hosting) and Neon Inc. (database), USA. The alert channel (Telegram, email/Resend) receives only aggregate numbers, without personal data. |
| **Transfer to a third country** | Yes — infrastructure processors (Vercel, Neon) and the alert channel (Telegram, Resend) are located in the USA; transfer with safeguards (Art. 9 of the Privacy Policy). |
| **Retention period** | Open finding — until resolved by human review. Resolved or dismissed findings — at most 12 months (as technical logs), then deleted. Upon termination of a user's status, findings linked to them are deleted or anonymized. |
| **Protection measures** | Access restricted to superadministrators; all actions on findings are recorded in the audit trail; pseudonymization; no collection of new data. **The system does not make automated decisions within the meaning of Art. 38 LPDP — it only flags accounts/groups, and the measure is taken by an authorised person.** Rules prioritise the absence of genuine activity ("hollowness"), not connection density, to avoid incorrect treatment of tight real-world communities. Ability to dismiss findings and right to object (Art. 37 LPDP). |
| **Note — legitimate interest proportionality test** | The processing is necessary to prevent misuse that would devalue the ledger and governance; it is proportionate because no new data are introduced, the processing is pseudonymous, no automated decisions are made, and it is subject to human review and the right to object. The interest of the Foundation and honest users prevails over the minimal intrusion into the rights of data subjects. |

**Processing activity no. 13 — Publication of the donor's name in the donation list**

| **Purpose of processing** | Transparency and public recognition of public donations. |
| --- | --- |
| **Categories of data subjects** | Natural-person donors who have chosen a public donation. |
| **Categories of data** | First and last name, donation amount and date, pseudonym. |
| **Legal basis** | Consent (Art. 12 para. 1 item 1 LPDP), given by choosing a public donation for the purpose of recording POEN. For anonymous donations the name is not published and no POEN is recorded. |
| **Recipients / processors** | Vercel Inc. (hosting) and Neon Inc. (database), United States, on the basis of a processing agreement. Verified platform users (donation list). |
| **Transfer to a third country** | Yes — infrastructure processors are located in the USA (see Art. 9 of the Privacy Policy). |
| **Retention period** | As for donation data — 10 years, in accordance with tax and accounting regulations. |
| **Protection measures** | The choice is voluntary and made per individual donation; a clear warning before a public donation; the anonymous option without POEN as an alternative; the rule applies only prospectively; TLS encryption, access control. |
| **Note** | Publicly linking the name to a donation makes it possible to connect the donor's pseudonymous record with their identity; the disclosure is voluntary and constitutes a condition for the recording of POEN on account of the donation. |

**FINAL PROVISIONS**

These Records are updated upon any change in processing activities, activation of new system modules, or change in technical and organizational protection measures. Updating the Records is an obligation of the controller in accordance with Art. 47 LPDP.

The Records are available to the Commissioner for Information of Public Importance and Personal Data Protection upon request.

In Sombor, on 06.06.2026.

**FOR THE MANAGEMENT BOARD**

President of the Management Board

_________________________

Jelena Stijepović
