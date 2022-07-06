import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { globalUser, globalUserName, globalPFP } from "../GlobalUser"
import { Button, Input, Skeleton } from "web3uikit"
import { Orbis } from "@orbisclub/orbis-sdk"
import { HashtagIcon } from "@heroicons/react/outline"

let orbis = new Orbis()

export default function Conversations(params) {
    const router = useRouter()

    const { _id } = router.query

    const [isConnecting, setIsConnecting] = useState(false)
    const [user, setUser] = useState("")
    const [msgToSend, setMsgToSend] = useState("")
    const [messages, setMessages] = useState([])

    const onInputChange = (e) => {
        setMsgToSend(e.target.value)
        console.log(e.target.value)
    }

    const connectOrbis = async () => {
        setIsConnecting(true)
        let res = await orbis.connect()

        /** Check if connection is successful or not */
        if (res.status == 200) {
            globalUser = res.did
            setUser(res.did)
            if (typeof window !== "undefined") {
                window.localStorage.setItem("Kcals-globalUser", globalUser)
            }
            if (res.details.profile) {
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
            }
            setIsConnecting(false)
        } else {
            console.log("Error connecting to Ceramic: ", res)
            alert("Error connecting to Ceramic.")
            setIsConnecting(false)
        }
    }

    /** We are calling the Orbis SDK to send a new Message from this user to the conversation ID given */
    const sendMessage = async (conversation_id) => {
        // setLoading(true)

        /**
         * The sendMessage() function accept a JSON object that must contain the `conversationId`
         * and `body` key.
         */
        let res = await orbis.sendMessage({ conversation_id: conversation_id, body: msgToSend })

        /** Check if conversation was created with success or not */
        if (res.status == 200) {
            console.log("Message sent with stream_id: ", res.doc)
            // setLoading(false)
            setMsgToSend("")
            getMessageComponent()
        } else {
            console.log("Error sending message: ", res)
            alert("Error sending sending. You might need to refresh the page.")
        }
    }

    const getMessageComponent = () => {
        return <Messages conversation_id={_id} orbis={orbis} user={user} />
    }

    return (
        <div className="flex-1 w-full">
            <>
                {_id ? (
                    <div className="flex-1">
                        <div className="flex justify-between place-items-center p-2 fixed bg-slate-50 w-full shadow-sm">
                            {/* <div className="sticky top-0 z-10 bg-white p-4 shadow flex w-10/12"> */}
                            <div className="flex justify-start">
                                <HashtagIcon width={20} height={20} /> Conversation ID- {_id}
                            </div>
                            <div className="ml-60">
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
                            <div></div>
                        </div>
                        <div className="pt-14 appearance-none block w-full inset-0">
                            {getMessageComponent()}
                        </div>
                        <div className="h-16"></div>
                    </div>
                ) : (
                    <div></div>
                )}

                <div className="flex justify-between gap-2 place-items-center bg-slate-50 p-2 fixed bottom-0  w-full">
                    <Input
                        width="80%"
                        placeholder="Type your message here"
                        autoFocus={true}
                        value={msgToSend}
                        onChange={onInputChange}
                    />
                    <div className="mr-56">
                        <Button
                            id="connect-button"
                            onClick={() => {
                                sendMessage(_id)
                            }}
                            size="large"
                            text="Send"
                            theme="primary"
                            type="button"
                        />
                    </div>
                    <div></div>
                </div>
            </>
        </div>
    )
}

/** We will use this component to load, decrypt and display all the messages sent in this conversation */
function Messages({ orbis, conversation_id, user }) {
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])

    /** We trigger the query when the component is mounted */
    useEffect(() => {
        if (conversation_id) {
            loadMessages()
        }
    }, [conversation_id])

    /** Query our API to load the messages */
    async function loadMessages() {
        setLoading(true)
        let { data, error, status } = await orbis.getMessages(conversation_id)

        if (data) {
            setMessages(data.reverse())
            console.log("Messages loaded: ", data)
            setLoading(false)
        }
    }

    /** Show loading state or messages sent. */
    if (loading) {
        return <Skeleton theme="subtitle" width="30%" />
    }

    if (messages && messages.length > 0) {
        return messages.map((message, key) => {
            return (
                <div className="p-1">
                    <OneMessage message={message} orbis={orbis} key={key} user={user} />
                </div>
            )
        })
    } else {
        return (
            <p className="flex justify-center font-bold pl-2 fixed bottom-24">
                There isn't any message in this conversation, send the first one!
            </p>
        )
    }
}

/** This component is being used to decrypt and display one message */
function OneMessage({ message, orbis, user }) {
    const [body, setBody] = useState()
    let divStyling

    /** We call the decrypt function when the component mounts */
    useEffect(() => {
        if (message) {
            console.log("Decrypting message: ", message)
            message.creator !== user
                ? (divStyling = "font-bold text-slate-600")
                : (divStyling = "font-bold text-blue-400")
            decrypt()
        }
    }, [message])

    /**
     * Because the messages sent using Orbis are encrypted we need to decrypt it
     * before displaying the content on the screen.
     */
    async function decrypt() {
        let res = await orbis.decryptMessage(message.content)
        setBody(res.result)
    }

    return (
        <div className="flex items-center p-2 border-2 rounded-3xl shadow-md w-max">
            <div>
                {message.creator_details?.profile.pfp ? (
                    <img src={message.creator_details.profile.pfp} width={40} height={30} />
                ) : null}
            </div>

            <div className="flex-1 pl-1">
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
                <p className="font-serif text-slate-600 max-w-3xl">
                    {body ? body : "decrypting..."}
                </p>
            </div>
        </div>
    )
}
