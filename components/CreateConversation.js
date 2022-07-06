import { Form, Button } from "web3uikit"
import { Orbis } from "@orbisclub/orbis-sdk"
import { useEffect, useState } from "react"
import { globalUser, globalUserName, globalPFP } from "../pages/GlobalUser"

let orbis = new Orbis()

export default function CreateConversation() {
    const [storedUser, setStoredUser] = useState("")
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    const btnConfig = {
        isDisabled: btnDisabled,
        isLoading: loading,
        loadingText: "Creating",
        text: "Create",
        theme: "primary",
    }

    const userDids = {
        Baptiste: "did:pkh:eip155:1:0x075286d1a22b083ebcaf6b7fb4cf970cfc4a18f0",
        Charles: "did:pkh:eip155:1:0x9fd07f4ee4f18e27f9d958fb42e8ea2e6ee547bd",
        VikingTest: "did:pkh:eip155:1:0x7c9ae227a21cc5a940eb8616ef21a5bf706acce6",
    }

    const getUsers = () => {
        if (typeof window !== "undefined") {
            const localStoredUser = window.localStorage.getItem("Kcals-globalUser")
            setStoredUser(localStoredUser)
            if (localStoredUser === userDids.Baptiste) {
                setUsers(["Charles", "VikingTest"])
            } else if (localStoredUser === userDids.Charles) {
                setUsers(["Baptiste", "VikingTest"])
            } else if (localStoredUser === userDids.VikingTest) {
                setUsers(["Baptiste", "Charles"])
            } else {
                setUsers(["Baptiste", "Charles", "VikingTest"])
            }
        }
    }

    const getForm = () => {
        return (
            <Form
                isDisabled={loading}
                id="create-conv-form"
                buttonConfig={btnConfig}
                data={[
                    {
                        inputWidth: "100%",
                        name: "Name",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        inputWidth: "100%",
                        name: "Description",
                        type: "text",
                        value: "",
                    },
                    {
                        name: "userDid",
                        options: users,
                        type: "box",
                        value: "Add atleast 1 member",
                    },
                ]}
                onSubmit={onSubmit}
                title="Create a new conversation"
            />
        )
    }

    const onSubmit = async (dataObject) => {
        setBtnDisabled(true)
        const data = dataObject.data
        console.log(data)
        setLoading(true)
        const recipientDIDs = []
        if (data[2].inputResult === "Add atleast 1 member") {
            alert("Please add atleast 1 member")
            setLoading(false)
            setBtnDisabled(false)
            return
        }
        data &&
            data[2].inputResult !== "Add atleast 1 member" &&
            data[2].inputResult.length > 0 &&
            data[2].inputResult.forEach((user) => {
                recipientDIDs.push(userDids[user])
            })
        if (!data[2].inputResult.length > 0) {
        }
        const reqObj = {
            recipients: recipientDIDs,
            name: data && data[0].inputResult,
            description: data && data[1].inputResult,
            context: "viking_team",
        }
        createConversation(reqObj)
    }

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
            setIsConnecting(false)
        } else {
            console.log("Error connecting to Ceramic: ", res)
            alert("Error connecting to Ceramic.")
            setIsConnecting(false)
        }
    }

    /** We are calling the Orbis SDK to create a NEW conversation */
    async function createConversation(object) {
        /**
         * The createConversation() function accept a JSON object that must contain a `recipients` object
         * which is an array containing all of the `dids` that will be part of the conversation. The sender's
         * `did` will be added automatically.
         */
        let res = await orbis.createConversation(object)

        /** Check if conversation was created with success or not */
        if (res.status == 200) {
            console.log("Save this conversation_id to use in the following examples: ", res.doc)
            // alert("Save this conversation_id to use in the following examples: " + res.doc)
        } else {
            console.log("Error creating conversation: ", res)
            alert("Error creating conversation.")
        }
        setLoading(false)
        setBtnDisabled(false)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <div>
                <div className="flex justify-start p-2">
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
                {getForm()}
            </div>
        </>
    )
}
