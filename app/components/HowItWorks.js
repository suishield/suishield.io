export default function HowItWorks() {
  return (
    <section className="bottom">
      <div className="flow">
        <h2>How it works</h2>
        <div className="flow-step">
          <div className="flow-num">1</div>
          <div>
            <h4>dApp asks for a signature</h4>
            <p>You swap, stake, mint — anything that needs signing.</p>
          </div>
        </div>
        <div className="flow-step">
          <div className="flow-num">2</div>
          <div>
            <h4>SuiShield intercepts</h4>
            <p>The request gets simulated using Sui&rsquo;s native simulateTransaction before your wallet sees it.</p>
          </div>
        </div>
        <div className="flow-step">
          <div className="flow-num">3</div>
          <div>
            <h4>You see what happens</h4>
            <p>Balance changes, object moves, contract calls — plain language, not hex.</p>
          </div>
        </div>
        <div className="flow-step">
          <div className="flow-num">4</div>
          <div>
            <h4>You decide</h4>
            <p>Approve — goes to wallet. Reject — nothing sent.</p>
          </div>
        </div>
      </div>

      <div className="built-on">
        <div className="built-item">
          <div className="lbl">Simulation</div>
          <div className="val">
            <a href="https://docs.sui.io/guides/developer/sui-101/simulating-refs" target="_blank" rel="noreferrer">simulateTransaction</a>
          </div>
        </div>
        <div className="built-item">
          <div className="lbl">Phishing data</div>
          <div className="val">
            <a href="https://github.com/suiet/guardians" target="_blank" rel="noreferrer">Sui Guardians</a>
          </div>
        </div>
        <div className="built-item">
          <div className="lbl">Wallets</div>
          <div className="val">
            <a href="https://docs.sui.io/standards/wallet-standard" target="_blank" rel="noreferrer">Wallet Standard</a> — any
          </div>
        </div>
        <div className="built-item">
          <div className="lbl">Backend</div>
          <div className="val">None — client-side only</div>
        </div>
      </div>
    </section>
  )
}
