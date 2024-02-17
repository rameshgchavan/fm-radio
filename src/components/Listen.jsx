import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { IoIosPlayCircle } from "react-icons/io";

import Peer from "simple-peer";
import io from "socket.io-client";

// api request fuction
import { readBroadcastIdRequest } from "../apiRequests/usersAPIs/readUsersAPIs";

// This component listen the voice stream using websocket
// Users: pages/listenPage.js
const Listen = () => {
    // Initialized state hooks
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const userAudio = useRef();

    // This fuction plays received voice 
    // Callers: /play button 
    const handlePlay = async () => {
        // Getting voice stream of device
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

        // api request to get socket id from db
        const { broadcastId } = await readBroadcastIdRequest("vijaysinghthakurhnl@gmail.com");

        // Creating websocket connection
        const socket = io.connect("/"); //Taking proxy path from package.json 

        // Creating new peer
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        });

        // Emiting socket "callUser" event on peer "signal" event
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: broadcastId,
                signalData: data,
                from: socket.id
            })
        });

        // Setting stream to audio player on peer "stream" event
        peer.on("stream", (stream) => {
            userAudio.current.srcObject = stream;
        });

        // updating states and calling peer signal function on socket "callAccepted" event
        socket.on("callAccepted", (signal) => {
            setIsConnected(true);
            setConnecting(false);
            // peer signal function calling with argument broadcaster's signals
            peer.signal(signal);
        });
    }

    return (
        <>
            <Container className="d-flex flex-column justify-content-end align-items-center shadow rounded-3 text-center"
                style={{
                    backgroundSize: "cover",
                    backgroundImage: "url(/hingolifm.jpg)",
                    height: "95vh",
                    width: "22.5rem"
                }}
            >
                <div className="mb-1">
                    {
                        isConnected &&
                        <audio ref={userAudio} autoPlay controls />
                    }

                    {
                        connecting &&
                        <img src="/connecting.gif" alt="Connecting..." width="100" height="20" />
                    }

                    {
                        !isConnected && !connecting &&
                        <IoIosPlayCircle className="icon-hover" style={{ fontSize: "5rem", color: "yellow" }}
                            onClick={() => { handlePlay(); setConnecting(true); }}>
                        </IoIosPlayCircle>
                    }
                </div>

                <div className="mb-1" style={{ fontSize: "10px", color: "white" }}>
                    This app is developed by Ramesh Chavan <br />
                    Contact: 7020554505
                </div>
            </Container>
        </>
    )
}

export default Listen;