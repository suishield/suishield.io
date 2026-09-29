# SuiShield

Independent transaction firewall for Sui. Adds a security layer between dApps and your wallet — regardless of which wallet you use.

## How it works

When a dApp asks you to sign a transaction, SuiShield intercepts the request and runs it through Sui's `simulateTransaction` against live chain state. You see a human-readable breakdown of what the transaction actually does — coins in and out, objects moved, contracts called — before your wallet ever sees it.

Connected sites are checked against the [Sui Guardians](https://github.com/nicola-di-silvio/sui-guardian) blocklist on every page load. If a site is a known phishing domain, you get a warning before you even connect your wallet.

## What it adds over wallet-native previews

Wallets like Slush, OKX, and Backpack already show basic transaction previews at signing time. SuiShield is different in a few ways:

- **Wallet-independent** — same protection regardless of which wallet you use, same interface everywhere
- **Pre-connect warnings** — phishing sites flagged on page load, not at signing time
- **Risk pattern detection** — known drainer contract patterns, abnormal outflows to unverified addresses, first-interaction warnings on new contracts
- **Works alongside your wallet** — not a replacement, an additional layer on top

## Stack

- Simulation: [`simulateTransaction`](https://docs.sui.io/guides/developer/sui-101/simulating-refs) (Sui SDK, no custom engine)
- Phishing data: [Sui Guardians](https://github.com/nicola-di-silvio/sui-guardian) blocklist
- Wallet integration: [Sui Wallet Standard](https://docs.sui.io/standards/wallet-standard) (works with any compliant wallet)
- Runtime: client-side only, no backend, no data collection

## Status

Under development — web app and browser extension.

## License

MIT
