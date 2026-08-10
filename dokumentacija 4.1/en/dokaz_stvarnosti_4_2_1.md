> **Unofficial translation.** This English version is provided for convenience only. The legally authoritative text is the Serbian original; in case of any discrepancy, the Serbian version prevails.

# Rulebook on Proof of Reality

*This Rulebook governs the operational mechanics of proof of reality — the user verification model of the KOLO system based on personal acquaintance. It is adopted on the basis of Art. 32 paragraph 4 and Art. 15 point 2 of the KOLO System Rulebook.*

## I — General Provisions

### Article 1

*Subject matter*

This Rulebook governs: the reality index, the chain of confirmations, the verification record, the POEN ledger entry for verification, verification capacity, supervision and the supervision outcome, the supervision case, the anti-circular rule, the initial mechanism, the consequences of loss of status on verifications, the procedure for establishing a false verification, and restitution for POEN records withdrawn from the network.

Terms not defined in this Rulebook shall have the meaning established in the KOLO System Rulebook.

### Article 2

*Relationship with the KOLO System Rulebook*

This Rulebook elaborates the provisions of Chapter V of the KOLO System Rulebook. In the event of any inconsistency, the provisions of the KOLO System Rulebook shall prevail.

## II — Reality Index

### Article 3

*Concept and calculation*

The reality index is a numerical value expressing the degree to which a user has been verified within the chain of confirmations. Each verification increases the verified user's index by 10 percentage points. The range of the index is from 0% to 100%.

A user whose index reaches 100% cannot be further verified. Verifications beyond 100% are not recorded.

### Article 4

*Functional effect of the index*

For regular verified users the reality index has two functions: it conditions access to system functions and determines verification capacity.

A user with an index of at least 10% has full access to all platform functions — exchange, contribution recording, participation in Circles, Cooperatives, and social programmes, and confirming the reality of other users. A verified user whose index is below 10% retains the status of a verified user but does not have access to platform functions until their index reaches 10% again.

For initial users and ZRNO Holders the reality index is a record without functional effect — capacity and access derive from their status, not from the index.

## III — Chain of Confirmations

### Article 5

*Verification mechanism*

Verification is carried out within the chain of confirmations: a verified user confirms the reality of a new user on the basis of personal acquaintance. The verifier confirms three things: reality (the user exists as a natural person), uniqueness (they have no other account in the system), and continuity (the same person who accesses the system).

Verification is an act of personal acquaintance, not of document verification. The verifier does not collect or submit the personal documents of the person being verified.

Verification is based on direct personal acquaintance sufficient for the verifier to confirm, on their own responsibility, the reality, uniqueness, and continuity of the verified user. This Rulebook does not prescribe the manner of acquiring such acquaintance nor require physical presence at the moment of verification; the verifier alone assesses whether they know the user well well enough to confirm their reality.

The platform provides a technical mechanism for consent and account binding: the user seeking verification generates a one-time code by which they consent to the verification and bind their account to that act, and a verifier who knows them carries out the verification using that code. This mechanism does not collect the personal data of the person being verified and does not constitute proof of presence, but rather confirmation of the verified person's consent and account identity.

The user who is verified is notified of the completed verification and may report it if they do not know the verifier.

The verifier is responsible for the truthfulness of the verification. A verification by which the reality of a person who does not exist as a natural person has been confirmed, who is not unique, or whose continuity is not ensured, is a false verification and entails the consequences set out in Chapter VIII of this Rulebook.

### Article 6

*Verification record*

Every verification is recorded in a verification record containing five data items:

— the identifier of the verifier (pseudonym);

— the ordinal number of the verifier's verification — which verification in sequence this is for that verifier;

— the identifier of the verified user (pseudonym);

— the timestamp of the verification;

— the identifier of the supervisor (pseudonym), or an empty field if the verification is not subject to supervision.

A verification subject to supervision is supplemented, once a supervision outcome is recorded, with supervision data: the supervision outcome and, alongside the outcomes "needs review" and "disputed", the subject of suspicion and the reason code under Article 11 of this Rulebook. Supervision data are kept for each supervisor who recorded an outcome.

Supervision data are not public. They form part of the verification graph and the visibility rules of Article 67 of the Rulebook on the KOLO System apply to them; they are shown neither to the verifier nor to the verified user.

