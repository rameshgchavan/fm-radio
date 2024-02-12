import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

import { readAdminRequest } from "../apiRequests/adminRequests";
import { IoIosPlayCircle } from "react-icons/io";
import { Container } from "react-bootstrap";

const socket = io.connect('http://localhost:5000');

const Listen = () => {
    const [me, setMe] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
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
            setIsConnected(true);
            setConnecting(false);
            peer.signal(signal);
        });
    }

    // const handleGetId = async () => {
    //     const data = await readAdminRequest("email@gmail.com");

    //     setBroadcastId(data.broadcastId);
    // }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-end shadow rounded-3 text-center my-2"
                style={{
                    backgroundSize: "cover",
                    backgroundImage: "url(/hingolifm.jpg)",
                    height: "95vh",
                    width: "22.5rem"
                }}
            >
                {
                    isConnected &&
                    <audio className="mb-4" ref={userAudio} autoPlay controls />
                }

                {
                    connecting &&
                    <img className="mb-5" src="/connecting.gif" alt="Connecting..." width="100" height="20" />
                }

                {
                    !isConnected && !connecting &&
                    <IoIosPlayCircle className="icon-hover mb-4" style={{ fontSize: "5rem", color: "yellow" }}
                        onClick={() => { handlePlay(); setConnecting(true); }}>
                    </IoIosPlayCircle>
                }
            </Container>
        </>
    )
}

export default Listen;