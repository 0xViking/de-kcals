import Image from "next/image"

export default function Header() {
    let storedUser, storedUserName, storedPFP

    if (typeof window !== "undefined") {
        storedUser = window.localStorage.getItem("Kcals-globalUser")
        storedUserName = window.localStorage.getItem("Kcals-globalUserName")
        storedPFP = window.localStorage.getItem("Kcals-globalPFP")
    }

    return (
        <div className="sticky top-0 z-10 bg-white p-2 shadow">
            {/* Header of the page which has the logo and connect wallet button */}
            <div className="flex justify-between">
                <Image src="/updated.png" alt="DE-KCALS logo" width={50} height={40} />
                <div className="pt-1 text-stone-700 font-bold flex justify-start">
                    DE-KCALS : decentralized slack powered by Orbis
                </div>

                <div className="flex pt-1">
                    {storedUserName ? (
                        <a
                            href={`https://cerscan.com/mainnet/profile/${storedUser}`}
                            target="_blank"
                        >
                            <div className="text-stone-700 font-bold hover:underline hover:text-red-400">
                                {" " + storedUserName}
                            </div>
                        </a>
                    ) : (
                        <a
                            href={`https://cerscan.com/mainnet/profile/${storedUser}`}
                            target="_blank"
                        >
                            <div className="text-stone-700 font-bold">
                                {" " + storedUser.slice(17, 22)}...
                                {storedUser.slice(storedUser.length - 4)}
                            </div>
                        </a>
                    )}
                    <div className="pl-2">
                        {storedPFP && (
                            <Image src={storedPFP} alt="DE-KCALS logo" width={30} height={30} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
