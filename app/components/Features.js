export default function Features() {
  return (
    <section className="mid">
      <h2>What it catches</h2>
      <div className="cards">
        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <h3>Blind signatures</h3>
          <p>Every transaction gets dry-run first. You see coins in and out, objects transferred, contracts called.</p>
        </div>
        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Drainer contracts</h3>
          <p>Known attack patterns flagged before your wallet ever sees the request. Abnormal outflows get a warning.</p>
        </div>
        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <h3>Phishing sites</h3>
          <p>Connected sites checked against the Sui Guardians blocklist. Warns before you connect, not after.</p>
        </div>
      </div>
    </section>
  )
}
