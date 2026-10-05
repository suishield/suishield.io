import './globals.css'

export const metadata = {
  title: 'SuiShield',
  description: 'Transaction firewall for Sui. Simulate before you sign.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
