import "../styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import Layout from "../components/Layout"
import { NotificationProvider } from "web3uikit"
function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>DE-KCALS</title>
                <meta name="description" content="Decentralized SLACK powered by Orbis" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Layout style to show Sidebar and Header in every view */}
            <NotificationProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NotificationProvider>
        </div>
    )
}

export default MyApp
