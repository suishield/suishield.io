# SuiShield

Transaction firewall for Sui. Intercepts every signing request, simulates it against live chain state, and shows you exactly what changes before your wallet sees it.

## Why

Every Sui wallet asks you to approve transactions, but none of them show you what actually happens. You see a blob of Move calls and object IDs — not "500 SUI leaves your wallet." Drainers, phishing dApps, and malicious contracts all look the same as legitimate ones in the signing popup.

SuiShield sits between the dApp and your wallet. Before anything reaches your wallet for signing, you see:

- Which coins leave, which arrive, and how much
- Which objects get transferred, created, or destroyed
- Whether the target contract is verified or flagged
- Whether the connected site is a known phishing domain

If it looks wrong, you reject it. The transaction never reaches your wallet.

## How it works

```
dApp requests signature
        ↓
SuiShield intercepts via Sui Wallet Standard
        ↓
sui_devInspectTransactionBlock (dry-run against live state)
        ↓
Parse balance changes, object mutations, contract calls
        ↓
Display summary → user approves or rejects
        ↓
If approved → forward to wallet for signing
```

Runs entirely client-side. No backend, no account, no data collection. Simulation uses public Sui RPC — your keys never leave your wallet.

## Compatibility

Works with any wallet that implements the [Sui Wallet Standard](https://docs.sui.io/standards/wallet-standard):

- Slush (formerly Sui Wallet)
- Suiet
- Backpack
- Ethos
- Any future wallet following the standard

No integration or permission from wallet developers needed — SuiShield reads the standard interface, not wallet internals.

## Scope

**Web app** — connect your wallet, paste a transaction, see what it does. Useful for one-off checks and reviewing transactions from CLI tools.

**Browser extension** — always-on protection. Every signing request gets simulated automatically. Flags phishing sites on connect.

## Status

Under active development. Not released yet.

## License

MIT
