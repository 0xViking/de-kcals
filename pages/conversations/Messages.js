import { useState, useEffect } from "react"
import { Skeleton } from "web3uikit"
import OneMessage from "./OneMessage"

/** We will use this component to load, decrypt and display all the messages sent in the conversation */
export default function Messages({ orbis, conversation_id, user }) {
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])

    /** Trigger the query when the component is mounted also if conversation_id is chnaged */
    useEffect(() => {
        if (conversation_id) {
            setTimeout(() => {
                loadMessages()
            }, 500)
        }
    }, [conversation_id])

    /** Query the API provided by Orbis to load the messages in the conversation_id passed */
    async function loadMessages() {
        setLoading(true)
        let { data, error } = await orbis.getMessages(conversation_id)

        /** Check if there is data given by API and set the Messages state variable */
        if (data) {
            setMessages(data.reverse())
            console.log("Messages loaded: ", data)
            setLoading(false)
        }
        /** Check if there is an error while retriving Messages*/
        if (error) {
            console.log("Error loading messages: ", error)
            alert("Error loading messages: ", error)
            setLoading(false)
        }
    }

    /** Show loading state or messages sent. */
    if (loading) {
        return <Skeleton theme="subtitle" width="30%" />
    }

    /** Show all the messages sent in the conversation */
    if (messages && messages.length > 0) {
        return messages.map((message, key) => {
            return (
                <div className="p-1">
                    {/* Component which decrypts and displays individual messages in the conversation */}
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
