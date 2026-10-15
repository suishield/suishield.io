import './globals.css'
import '@mysten/dapp-kit/dist/index.css'
import Providers from './providers'

export const metadata = {
  title: 'SuiShield',
  description: 'Transaction firewall for Sui. Simulate before you sign.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
