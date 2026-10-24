'use client'

import { useState } from 'react'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { getSuiClient } from '../lib/sui'

function shortAddr(s) {
  if (!s || s.length <= 18) return s
  return s.substring(0, 10) + '...' + s.slice(-6)
}

function formatSui(mist) {
  var num = parseInt(mist) / 1e9
  if (num < 0.0001 && num !== 0) return num.toExponential(2)
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

function coinSymbol(type) {
  if (!type) return 'UNKNOWN'
  if (type === '0x2::sui::SUI') return 'SUI'
  var parts = type.split('::')
  return parts[parts.length - 1] || type
}

export default function TxSimulator() {
  const account = useCurrentAccount()
  const [txInput, setTxInput] = useState('')
  const [senderInput, setSenderInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  var connectedAddress = account ? account.address : ''

  async function simulate() {
    var raw = txInput.trim()
    if (!raw) { setError('Paste a transaction to simulate.'); return }

    var sender = connectedAddress || senderInput.trim()
    if (!sender) { setError('Connect a wallet or enter a sender address.'); return }
    if (!sender.startsWith('0x')) { setError('Sender address must start with 0x.'); return }

    setBusy(true)
    setError(null)
    setResult(null)

    try {
      var sui = getSuiClient()

      var sim = await sui.devInspectTransactionBlock({
        transactionBlock: raw,
        sender: sender,
      })

      if (!sim) { setError('Simulation returned nothing.'); setBusy(false); return }

      var status = (sim.effects && sim.effects.status && sim.effects.status.status) || 'unknown'
      var gasUsed = (sim.effects && sim.effects.gasUsed) || null
      var balanceChanges = sim.balanceChanges || []
      var objectChanges = sim.objectChanges || []
      var events = sim.events || []
      var simError = (sim.effects && sim.effects.status && sim.effects.status.error) || null

      setResult({
        status: status,
        error: simError,
        gasUsed: gasUsed,
        balanceChanges: balanceChanges,
        objectChanges: objectChanges,
        events: events,
        sender: sender,
      })
    } catch (e) {
      setError('Simulation failed: ' + ((e && e.message) || 'unknown error'))
    }
    setBusy(false)
  }

  return (
    <div>
      <p className="tool-desc">
        Paste a base64 transaction block to simulate it against live Sui chain state
        before signing. Shows what moves and whether it would succeed.
      </p>

      {!connectedAddress && (
        <div className="sender-row">
          <input
            type="text"
            value={senderInput}
            onChange={e => setSenderInput(e.target.value)}
            placeholder="Sender address (0x...) or connect a wallet"
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      )}

      <div className="tx-input">
        <textarea
          value={txInput}
          onChange={e => setTxInput(e.target.value)}
          placeholder="Paste base64 transaction bytes here"
          spellCheck="false"
          rows={3}
        />
      </div>

      <button className="tx-btn" onClick={simulate} disabled={busy}>
        {busy ? 'Simulating...' : 'Simulate'}
      </button>

      {error && (
        <div className="result error">
          <strong>Could not simulate</strong>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="sim-result">
          <div className={'result ' + (result.status === 'success' ? 'allow' : 'danger')}>
            {result.status === 'success'
              ? <strong>✅ Would succeed</strong>
              : <strong>🚫 Would fail</strong>}
            {result.error && <span>{result.error}</span>}
          </div>

          {result.gasUsed && (
            <div className="sim-section">
              <h4>Gas</h4>
              <table className="sim-table">
                <tbody>
                  <tr>
                    <td>Computation</td>
                    <td>{formatSui(result.gasUsed.computationCost)} SUI</td>
                  </tr>
                  <tr>
                    <td>Storage</td>
                    <td>{formatSui(result.gasUsed.storageCost)} SUI</td>
                  </tr>
                  <tr>
                    <td>Rebate</td>
                    <td>{formatSui(result.gasUsed.storageRebate)} SUI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {result.balanceChanges && result.balanceChanges.length > 0 && (
            <div className="sim-section">
              <h4>Balance changes</h4>
              <table className="sim-table">
                <tbody>
                  {result.balanceChanges.map(function(bc, i) {
                    var owner = bc.owner
                    var isSender = false
                    if (owner) {
                      if (typeof owner === 'string') isSender = (owner === result.sender)
                      else if (owner.AddressOwner) isSender = (owner.AddressOwner === result.sender)
                    }
                    var amount = parseInt(bc.amount)
                    var sign = amount >= 0 ? '+' : ''
                    var amountClass = amount < 0 ? 'neg' : 'pos'
                    return (
                      <tr key={i}>
                        <td>
                          {coinSymbol(bc.coinType)}
                          {isSender && <span className="tag tag-info">you</span>}
                        </td>
                        <td className={amountClass}>
                          {sign}{formatSui(amount)} {coinSymbol(bc.coinType)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {result.objectChanges && result.objectChanges.length > 0 && (
            <div className="sim-section">
              <h4>Objects ({result.objectChanges.length})</h4>
              <table className="sim-table">
                <tbody>
                  {result.objectChanges.map(function(oc, i) {
                    var changeType = oc.type || 'unknown'
                    var label = changeType.replace(/([A-Z])/g, ' $1').toLowerCase()
                    var tagCls = changeType === 'created' ? 'tag-safe' : changeType === 'deleted' ? 'tag-danger' : 'tag-warn'
                    return (
                      <tr key={i}>
                        <td><span className={'tag ' + tagCls}>{label}</span></td>
                        <td style={{ fontSize: '0.72rem' }}>
                          {oc.objectType ? shortAddr(oc.objectType) : ''}
                          {oc.objectId && <br />}
                          {oc.objectId && shortAddr(oc.objectId)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {result.events && result.events.length > 0 && (
            <div className="sim-section">
              <h4>Events ({result.events.length})</h4>
              <table className="sim-table">
                <tbody>
                  {result.events.map(function(ev, i) {
                    return (
                      <tr key={i}>
                        <td style={{ fontSize: '0.72rem' }}>{ev.type ? shortAddr(ev.type) : 'event'}</td>
                        <td></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
