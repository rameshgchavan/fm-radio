import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

import { updateAdminRequest } from "../apiRequests/adminRequests";

const socket = io.connect("/"); //Taking proxy path from package.json 

const Broadcast = () => {
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [broadcastStream, setBroadcastStream] = useState(false);
    const [logEvent, setLogEvent] = useState(["App lounched"]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then(stream => setBroadcastStream(stream));

        socket.on("me", (id) => {
            setLogEvent([...logEvent, `${id} socket generated`]);
            handleSetId(id);
        });

        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });
    }, [])

    const handleSetId = async (broadcastId) => {
        const res = await updateAdminRequest("email@gmail.com", { broadcastId });

        res === "Updated" ?
            setLogEvent((log) => [...log, "Broadcasting..."])
            : setLogEvent((log) => [...log, "Failled..."]);
    }

    useEffect(() => {
        receivingCall && answerCall();
        setReceivingCall(false);
    }, [receivingCall])

    const answerCall = () => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: broadcastStream
        });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.signal(callerSignal);
    }

    return (
        <div
            className="d-flex flex-column rounded-3 text-center"
            style={{
                backgroundImage: "url(/hingolifm-broadcast.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "77.5rem",
                width: "77.5rem",
                height: "33rem"
            }}
        >
            {<ul style={{ color: "yellow", fontSize: "10px" }} className=" text-start">
                {logEvent?.map((log, index) => <li key={index}>{log}</li>)}
            </ul>
            }

            {/* <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
                <button variant="contained" color="primary" >
                    Copy ID
                </button>
            </CopyToClipboard> <br /> */}

            {/* {receivingCall &&
                <button variant="contained" color="primary" onClick={answerCall}>
                    Answer
                </button>
            } */}

            {/* <button onClick={handleSetId}>Relay</button> */}
        </div >
    )
}

export default Broadcast;