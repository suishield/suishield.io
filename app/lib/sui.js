import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'

const RPC_URL = getFullnodeUrl('mainnet')

let client = null

export function getSuiClient() {
  if (!client) {
    client = new SuiClient({ url: RPC_URL })
  }
  return client
}

export async function inspectObject(objectId) {
  var sui = getSuiClient()
  return sui.getObject({
    id: objectId,
    options: {
      showType: true,
      showOwner: true,
      showContent: true,
      showPreviousTransaction: true,
    }
  })
}

export async function getWalletBalances(address) {
  var sui = getSuiClient()
  return sui.getAllBalances({ owner: address })
}

export async function getTransactionTimestamp(digest) {
  var sui = getSuiClient()
  var tx = await sui.getTransactionBlock({ digest, options: {} })
  return tx.timestampMs ? parseInt(tx.timestampMs) : null
}

export async function simulateTransaction(txBytes, sender) {
  var sui = getSuiClient()
  return sui.devInspectTransactionBlock({
    transactionBlock: txBytes,
    sender: sender,
  })
}
