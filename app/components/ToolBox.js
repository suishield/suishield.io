'use client'

import { useState } from 'react'
import DomainChecker from './DomainChecker'
import ContractLookup from './ContractLookup'

export default function ToolBox() {
  const [tab, setTab] = useState('domain')

  return (
    <section className="tool-section">
      <div className="tool-box">
        <div className="tool-tabs">
          <button
            className={'tool-tab' + (tab === 'domain' ? ' active' : '')}
            onClick={() => setTab('domain')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Domain Check
          </button>
          <button
            className={'tool-tab' + (tab === 'contract' ? ' active' : '')}
            onClick={() => setTab('contract')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Address Lookup
          </button>
        </div>

        <div className="tool-panel">
          {tab === 'domain' && <DomainChecker />}
          {tab === 'contract' && <ContractLookup />}
        </div>
      </div>
    </section>
  )
}