The verification record forms part of the record of the common good. Verification records constitute the verification graph within the meaning of Article 32 of the Rulebook on the KOLO System.

### Article 7

*POEN ledger entry for verification*

Upon the recording of a verification record, the Protocol automatically enters new POEN records: 1,000 POEN to the verifier and 1,000 POEN to the verified user.

If the verification is subject to supervision, the Protocol enters 500 POEN to the first supervisor who records a supervision outcome (Article 11), regardless of which outcome was recorded. The entry occurs at the moment the outcome is recorded, not at the moment of verification; until then no supervisor has been designated.

A supervisor to whom the record is forwarded following the outcome "needs review" receives no POEN. At most one entry of 500 POEN is recorded per verification.

Where the verification is not subject to supervision, the total entry amounts to 2,000 POEN. Where it is subject to supervision, the total entry upon the recording of the first supervision outcome amounts to 2,500 POEN.

What is recorded is the supervisor's work, not their agreement with the verification. A supervisor who finds that something is wrong performs the same work as one who finds nothing objectionable, so the entry is the same; tying the entry to an affirmative outcome would encourage looking the other way.

The recording of POEN for verification is an automatic act of the Protocol within the meaning of Article 15 item 2 of the Rulebook on the KOLO System.

## IV — Verification Capacity and Supervision

### Article 8

*Verification capacity of regular users*

The verification capacity of a regular verified user equals the reality index divided by 10, expressed as a whole number rounded down. A user with an index of 10% has a capacity of 1; a user with an index of 30% has a capacity of 3; a user with an index of 100% has a capacity of 10.

Each verification performed consumes one capacity slot. A user who has used all their slots may not perform new verifications until a supervisor replenishes their capacity.

### Article 9

*Capacity of initial users and ZRNO Holders*

The capacity of initial users and ZRNO Holders is not consumed when they perform verifications. They may perform verifications without capacity restriction.

### Article 10

*Supervision*

Verifications performed by regular verified users are subject to supervision. Verifications performed by initial users and ZRNO holders are not subject to supervision.

A supervisor is every ZRNO holder. The supervisory function follows automatically from status, without appointment, and does not depend on the phase of the system.

The supervisor examines the legitimacy of the verification performed and records the supervision outcome in accordance with Article 11 of this Rulebook. The supervisor receives 500 POEN in accordance with Article 7 of this Rulebook.

Supervision may not be performed by a user who took part in the supervised verification — neither as verifier nor as verified user. The same supervisor may not record an outcome twice on the same verification record.

### Article 11

*Supervision procedure and supervision outcome*

Supervision is performed after verification. A verification takes effect upon the recording of the verification record. The supervisor subsequently examines the verification and records the supervision outcome in the verification record.

The supervision outcome is one of three:

— **sound** — the supervisor finds nothing objectionable; the verifier's spent capacity slot is restored and the verifier may continue to verify;

— **needs review** — something is unclear to the supervisor and they ask that another supervisor look at the record; the capacity slot is not restored and the record remains available to the other supervisors. This outcome is not an assertion that the verification is false, but an invitation for someone else to look;

— **disputed** — the supervisor considers that the verification is untrue; the capacity slot is not restored.

Alongside the outcomes "needs review" and "disputed", the supervisor must enter the subject of suspicion — the verifier, the verified user, both users, or a part of the network — and a reason code from the list in paragraph 4 of this Article. The outcome "sound" requires no statement of reasons.

The reason codes are:

— *they do not know each other* — there are grounds to suspect that the verifier and the verified user are not personally acquainted;

— *account shows no signs of reality* — the verified user's account shows no signs that a real person stands behind it;

— *duplicate account* — there are grounds to suspect that the verified user already has an account in the system;

— *pattern of verifications* — the distribution or frequency of verifications indicates coordinated conduct;

— *report by the verified user* — the verified user has reported that they do not know the verifier (Article 5 paragraph 5);

— *other* — a reason not covered by the preceding items, with a brief description.

Until the outcome "sound" is recorded, the verifier's capacity slot remains spent. No deadline is prescribed for recording a supervision outcome.

