import { useEffect, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

import { updateAdminRequest } from "../apiRequests/adminRequests";

const socket = io.connect('http://localhost:5000');

const Broadcast = () => {
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [broadcastStream, setBroadcastStream] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then(stream => setBroadcastStream(stream));

        socket.on("me", (id) => {
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
        console.warn("Id", res);
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
        <>
            <h2>Broadcasting... </h2>

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
        </>
    )
}

export default Broadcast;