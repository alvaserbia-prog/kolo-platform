> **Unofficial translation.** This English version is provided for convenience only. The legally authoritative text is the Serbian original; in case of any discrepancy, the Serbian version prevails.

# Rulebook on Proof of Reality

*Version 3.9.0*

*This Rulebook governs the operational mechanics of proof of reality — the user verification model of the KOLO system based on personal acquaintance. It is adopted on the basis of Art. 32 paragraph 4 and Art. 15 point 2 of the KOLO System Rulebook.*

## I — General Provisions

### Article 1

*Subject matter*

This Rulebook governs: the reality index, the vouching chain, the verification record, the POEN ledger entry for verification, verification capacity and supervision, the anti-circular rule, the initial mechanism, the consequences of loss of status on verifications, and the procedure for establishing a false verification.

Terms not defined in this Rulebook shall have the meaning established in the KOLO System Rulebook.

### Article 2

*Relationship with the KOLO System Rulebook*

This Rulebook elaborates the provisions of Chapter V of the KOLO System Rulebook. In the event of any inconsistency, the provisions of the KOLO System Rulebook shall prevail.

## II — Reality Index

### Article 3

*Concept and calculation*

The reality index is a numerical value expressing the degree to which a user has been verified within the vouching chain. Each verification increases the verified user's index by 10 percentage points. The range of the index is from 0% to 100%.

A user whose index reaches 100% cannot be further verified. Verifications beyond 100% are not recorded.

### Article 4

*Functional effect of the index*

For regular verified users the reality index has two functions: it conditions access to system functions and determines verification capacity.

A user with an index of at least 10% has full access to all platform functions — exchange, contribution recording, participation in Circles, Cooperatives, and social programmes, and confirming the reality of other users. A verified user whose index is below 10% retains the status of a verified user but does not have access to platform functions until their index reaches 10% again.

For initial users and ZRNO Holders the reality index is a record without functional effect — capacity and access derive from their status, not from the index.

## III — Vouching Chain

### Article 5

*Verification mechanism*

Verification is carried out within the vouching chain: a verified user confirms the reality of a new user on the basis of personal acquaintance. The verifier confirms three things: reality (the user exists as a natural person), uniqueness (they have no other account in the system), and continuity (the same person who accesses the system).

Verification is an act of personal acquaintance, not of document verification. The verifier does not collect or submit the personal documents of the person being verified.

Verification is based on direct personal acquaintance sufficient for the verifier to vouch on their own responsibility for the reality, uniqueness, and continuity of the verified user. This Rulebook does not prescribe the manner of acquiring such acquaintance nor require physical presence at the moment of verification; the verifier alone assesses whether they know the user well enough to vouch for them.

The platform provides a technical mechanism for consent and account binding: the user being verified generates a one-time code by which they consent to the verification and bind their account to that act. This mechanism does not collect the personal data of the person being verified and does not constitute proof of presence, but rather confirmation of the verified person's consent and account identity.

The verifier is responsible for the truthfulness of the verification. A verification by which the reality of a person who does not exist as a natural person has been confirmed, who is not unique, or whose continuity is not ensured, is a false verification and entails the consequences set out in Chapter VIII of this Rulebook.

### Article 6

*Verification record*

Each verification is recorded by a verification record containing five data points:

— identifier of the verifier (pseudonym);

— serial number of the verifier's verification — indicating which verification, in sequence, the verifier has performed;

— identifier of the verified user (pseudonym);

— timestamp of the verification;

— identifier of the supervisor (pseudonym), or an empty field if the verification is not subject to supervision.

The verification record is part of the common-good ledger. Verification records constitute the verification graph within the meaning of Art. 32 of the KOLO System Rulebook.

### Article 7

*POEN ledger entry for verification*

Upon recording of the verification record, the Protocol automatically enters new POEN records:

— to the verifier: 1,000 POEN;

— to the verified user: 1,000 POEN;

— to the supervisor: 500 POEN, if the verification is subject to supervision.

When a verification is not subject to supervision, the total ledger entry is 2,000 POEN. When a verification is subject to supervision, the total ledger entry is 2,500 POEN.

The recording of POEN for verification is an automatic act of the Protocol within the meaning of Art. 15 point 2 of the KOLO System Rulebook.

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

Verifications performed by regular verified users are subject to supervision. Verifications performed by initial users and ZRNO Holders are not subject to supervision.

