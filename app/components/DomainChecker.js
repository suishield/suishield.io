'use client'

import { useState, useEffect, useRef } from 'react'

export default function DomainChecker() {
  const [blocklist, setBlocklist] = useState(null)
  const [allowlist, setAllowlist] = useState(null)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [stats, setStats] = useState('Loading blocklist...')
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    fetch('https://raw.githubusercontent.com/suiet/guardians/main/dist/domain-list.json')
      .then(r => r.json())
      .then(data => {
        const bl = {}
        const al = {}
        ;(data.blocklist || []).forEach(d => { bl[d] = true })
        ;(data.allowlist || []).forEach(d => { al[d] = true })
        setBlocklist(bl)
        setAllowlist(al)
        setStats((data.blocklist || []).length.toLocaleString() + ' phishing domains loaded')
      })
      .catch(() => setStats('Failed to load blocklist.'))
  }, [])

  function extractDomain(s) {
    return s.trim().toLowerCase()
      .replace(/^https?:\/\//, '')
      .split('/')[0].split('?')[0].split('#')[0].split(':')[0]
      .replace(/\.+$/, '')
  }

  function inList(domain, list) {
    if (!list) return false
    if (list[domain]) return true
    var parts = domain.split('.')
    for (var i = 1; i < parts.length; i++) {
      if (list[parts.slice(i).join('.')]) return true
    }
    return false
  }

  function check() {
    if (!input.trim()) {
      setResult({ type: 'error', text: 'Enter a URL or domain.' })
      return
    }
    if (!blocklist) {
      setResult({ type: 'error', text: 'Blocklist still loading — try again in a moment.' })
      return
    }
    var d = extractDomain(input)
    if (!d || d.indexOf('.') === -1) {
      setResult({ type: 'error', text: 'Not a valid domain.' })
      return
    }

    if (inList(d, blocklist)) {
      setResult({
        type: 'danger',
        title: '🚫 PHISHING — DO NOT CONNECT',
        domain: d,
        text: 'is a confirmed scam site. Connecting your wallet here will result in loss of funds.'
      })
    } else if (inList(d, allowlist)) {
      setResult({
        type: 'allow',
        title: '✅ Verified safe',
        domain: d,
        text: 'is a recognized Sui ecosystem site, verified by Sui Guardians.'
      })
    } else {
      setResult({
        type: 'unknown',
        title: '⚠ Not reviewed',
        domain: d,
        text: 'has not been reviewed by Sui Guardians. Exercise caution before connecting your wallet.'
      })
    }
  }

  function onKey(e) { if (e.key === 'Enter') check() }

  var resultClass = result ? 'result ' + result.type : 'result'

  return (
    <div>
      <p className="tool-desc">
        Check any URL or domain against{' '}
        <a href="https://github.com/suiet/guardians" target="_blank" rel="noreferrer">Sui Guardians</a>
        {' '}— 46,000+ known phishing sites targeting the Sui ecosystem.
      </p>
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="e.g. app.cetus.zone"
          spellCheck="false"
          autoComplete="off"
        />
        <button onClick={check} disabled={!blocklist}>Check</button>
      </div>
      {result && (
        <div className={resultClass}>
          <strong>{result.title || result.text}</strong>
          {result.domain && (
            <span><code>{result.domain}</code> {result.text}</span>
          )}
          {!result.domain && !result.title && result.text}
        </div>
      )}
      <div className="stats">{stats}</div>
    </div>
  )
}
