import { globalUser, globalUserName, globalPFP } from "../pages/GlobalUser"
import { useState } from "react"
import { Orbis } from "@orbisclub/orbis-sdk"
import { Button } from "web3uikit"
import Image from "next/image"

const orbis = new Orbis()

export default function Mainui() {
    const [isConnecting, setIsConnecting] = useState(false)

    const connectOrbis = async () => {
        setIsConnecting(true)
        let res = await orbis.connect()

        /** Check if connection is successful or not */
        if (res.status == 200) {
            globalUser = res.did
            if (typeof window !== "undefined") {
                window.localStorage.setItem("Kcals-globalUser", globalUser)
            }
            if (res.details.profile.username) {
                globalUserName = res.details.profile.username
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("Kcals-globalUserName", globalUserName)
                }
            }
            if (res.details.profile.pfp) {
                globalPFP = res.details.profile.pfp
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("Kcals-globalPFP", globalPFP)
                }
            }
            window.location.reload()
            setIsConnecting(false)
        } else {
            console.log("Error connecting to Ceramic: ", res)
            alert("Error connecting to Ceramic.")
            setIsConnecting
        }
    }

    return (
        <>
            <div className="grid place-items-center h-screen bg-zinc-50">
                <div className="p-28 text-center bg-white border rounded-lg drop-shadow-xl text-stone-700 font-bold">
                    <div className="object-contain mb-10">
                        <Image src="/updated.png" alt="DE-KCALS logo" width={120} height={100} />
                    </div>
                    <div>Connect wallet to continue</div>
                    DE-KCALS
                    <div className="mt-12 ml-5">
                        <Button
                            id="connect-button"
                            onClick={connectOrbis}
                            size="large"
                            isLoading={isConnecting}
                            loadingText="Connecting..."
                            text="Connect Wallet"
                            theme="primary"
                            type="button"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
