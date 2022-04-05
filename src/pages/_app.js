import Head from 'next/head'

import { PortalStateProvider } from '../context/state';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <PortalStateProvider>
      <div>
        <Head>
          <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
        </Head>
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </PortalStateProvider>
  )
}