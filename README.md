HIDOL (Hidden Protocol)
Zero-Knowledge Lending on Cardano × Midnight
Prove you deserve the loan. Without showing the data. 

## The Problem We're Solving
DeFi lending is broken. You either:

Lock 150%+ collateral (capital inefficient, excludes real users)
Upload bank statements to centralized platforms (privacy nightmare, defeats the point of crypto)

HIDOL fixes this. We let borrowers cryptographically prove creditworthiness without revealing any personal information. No documents. No databases. No compromises.

## How It Works
The Flow

Borrower generates proof locally (income, debt status, collateral ratio, wallet ownership)
Midnight Compact circuit validates privately — only TRUE/FALSE flags leave your browser
Backend verifier issues signed attestation — cryptographic "green badge"
Cardano smart contract escrows funds — fully automated, no human intervention
Lender funds loan based on attestation, never seeing raw data

The Stack

Cardano L1: Settlement, escrow, liquidation logic
Midnight Compact: Zero-knowledge proof generation (runs in-browser)
Off-chain Verifier: Attestation signing & oracle validation
Frontend: One-click proof generation, wallet integration

<img width="398" height="268" alt="image" src="https://github.com/user-attachments/assets/ea6da38c-dd96-4ffe-af51-818741326d84" />
<br>
<img width="407" height="744" alt="image" src="https://github.com/user-attachments/assets/c0eeb704-b829-4233-820d-9da3d4d57415" />


## Circuit Logic (What Gets Proven)
The ZK circuit validates:
✅ Income Threshold: income > minimumRequired
✅ No Debt Red Flags: debtFlag == 0
✅ Collateral Ratio: collateral × oraclePrice >= loan × minRatio
✅ Oracle Freshness: timestamp < maxAge
✅ Wallet Ownership: ed25519_verify(signature, pubkey, loanID)
Output: Boolean flags + proofCommit hash. No private data exposed.

## Security Features
ED25519 signature verification prevents impersonation
Transcript hashing prevents proof replay attacks
Domain separation isolates HIDOL from other protocols
Deterministic prover ensures consistency across integrations
On-chain attestation binding prevents tampering post-verification
Secure fallback blocks silent ZK proof failures

## Future Roadmap
Once core protocol is live:

Credit score ZK proofs (prove score range without revealing exact number)
Employment verification (prove income source without employer data)
Identity-bound loans (persistent reputation without KYC)
Cross-chain attestations (portable credit to other ecosystems)
