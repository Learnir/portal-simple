import Head from 'next/head'

import { AppStateProvider } from '../context/state';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AppStateProvider>
      <div>
        <Head>
          <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
          <script type='module' src='https://unpkg.com/learnir-exp-module@0.6.0/dist/learnir-exp-module/learnir-exp-module.esm.js'></script>
        </Head>
        <div>
          <SafeHydrate><Component {...pageProps} /></SafeHydrate>
        </div>
      </div>
    </AppStateProvider>
  )
}