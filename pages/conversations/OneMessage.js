import { useState, useEffect } from "react"

/** This component is being used to decrypt and display one message */
export default function OneMessage({ message, orbis, user }) {
    const [body, setBody] = useState()
    let divStyling

    /** Trigger the decrypt function when the component mounts and if Message changes */
    useEffect(() => {
        if (message) {
            message.creator !== user
                ? (divStyling = "font-bold text-slate-600")
                : (divStyling = "font-bold text-blue-400")
            decrypt()
        }
    }, [message])

    /** Because the messages sent using Orbis are encrypted we need to decrypt it before displaying the content on the screen.*/
    async function decrypt() {
        let res = await orbis.decryptMessage(message.content)
        setBody(res.result)
        document.getElementById("ConvBottom").scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="flex items-center p-2 border-2 rounded-3xl shadow-md w-max">
            <div>
                {/* Profile picture is displayed if use has set an pfp in orbis */}
                {message.creator_details?.profile.pfp ? (
                    <img src={message.creator_details.profile.pfp} width={40} height={30} />
                ) : null}
            </div>

            <div className="flex-1 pl-1">
                {/* Display username if set in Orbis else display the address string sliced */}
                <div
                    className={`font-bold text-xs text-${
                        message.creator !== window.localStorage.getItem("Kcals-globalUser")
                            ? "slate-600"
                            : "blue-400"
                    }`}
                >
                    {message.creator_details?.profile.username ? (
                        <span>{message.creator_details.profile.username}</span>
                    ) : (
                        <div>
                            {" " + message.creator.slice(17, 22)}...
                            {message.creator.slice(message.creator.length - 4)}
                        </div>
                    )}
                </div>
                {/* Display the Decrypting message while decryption is in progress else display the Message */}
                <p className="font-serif text-slate-600 max-w-3xl">
                    {body ? body : "decrypting..."}
                </p>
            </div>
        </div>
    )
}
