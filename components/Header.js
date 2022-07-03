import { useState } from "react"
import { Button } from "web3uikit"
import { Orbis } from "@orbisclub/orbis-sdk"
import Image from "next/image"

export default function Header() {
    const [user, setUser] = useState()
    const [userName, setUserName] = useState()
    const [pfp, setPFP] = useState()

    const orbis = new Orbis()

    const connectOrbis = async () => {
        let res = await orbis.connect()

        /** Check if connection is successful or not */
        if (res.status == 200) {
            setUser(res.did)
            res.details.profile.username && setUserName(res.details.profile.username)
            res.details.profile.pfp && setPFP(res.details.profile.pfp)
        } else {
            console.log("Error connecting to Ceramic: ", res)
            alert("Error connecting to Ceramic.")
        }
    }

    return (
        /** Header of the page which has the logo and connect wallet button */
        <div className="sticky top-0 z-10 bg-white p-2 shadow">
            <div className="flex justify-between">
                <Image src="/updated.png" alt="DE-KCALS logo" width={50} height={40} />
                <div className="pt-1 text-stone-700 font-bold flex justify-start">
                    DE-KCALS : decentralized slack powered by Orbis
                </div>
                {user ? (
                    <p className="flex pt-1">
                        {userName ? (
                            <a href={`https://cerscan.com/mainnet/profile/${user}`} target="_blank">
                                <p className="text-stone-700 font-bold hover:underline hover:text-red-400">
                                    {" " + userName}
                                </p>
                            </a>
                        ) : (
                            <a href={`https://cerscan.com/mainnet/profile/${user}`} target="_blank">
                                <p className="text-stone-700 font-bold">
                                    {" " + user.slice(17, 22)}...{user.slice(user.length - 4)}
                                </p>
                            </a>
                        )}
                        <span>
                            {pfp && <Image src={pfp} alt="DE-KCALS logo" width={30} height={30} />}
                        </span>
                    </p>
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
