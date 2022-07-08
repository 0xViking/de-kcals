import { useRouter } from "next/router"
import { useState } from "react"
import { globalUser, globalUserName, globalPFP } from "../GlobalUser"
import { Button, Input, Loading } from "web3uikit"
import { Orbis } from "@orbisclub/orbis-sdk"
import { HashtagIcon } from "@heroicons/react/outline"
import Messages from "./Messages"

let orbis = new Orbis()

export default function Conversations(params) {
    const router = useRouter()

    /** Retrive the conversation ID passed in the URL */
    const { _id } = router.query

    const [isConnecting, setIsConnecting] = useState(false)
    const [user, setUser] = useState("")
    const [msgToSend, setMsgToSend] = useState("")
    const [sending, setSending] = useState(false)

    /** Connecting to Orbis functionality */
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

    /** We are calling the Orbis SDK to send a new Message from the user to the conversation ID given */
    const sendMessage = async (conversation_id) => {
        setSending(true)

        let res = await orbis.sendMessage({ conversation_id: conversation_id, body: msgToSend })

        /** Check if conversation was created with success or not */
        if (res.status == 200) {
            setMsgToSend("")
        } else {
            alert(
                "Error sending sending. Try to connect to Ceramic again using `Connect wallet` button on right top of the application."
            )
        }

        setTimeout(() => {
            setSending(false)
        }, 600)
    }

    return (
        <div className="flex-1 w-full">
            <>
                {_id ? (
                    <div className="flex-1">
                        {/* Top bar in the Conversation display which shows the conversation-Id and connect wallet button*/}
                        <div className="flex justify-between place-items-center p-2 fixed bg-slate-50 w-full shadow-sm">
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

                        {sending ? (
                            <div className="flex h-screen justify-center items-center w-screen pr-60">
                                <Loading
                                    fontSize={20}
                                    size={40}
                                    spinnerColor="#2E7DAF"
                                    spinnerType="loader"
                                    text="Loading..."
                                />
                            </div>
                        ) : (
                            <div className="pt-14 appearance-none block w-full inset-0">
                                {/* component which displays the messages in the conversation */}
                                <Messages conversation_id={_id} orbis={orbis} user={user} />
                            </div>
                        )}

                        {/* Empty div to make sure last message is not under the text box */}
                        <div id="ConvBottom" className="h-16"></div>
                    </div>
                ) : (
                    <div></div>
                )}
                {/* Bottom bar in the Conversation display which shows the message input and send button */}
                <div className="flex justify-between gap-2 place-items-center bg-slate-50 p-2 fixed bottom-0  w-full">
                    <Input
                        width="80%"
                        placeholder="Type your message here"
                        autoFocus={true}
                        value={msgToSend}
                        onChange={(e) => {
                            setMsgToSend(e.target.value)
                        }}
                    />
                    <div className="mr-56">
                        <Button
                            id="connect-button"
                            onClick={() => {
                                sendMessage(_id)
                            }}
                            isLoading={sending}
                            loadingText="Sending..."
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