Recording a supervision outcome does not alter the effect of the verification. A verification takes effect upon the recording of the verification record and is annulled solely under the procedure in Chapter VIII of this Rulebook.

### Article 11a

*Supervision case*

Recording the outcome "needs review" or "disputed" automatically forms a supervision case. The case contains the designation of the verification record, the recorded outcomes, the subject of suspicion and the reason code.

The supervision case is available to the Management Board of the Foundation. It is not available to other supervisors, to the verifier, to the verified user, or to the public.

The supervision case is a record, not a body. Forming a case does not in itself produce legal effect towards a user and does not mean that the verification is false. A false verification is established solely by the body referred to in Article 18, under the procedure in Chapter VIII.

A case is closed by the establishment of a false verification or by a finding that there are no grounds for the suspicion. A case closed by a finding of no grounds is deleted upon the expiry of 90 days from closure. A suspicion that was not confirmed does not remain as a permanent record about a user.

If no other supervisor responds following the outcome "needs review", the case remains open. This produces no effect towards a user, but the verifier's capacity slot remains spent until the outcome "sound" is recorded.

## V — Anti-Circular Rule

### Article 12

*Prohibited zone of the verifier*

As a rule, a user has multiple verifiers — up to ten, in proportion to their reality index. A prohibited zone is determined for each of the user's verifiers individually, and their union constitutes the user's total prohibited zone.

A verifier may not verify:

— any of their own verifiers (reciprocal prohibition);

— anyone in the ancestral chain of any of their verifiers — the sequence which, starting from that verifier, consists of that verifier's verifiers, their verifiers, and so on upward, to the roots of the verification graph;

— anyone in the subtree of any of their verifiers — the set consisting of all users verified by that verifier, users verified by those users, and so on downward; this set also includes the user's siblings (other users verified by the same verifier) and all of their descendants;

— anyone in their own descendant chain — users they have themselves verified, users verified by those users, and so on downward.

A verifier may only verify users who are not located in any of the above zones — users from independent branches of the verification graph.

The prohibited zone is determined symmetrically. By performing a verification, the verifier takes into their own prohibited zone the verified user and that user's entire prohibited zone, including its later expansions. No one may verify a user who is located in their prohibited zone, nor a user in whose prohibited zone they themselves are located. Expansions of the zone arising from verifications performed by other users do not carry over to initial users; the prohibited zone of an initial user expands solely through verifications they themselves perform. The prohibited zone is not a separate record but is determined at every moment from the verifications in force; when a verification is annulled, the restrictions that arose from it cease as well.

By way of exception from the preceding paragraphs of this Article, users who were directly verified by the same initial user may verify one another (the first-generation exception). The exception does not apply between users who, at the moment of verification, are already connected by an ascending or descending line of the verification graph — including the reciprocal prohibition — nor does it extend to their further descendants. A verification performed under this exception produces regular effects in all other respects: the symmetric takeover of the zone under the preceding paragraph, as well as the transitional limit under Article 22, apply without modification.

### Article 13

*Purpose of the anti-circular rule*

The anti-circular rule ensures that the network of trust grows laterally, through independent branches. By excluding the entire subtree and the entire ancestral chain of each verifier, it ensures that no user can accumulate verifications within the same part of the network from which they themselves originated. A user wishing to reach an index of 100% must be known to users from multiple different, mutually independent parts of the network. This is a structural barrier against coordinated manipulation: a fictitious person cannot be known across sufficiently different social circles to collect ten independent verifications. The symmetry of the zone ensures that every verification within the same part of the network reduces the possibility of further verifications in that part, so that the yield of repeated verifications within the same social circle declines.

The first-generation exception (Article 12, paragraph 5) takes into account the particular position of users directly verified by the same initial user: in the network's initial period there are as yet no independent branches in which such users could be known, so the full application of the rule would permanently constrain them merely for having joined first. Since every verification performed under the exception creates a line that excludes further verifications between the connected users, the yield of repeated verifications declines within this exception as well.

## VI — Initial Mechanism

### Article 14

*Initial users*

The initial users of the system are the persons forming the founding core of the Foundation: persons entered in the register of the Serbian Business Registers Agency as the founder or as members of the Foundation's bodies, and persons designated by a decision of the Management Board (UO) at the establishment of the system, with their identity publicly disclosed on the platform.

