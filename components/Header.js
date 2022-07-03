import { useState } from "react"
import { Button } from "web3uikit"
import { Orbis } from "@orbisclub/orbis-sdk"
import Image from "next/image"

export default function Header() {
    const [user, setUser] = useState()
    const orbis = new Orbis()

    const connectOrbis = async () => {
        let res = await orbis.connect()

        /** Check if connection is successful or not */
        if (res.status == 200) {
            setUser(res.did)
        } else {
            console.log("Error connecting to Ceramic: ", res)
            alert("Error connecting to Ceramic.")
        }
    }

    return (
        //Header of the page which has the logo and connect wallet button
        <div className="sticky top-0 z-10 bg-white p-2 shadow">
            <div className="flex justify-between">
                <Image src="/updated.png" alt="DE-KCALS logo" width={50} height={37} />
                <div className="pt-2 text-stone-700 font-bold flex justify-start uppercase">
                    DE-KCALS : A decentralized slack
                </div>
                {user ? (
                    <p>Connected with: {user}</p>
                ) : (
                    <Button
                        id="connect-button"
                        onClick={connectOrbis}
                        text="Connect"
                        theme="primary"
                        type="button"
                    />
                )}
            </div>
        </div>
    )
}
