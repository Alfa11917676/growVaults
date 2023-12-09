import { Goldman, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/app/Global_Redux/provider';
import Rainbow from '@/Rainbowkit/Rainbow';

const inter = Inter({ subsets: ['latin'] });
const goldman = Goldman({subsets: ['latin'], weight: ["400", "700"]})

export const metadata = {
  title: "Arch's Vault",
  description: 'This is a demo made for ETH_INDIA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={goldman.className}>
        

        <Providers>
          <Rainbow>

        {children}

          </Rainbow>
        </Providers>

        
        </body>
    </html>
  )
}
