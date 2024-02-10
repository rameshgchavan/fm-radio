import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

import { readAdminRequest } from "../apiRequests/adminRequests";

const socket = io.connect('http://localhost:5000');

const Listen = () => {
    const [me, setMe] = useState("");
    // const [idToCall, setIdToCall] = useState("");
    const userAudio = useRef();

    useEffect(() => {
        socket.on("me", (id) => {
            setMe(id);
        });
    }, []);

    const handlePlay = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

        const { broadcastId } = await readAdminRequest("email@gmail.com");

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: broadcastId,
                signalData: data,
                from: me
            })
        });

        peer.on("stream", (stream) => {
            userAudio.current.srcObject = stream;
        });

        socket.on("callAccepted", (signal) => {
            peer.signal(signal);
        });
    }

    // const handleGetId = async () => {
    //     const data = await readAdminRequest("email@gmail.com");

    //     setBroadcastId(data.broadcastId);
    // }

    return (
        <>
            <h1>HINGOLI FM</h1>

            <audio playsInline ref={userAudio} autoPlay controls /> <br />

            {/* <input type="text"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
            /> */}

            <button onClick={() => handlePlay()}>
                Play
            </button> <br />

            {/* <button onClick={handleGetId}>Get ID</button> */}
        </>
    )
}

export default Listen;