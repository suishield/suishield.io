# SuiShield

Transaction firewall for Sui. See what a transaction does before you sign it.

&nbsp;

## What it does

SuiShield simulates every Sui transaction before it reaches your wallet. Instead of blind-signing, you see exactly what leaves your wallet, what arrives, and whether the target contract has known risks.

- **Transaction simulation** — dry-run each transaction against live chain state and display asset changes in plain language
- **Risk signals** — flag suspicious patterns: drainer contracts, high-value outflows to unknown addresses, unusual object transfers
- **Phishing detection** — warn when a connected site impersonates a known Sui dApp

&nbsp;

## Status

Early development. The web app and browser extension are being built.

- Web app: [suishield.io](https://suishield.io) (coming soon)
- Browser extension: Chrome Web Store (coming soon)

&nbsp;

## How it works

1. You connect to a Sui dApp and it asks you to sign a transaction
2. SuiShield intercepts the request and simulates it using `sui_devInspectTransactionBlock`
3. You see a summary: coins in/out, objects created/destroyed, contract calls
4. You approve or reject with full visibility

No backend server. Simulation runs client-side against public Sui RPC. Your keys never leave your wallet.

&nbsp;

## Built by

[mehvetero](https://github.com/mehvetero) — independent security researcher, builder of [move-test-gen](https://github.com/talongate/move-test-gen).

Previously: coordinated disclosure on a Sui lending protocol (~$300K protected), 12 independent security reviews across Sui and EVM protocols.