The reality index of initial users is 100% from the establishment of the account and does not derive from the chain of confirmations. The reality of persons from the SBRA register derives from the public record; the reality of persons designated by a decision of the Management Board is confirmed directly by the Management Board, with their identity publicly disclosed.

Initial users cannot be verified through the chain of confirmations.

### Article 15

*Rights of initial users*

Initial users have rights identical to those of ZRNO Holders with regard to verification: capacity is not consumed when they verify and their verifications are not subject to supervision.

## VII — Consequences of Loss of Status on Verifications

### Article 16

*Loss of verifier status*

When a user whose status has ceased (withdrawal, exclusion, death) was the verifier of other users, the users whom they verified lose 10 percentage points of their reality index.

The loss of index does not propagate further — users verified by the affected users suffer no effect.

### Article 17

*Index falling to zero*

A user whose index falls to 0% as a result of the loss of a verifier's status retains the status of a verified user. The user loses access to platform functions but retains their account and may be re-verified through the chain of confirmations.

A user who is a ZRNO Holder does not suffer the functional effect of an index drop — access and capacity derive from ZRNO Holder status, not from the index.

## VIII — False Verification and Restitution

### Article 18

*Establishing a false verification*

A false verification is a verification by which the verifier confirmed the reality of a user who does not exist as a natural person, who is not unique (has another account in the system), or whose continuity is not ensured.

A false verification is established by the Management Board of the Foundation in Phase 1, or by the Upper Circle in Phase 2.

Proceedings are initiated on a supervision case under Article 11a, on a report by the verified user under Article 5 paragraph 5, or on knowledge obtained in another way. Establishment is made separately for each verification.

### Article 19

*Consequences of an established false verification*

Upon the establishment of a false verification, that verification is annulled. The reality index of the verified user is reduced by 10 percentage points.

The establishment of one false verification triggers a review of the verifier's other verifications, but does not in itself annul them. Each of them is annulled solely if it is itself established as false under Article 18.

The verification of a user who exists as a natural person, who is unique and whose continuity is ensured remains in force even where the same verifier performed a false verification in another case. Truthfulness is assessed by reference to the user to whom the verification relates, not by reference to the verifier.

Annulling all of one verifier's verifications would strip real people of their status because of an act they did not commit and could not influence. A measure that strikes the innocent is not protection of the network but damage to it.

### Article 20

*Cascade of annulment*

The annulment of a verification is carried further solely through accounts for which it has been established that no real person stands behind them, or that they are not unique.

An account for which this has been established can neither personally know anyone nor be known to anyone as a real person. The establishment therefore annuls all verifications that the account touches — both those it performed and those it received — without separate establishment under Article 18 for each of them.

The cascade stops at the first user for whom it has not been established that they are non-existent or non-unique: for that user, only the verification received from such an account is annulled, while the verifications they themselves performed remain in force.

A network of fabricated accounts is brought down by an establishment being made for each of its accounts. With each establishment all the ties of that account fall, so the order of establishment does not affect the outcome.

A fall of the index to 0% does not in itself trigger a cascade. A user whose index falls to 0% retains the status of a verified user and the position under Article 17 of this Rulebook.

The cascade follows non-existence, not the verifier. A network of fabricated accounts falls in its entirety, because none of them knows anyone; a real person who was honestly introduced does not lose their status because the one who introduced them lied elsewhere.

### Article 20a

*Scope of the annulment of POEN records*

The annulment of a verification annuls solely the POEN records that arose from that verification through the channel in Article 7 of this Rulebook: 1,000 POEN to the verifier, 1,000 POEN to the verified user, and 500 POEN to the supervisor if the recorded supervision outcome was "sound".

POEN recorded to a supervisor who recorded the outcome "needs review" or "disputed" on that verification are not annulled. A supervisor who reported the suspicion and proved to be right does not bear the consequence of another's act.

POEN records arising through the other recording channels under Article 15 of the Rulebook on the KOLO System — through exchange, operational contribution, financial contribution, sponsorship, growth of collective forms, founding contribution, or contribution to platform content — are not annulled.

