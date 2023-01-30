import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Looper from '../components/looper/Looper'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Looper/>
      <Component {...pageProps} />
    </Layout>
  )
}
