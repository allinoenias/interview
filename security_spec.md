# Security Specification: All In One Academy Candidate Evaluation System

## 1. Data Invariants
- An authorized interviewer is any authenticated user (or bootstrapped admin/interviewer).
- Candidates can be created and managed by authenticated interviewers.
- Interviews are created by authenticated interviewers for a valid candidate and interviewer ID.
- Answers are tied to valid interview records.
- Deletions/modifications are restricted to authenticated interviewers.

## 2. The Dirty Dozen Attack Payloads
1. Unauthenticated reading of candidate personal contact info (PII leak).
2. Unauthenticated write or update to candidate records.
3. Unauthenticated access or tampering with interview evaluation scores.
4. Tampering with someone else's interviewer profile.
5. Injected oversized payload (>50KB) in candidate notes/answers to exhaust quotas.
6. Malicious ID strings with path traversal or script tags.
7. Modifying completed interview outcome after final submission without auth.
8. Injecting negative or out-of-range evaluation scores (>5 or >10 or <0).
9. Writing answer documents with mismatched interview ID.
10. Spoofed admin actions without authentication.
11. Blank unvalidated candidate creation missing required contact details.
12. Bulk unauthenticated deletion of candidate databases.

## 3. Test Assertions
All unauthorized reads, unauthenticated mutations, and schema boundary violations return PERMISSION_DENIED.
