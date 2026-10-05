# Blame Impactor

Offline document provenance for **Smart India Hackathon SIH26237**: encrypt a source once, issue recipient-approved marked copies, certify the evidence before release, and investigate a recovered copy against its session.

**[Read the visual explanation](https://sudheer1515b.github.io/blameimpactor/)** · **[Open the interactive prototype](https://sudheer1515b.github.io/blameimpactor/prototype/)** · [Presentation guide](prototype/README.md)

![Blame Impactor visual workspace](prototype/preview.png)

## How it works

1. **Encrypt once.** AES-256-GCM protects one content ciphertext. Separate ML-KEM-768 envelopes authorize the recipients.
2. **Request and prepare.** A restricted recipient signer approves access. A managed appliance opens the package internally and prepares a copy with a fresh session mark.
3. **Approve exact bytes.** The recipient signs the exact prepared output binding; the appliance signs its own processing receipt.
4. **Certify before release.** Four Go SmartBFT validators produce actual consensus certificates and durable acknowledgements for the session and live release claim.
5. **Consume and stream.** The original Go grant checks the complete certified history and the actual native TLS exporter. Durable SQLite consumption precedes output; duplicate transfers are refused.
6. **Investigate.** The native verifier checks signatures and ledger proofs. Exact bytes or accepted full-render correspondence can associate a copy with its approved recipient session.

## What you can view here

- Five responsive screens: overview, document vault, recipient desk, evidence ledger and investigation.
- A recorded workflow replay and illustrative recipient approval/decline dialogs.
- Actual synthetic marked PDFs, public certificate/ACK proofs and recorded native verdicts.
- Local SHA-384 comparison of a dropped file with the recorded samples. Files stay in the browser.
- A self-contained [HTML explanation](prototype/explanation.html) with implementation status and limits.

Open `prototype/index.html` directly in a modern browser, or serve this repository locally:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8080/`. No build step, external fonts, CDN or API key is needed.

## Evidence and current scope

The native backend's recorded run `20261005T040807476254Z` delivered two distinct recipient-approved copies from one ciphertext through four separate Go processes and native pure-PQ TLS. Its 15 prototype integration tests, Go race/vet checks and full baseline passed. The static visual prototype has 13 browser behavior checks, including responsive layouts and actual sample-file hashing.

This repository snapshot is the visual presentation and public synthetic evidence. Browser controls replay the recorded run; they do not create new signatures, ledger claims or native forensic verdicts. Native service installation remains separate.

The experimental contour carrier can be removed by readable reconstruction and has no completed human invisibility study. Production carrier acceptance is open. Independent administration, protected persistent unlock/restart reconciliation, trusted consent UI and actual Windows/macOS/Linux installation tests are also unfinished. Session association does not establish which human leaked a copy; delivery and human culpability are not established by these records.

Only public synthetic demo material is included. Private signing/KEM/watermark keys, passwords, private source mappings and custody archives are excluded.
