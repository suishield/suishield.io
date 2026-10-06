export default function Hero() {
  return (
    <section className="hero">
      <h1>See what a transaction does before you sign it</h1>
      <p>
        SuiShield sits between the dApp and your wallet. Every signing request
        gets simulated against live chain state — you see what moves, then you decide.
      </p>
      <div className="badge">
        <span className="dot" />
        In development
      </div>
    </section>
  )
}