The supervisor is every member of the Management Board (UO) of the Foundation in Phase 1, and every ZRNO Holder in Phase 2. The supervisory function arises from status automatically, without appointment.

The supervisor reviews the legitimacy of a completed verification and replenishes the verifier's consumed capacity slot. Upon completing supervision, the supervisor receives 500 POEN in accordance with Article 7 of this Rulebook.

### Article 11

*Supervision procedure*

Supervision is carried out after verification. A verification takes effect upon recording of the verification record. The supervisor subsequently reviews the verification and completes the supervisor field in the verification record.

Until supervision is completed, the verifier's capacity slot remains consumed. Replenishment of the slot takes effect only upon completion of the supervisor field in the verification record.

## V — Anti-Circular Rule

### Article 12

*Prohibited zone of the verifier*

A verifier may not verify:

— their own verifier (reciprocal prohibition);

— users who have been verified by their verifier (prohibition on verifying tree siblings);

— anyone in their ancestral chain — the sequence consisting of the verifier, the verifier's verifier, and so on upward to the root of the verification tree;

— anyone in their descendant chain — the sequence consisting of users verified by the verifier, users verified by those users, and so on downward.

A verifier may only verify users from other branches of the verification tree.

### Article 13

*Purpose of the anti-circular rule*

The anti-circular rule ensures that the verification tree grows laterally, through independent branches of the network. The vertical prohibition — both upward and downward — ensures that no user can accumulate verifications within a single chain. A user wishing to reach an index of 100% must be known to users from multiple different parts of the network. This is a structural barrier against coordinated manipulation: a fictitious person cannot be known across sufficiently different social circles to collect 10 independent verifications.

## VI — Initial Mechanism

### Article 14

*Initial users*

Members of the Management Board (UO) of the Foundation are the initial users of the system. Their initial reality index is 10% without verification by other users. The initial index does not derive from the vouching chain.

The data of initial users are in the public register of the Serbian Business Registers Agency. Their reality derives from the public record, not from the vouching chain.

### Article 15

*Rights of initial users*

Initial users have rights identical to those of ZRNO Holders with regard to verification: capacity is not consumed when they verify and their verifications are not subject to supervision.

Other users may verify initial users under the ordinary rules of the vouching chain. Upon verification, the index of initial users increases under the same rules as for all users. Index growth is a record without functional effect.

## VII — Consequences of Loss of Status on Verifications

### Article 16

*Loss of verifier status*

When a user whose status has ceased (withdrawal, exclusion, death) was the verifier of other users, the users whom they verified lose 10 percentage points of their reality index.

The loss of index does not propagate further — users verified by the affected users suffer no effect.

### Article 17

*Index falling to zero*

A user whose index falls to 0% as a result of the loss of a verifier's status retains the status of a verified user. The user loses access to platform functions but retains their account and may be re-verified through the vouching chain.

A user who is a ZRNO Holder does not suffer the functional effect of an index drop — access and capacity derive from ZRNO Holder status, not from the index.

## VIII — False Verification

### Article 18

*Establishing a false verification*

A false verification is a verification by which the verifier confirmed the reality of a user who does not exist as a natural person, who is not unique (has another account in the system), or whose continuity is not ensured.

A false verification is established by the Management Board (UO) of the Foundation in Phase 1, or by the Upper Kolo in Phase 2.

### Article 19

*Consequences of an established false verification*

Upon establishing a false verification, all verifications performed by the false verifier are annulled. The index of users verified by the false verifier is reduced by 10 percentage points per annulled verification.

### Article 20

*Annulment cascade*

A user whose index falls to 0% following annulment loses access to platform functions but retains the status of a verified user. All verifications performed by that user are also annulled.

The procedure repeats recursively: for each user whose index falls to 0%, their verifications are annulled, which may cause further users' indices to fall. The cascade stops when no further annulment causes any index to fall to 0%.

POEN records of users whose index has fallen to 0% in the cascade are annulled in accordance with Art. 34 of the KOLO System Rulebook.

### Article 21

*Status of the false verifier*

The false verifier is subject to measures in accordance with the rules on cessation and suspension of status established in the Terms of Use.

## IX — Final Provisions

### Article 22

*Amendments to the Rulebook*

This Rulebook is adopted and amended by the Management Board (UO) of the KOLO Foundation, under the procedure established in the KOLO System Rulebook.

### Article 23

*Entry into force*

This Rulebook enters into force on the date of its adoption by the Management Board (UO) of the KOLO Foundation.

*Rulebook on Proof of Reality v3.9.0*