Article 34 of the Rulebook on the KOLO System does not apply to the annulment of POEN records under this Article. What is annulled is what arose from the verification, not the user's entire ledger; a financial contribution is non-returnable under Article 73 of the Rulebook on the KOLO System and cannot be annulled indirectly.

Every annulment of a POEN record is accompanied by a counter-entry of the Protocol in the same amount. The zero-sum invariant under Article 14 of the Rulebook on the KOLO System remains preserved.

### Article 20b

*Restitution*

If the user whose POEN records are being annulled does not hold enough recorded POEN to cover the annulment, their record passes into a negative value for the uncovered part. That negative value is restitution.

The uncovered part of an annulment affecting the verified user and the supervisor is transferred to the verifier from that verification, and their record is reduced by the same amount. The uncovered part of an annulment affecting the verifier themselves remains on their own record.

A negative POEN record may arise solely with a verifier. The record of the verified user and the record of the supervisor may fall to zero at most.

The sum of all restitutions corresponds to the value of goods and services actually withdrawn from the network on the basis of false verifications. Restitution is therefore not a penalty but a settlement of that value, and is not subject to an upper limit.

Restitution is not a debt. The Foundation holds no claim against the user on the basis of restitution, may not collect, assign or enforce it, and does not present it as an asset. The effect of restitution exists solely within the system.

Restitution does not prevent a user from exchanging goods and services. POEN that reach the user first fill the restitution; the user disposes of their POEN record only once the restitution has been settled. Restitution is worked off by giving to the network.

Restitution does not mean exclusion. Suspension and exclusion are separate measures imposed under a separate procedure established by the Terms of Use; restitution neither replaces, implies nor precludes them.

Restitution persists upon termination of the user's status. By way of exception to Article 34 of the Rulebook on the KOLO System, a negative record is not annulled upon termination of status and is not transferred to the Protocol; otherwise, leaving the system would erase the restitution and the burden would fall on the remaining users.

A negative POEN record under this Article is the sole exception to the prohibition in Article 14 paragraph 3 of the Rulebook on the KOLO System.

### Article 20c

*Position of a user whose verification is annulled through no fault of their own*

For a user whose verification has been annulled, and for whom it has not been established that they are non-existent or non-unique, the reality index is reduced by 10 percentage points, the POEN records under Article 7 arising from that verification are annulled, and a place in the chain of confirmations is freed.

The annulment of such a user's POEN records is limited by their balance — the record may fall to zero at most. The uncovered part passes to the verifier as restitution under Article 20b and does not burden the user. Whoever is at no fault does not remain in a negative value.

Such a user may be verified again under the general rules of this Rulebook. Upon re-verification their index increases by 10 percentage points and the POEN under Article 7 are recorded for them, so that on this ground they suffer no lasting loss.

The prohibited zone of such a user is determined from the verifications in force (Article 12 paragraph 4). Restrictions that arose from the annulled verification cease, so that user may also be verified by users from the part of the network that the annulled verification had closed to them.

### Article 21

*Status of a false verifier*

A false verifier is subject to measures in accordance with the rules on termination and suspension of status established by the Terms of Use.

Restitution under Article 20b arises by the annulment itself and is not a measure under paragraph 1 of this Article. The imposition or non-imposition of suspension or exclusion does not affect restitution, nor does restitution replace those measures.

## IX — Transitional and Final Provisions

### Article 22

*Transitional limit on the number of verifications*

Until total circulation reaches 100,000 POEN, a user may receive at most one verification through the chain of confirmations. Circulation is the total number of POEN recorded in the system — the absolute value of the Protocol's counter-entry.

The limit under paragraph 1 is applied according to the state of circulation at the moment of verification. Verifications received while the limit is in force remain valid; once circulation reaches 100,000 POEN, the reality index grows under the general rules of this Rulebook, including the prohibited zone under Chapter V.

The purpose of the limit is to ensure that, in the initial period, the network grows solely through the accession of new users, rather than through repeated verifications within the same part of the network.

### Article 23

*Amendments to the Rulebook*

This Rulebook is adopted and amended by the Management Board (UO) of the KOLO Foundation, under the procedure established in the KOLO System Rulebook.

### Article 24

*Entry into force*

This Rulebook enters into force on the date of its adoption by the Management Board (UO) of the KOLO Foundation.
