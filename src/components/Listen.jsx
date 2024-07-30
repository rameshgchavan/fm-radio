import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import { IoIosPlayCircle } from "react-icons/io";

import Peer from "simple-peer";
import io from "socket.io-client";

// api request function
import { readBroadcastRequest } from "../apiRequests/usersAPIs/readUsersAPIs";

// This component listen the voice stream using websocket
// Users: pages/listenPage.js
const Listen = () => {
    // Initialized state hooks
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [status, setStatus] = useState(true);
    const userAudio = useRef();

    // This function plays received voice 
    // Callers: /play button 
    const handlePlay = async () => {
        // Getting voice stream of device
        const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                autoGainControl: false,
                channelCount: 2,
                echoCancellation: false,
                latency: 0,
                noiseSuppression: false,
                sampleRate: 48000,
                sampleSize: 24,
                volume: 1.0
            }
        });

        // api request to get socket id from db
        const { broadcastId, isLogged } = await readBroadcastRequest("vijaysinghthakurhnl@gmail.com");

        setStatus(isLogged);

        // Setting time out if broadcaster is offline
        // Waiting for 10 sec to connect broadcaster
        const timeoutId = setTimeout(() => {
            setIsConnected(false);
            setConnecting(false);
            setStatus(false);
        }, 10000)

        if (isLogged) {
            // Creating websocket connection
            const socket = io.connect("/"); //Taking proxy path from package.json 

            // Creating new peer
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream
            });

            // Emitting socket "requestBroadcaster" event on peer "signal" event
            peer.on("signal", (data) => {
                socket.emit("requestBroadcaster", {
                    // broadcastId,
                    listenerId: socket.id,
                    listenerSignal: data
                });

                console.warn("signal");
            });

            // Setting stream to audio player on peer "stream" event
            peer.on("stream", (stream) => {
                userAudio.current.srcObject = stream;
                console.warn("stream");
            });

            // updating states and calling peer signal function on socket "broadcasterResponse" event
            socket.on("broadcasterResponse", (broadcasterSignal) => {
                // Stopping timeOut function
                clearTimeout(timeoutId);

                setIsConnected(true);
                setConnecting(false);
                // peer signal function calling with argument broadcaster's signals
                peer.signal(broadcasterSignal);

                console.warn("broadcasterResponse");
            });
        }
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
                        connecting && status &&
                        <img src="/connecting.gif" alt="Connecting..." width="100" height="20" />
                    }

                    {
                        !status &&
                        < div style={{ fontSize: "12px", color: "yellow" }}>Broadcaster is offline</div>
                    }

                    {
                        !isConnected && !connecting &&
                        <IoIosPlayCircle className="icon-hover" style={{ fontSize: "5rem", color: "yellow" }}
                            onClick={() => { handlePlay(); setConnecting(true); }}>
                        </IoIosPlayCircle>
                    }
                </div>

                <div className="mb-1" style={{ fontSize: "8.5px", color: "white" }}>
                    This app is developed by Ramesh Chavan, contact: 7020554505
                </div>
            </Container >
        </>
    )
}

export default Listen;