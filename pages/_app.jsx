import '../styles/globals.css'
// import { AppProps } from 'next/app'
import Looper from '../components/looper/Looper'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Looper/>
      <Component {...pageProps} />
    </Layout>
  )
}
