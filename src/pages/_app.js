import Head from 'next/head'
import Script from 'next/script'

import { AppStateProvider, config } from '../context/state';
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
          <link rel="shortcut icon" href={config.organization.logo} type="image/x-icon" />      
        </Head>
        
        <Script type="module" src="https://unpkg.com/learnir-exp-module@0.8.0/dist/learnir-exp-module/learnir-exp-module.esm.js"></Script>

        <div>
          <SafeHydrate><Component {...pageProps} /></SafeHydrate>
        </div>
      </div>
    </AppStateProvider>
  )
}