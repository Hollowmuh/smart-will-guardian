# Smart Will Contract

## Overview

The **Smart Will** contract is a blockchain-based solution designed to automate the distribution of assets according to a user's wishes upon certain conditions (e.g., proof of death). It ensures transparency, security, and trustless execution without the need for intermediaries.

## How the Contract Works

### 1. Will Creation

- The owner (testator) deploys the contract and specifies:
    - List of beneficiaries.
    - Asset allocation percentages or amounts.
    - Conditions for execution (e.g., time delay, proof submission).

### 2. Asset Funding

- The owner deposits assets (e.g., Ether, tokens) into the contract.
- The contract securely holds these assets until execution conditions are met.

### 3. Triggering Execution

- A trusted party (executor or oracle) submits proof (e.g., death certificate, off-chain verification).
- The contract verifies the proof and checks all conditions.

### 4. Asset Distribution

- Upon successful verification, the contract:
    - Distributes assets to beneficiaries as specified.
    - Emits events for transparency and record-keeping.

### 5. Security Features

- Only authorized parties can trigger execution.
- Owner can update or revoke the will before execution.
- All actions are recorded on-chain for auditability.

## Example Workflow

1. Alice creates a smart will, naming Bob and Carol as beneficiaries.
2. Alice funds the contract with 10 ETH.
3. Upon Alice's passing, a trusted oracle submits proof.
4. The contract verifies the proof and sends 6 ETH to Bob, 4 ETH to Carol.

## Benefits

- **Trustless:** No need for lawyers or intermediaries.
- **Transparent:** All actions are visible on the blockchain.
- **Secure:** Assets are only released under predefined conditions.

## Disclaimer

This contract is for educational purposes.
