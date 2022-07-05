import "../styles/globals.css"
import Head from "next/head"
import Mainui from "../components/Mainui"
import Layout from "../components/Layout"
import { NotificationProvider } from "web3uikit"
function MyApp({ Component, pageProps }) {
    let storedUser
    if (typeof window !== "undefined") {
        storedUser = window.localStorage.getItem("Kcals-globalUser")
    }
    return (
        <div>
            <Head>
                <title>DE-KCALS</title>
                <meta name="description" content="Decentralized SLACK powered by Orbis" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {storedUser ? (
                <NotificationProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </NotificationProvider>
            ) : (
                <Mainui />
            )}
        </div>
    )
}

export default MyApp
