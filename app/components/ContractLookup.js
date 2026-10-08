'use client'

import { useState } from 'react'

var SUI_RPC = 'https://sui-mainnet.blockvision.org/v1/3IQrIRW5Ge87dPpT9o5XEebkSG7'

function rpc(method, params) {
  return fetch(SUI_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
  }).then(r => r.json()).then(r => {
    if (r.error) throw new Error(r.error.message)
    return r.result
  })
}

function shortAddr(s) {
  if (!s || s.length <= 20) return s
  return s.substring(0, 12) + '...' + s.slice(-8)
}

function shortType(s) {
  if (!s || s.length <= 55) return s
  return s.substring(0, 48) + '...'
}

export default function ContractLookup() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(null)
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(false)

  async function lookup() {
    var addr = input.trim()
    if (!addr) { setStatus({ type: 'error', text: 'Enter a Sui address (0x...).' }); return }
    if (!addr.startsWith('0x') || addr.length < 10) { setStatus({ type: 'error', text: 'Not a valid Sui address.' }); return }

    setBusy(true)
    setRows([])
    setStatus({ type: 'info', text: 'Looking up on Sui mainnet...' })

    try {
      var obj = await rpc('sui_getObject', [addr, { showType: true, showOwner: true, showContent: true, showPreviousTransaction: true }])
      if (obj && obj.data) {
        await showObject(obj.data, addr)
      } else {
        await tryWallet(addr)
      }
    } catch (e) {
      await tryWallet(addr)
    }
    setBusy(false)
  }

  async function showObject(d, addr) {
    var objType = d.type || 'unknown'
    var owner = d.owner
    var ownerStr = 'unknown'
    if (owner) {
      if (typeof owner === 'string') ownerStr = owner
      else if (owner.AddressOwner) ownerStr = owner.AddressOwner
      else if (owner.ObjectOwner) ownerStr = owner.ObjectOwner
      else if (owner.Shared) ownerStr = 'Shared object'
      else if (owner === 'Immutable' || owner.Immutable !== undefined) ownerStr = 'Immutable'
    }
    var isPackage = objType === 'package'
    var isShared = ownerStr === 'Shared object'
    var version = d.version || ''

    var balance = null
    if (d.content && d.content.fields && d.content.fields.balance) {
      balance = parseInt(d.content.fields.balance) / 1e9
    }

    var r = []
    r.push({ label: 'Type', value: shortType(objType) })
    r.push({ label: 'Owner', value: shortAddr(ownerStr), tag: isShared ? 'shared' : ownerStr === 'Immutable' ? 'immutable' : null })
    if (isPackage) r.push({ label: 'Kind', value: 'Published package', tag: 'package' })
    if (balance !== null) r.push({ label: 'Balance', value: balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' SUI' })
    r.push({ label: 'Version', value: String(version) })
    if (isPackage && version > 1) r.push({ label: 'Upgrades', value: (version - 1) + ' upgrade(s)', tag: 'upgradeable' })
    if (isPackage && version == 1) r.push({ label: 'Upgrades', value: 'None', tag: 'original' })

    // fetch timestamp
    if (d.previousTransaction) {
      try {
        var tx = await rpc('sui_getTransactionBlock', [d.previousTransaction, { showInput: false }])
        if (tx && tx.timestampMs) {
          var date = new Date(parseInt(tx.timestampMs))
          var dateStr = date.toISOString().split('T')[0]
          var daysAgo = Math.floor((Date.now() - date.getTime()) / 86400000)
          r.push({ label: 'Last activity', value: dateStr, tag: daysAgo < 30 ? 'recent' : 'aged', tagText: daysAgo + 'd ago' })
        }
      } catch (e) {}
    }

    r.push({ label: 'Digest', value: d.digest || '', small: true })

    setStatus({ type: 'info', title: 'ℹ Object found' })
    setRows(r)
  }

  async function tryWallet(addr) {
    try {
      var balances = await rpc('suix_getAllBalances', [addr])
      if (balances && balances.length > 0) {
        var r = []
        for (var i = 0; i < balances.length; i++) {
          var b = balances[i]
          var coinType = b.coinType || ''
          var symbol = coinType.split('::').pop() || '?'
          var raw = parseInt(b.totalBalance || '0')
          var decimals = (symbol === 'USDC' || symbol === 'USDT') ? 6 : 9
          var amount = raw / Math.pow(10, decimals)
          r.push({ label: symbol, value: amount.toLocaleString(undefined, { maximumFractionDigits: 4 }), small: true, smallText: shortType(coinType) })
        }
        r.push({ label: 'Tokens', value: balances.length + ' type(s)' })
        r.push({ label: 'Address', value: addr, small: true })
        setStatus({ type: 'info', title: '💰 Wallet found' })
        setRows(r)
      } else if (balances && balances.length === 0) {
        setStatus({ type: 'unknown', text: 'Empty wallet — this address holds no tokens.' })
        setRows([])
      } else {
        setStatus({ type: 'unknown', text: 'Not found on Sui mainnet.' })
        setRows([])
      }
    } catch (e) {
      setStatus({ type: 'error', text: 'Lookup failed: ' + e.message })
      setRows([])
    }
  }

  function tagClass(tag) {
    if (tag === 'immutable' || tag === 'original' || tag === 'aged') return 'tag tag-safe'
    if (tag === 'shared' || tag === 'upgradeable' || tag === 'recent') return 'tag tag-warn'
    if (tag === 'package') return 'tag tag-info'
    return 'tag'
  }

  function onKey(e) { if (e.key === 'Enter') lookup() }

  return (
    <div>
      <p className="tool-desc">
        Paste any Sui address — contract, object, or wallet.
        Reads directly from the network.
      </p>
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="0x... (contract, object, or wallet)"
          spellCheck="false"
          autoComplete="off"
        />
        <button onClick={lookup} disabled={busy}>
          {busy ? 'Looking up...' : 'Lookup'}
        </button>
      </div>
      {status && (
        <div className={'result ' + status.type}>
          {status.title && <strong>{status.title}</strong>}
          {status.text && <span>{status.text}</span>}
        </div>
      )}
      {rows.length > 0 && (
        <div className="lookup-detail">
          <table>
            <tbody>
              {rows.map(function(r, i) {
                return (
                  <tr key={i}>
                    <td>{r.label}</td>
                    <td style={r.small ? { fontSize: '0.72rem' } : {}}>
                      {r.value}
                      {r.tag && <span className={tagClass(r.tag)}>{r.tagText || r.tag}</span>}
                      {r.smallText && <span style={{ display: 'block', fontSize: '0.68rem', color: '#a0aec0', marginTop: '0.15rem' }}>{r.smallText}</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
