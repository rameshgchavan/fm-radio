import { useRef, useState } from "react";
import Peer from "simple-peer";

import { readBroadcastIdRequest } from "../apiRequests/usersAPIs/readUsersAPIs";
import { IoIosPlayCircle } from "react-icons/io";
import { Container } from "react-bootstrap";

import io from "socket.io-client";
const socket = io.connect("/"); //Taking proxy path from package.json 

const Listen = () => {
    const [me, setMe] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    // const [idToCall, setIdToCall] = useState("");
    const userAudio = useRef();

    socket.on("connect", () => {
        setMe(socket.id);
    });

    const handlePlay = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

        const { broadcastId } = await readBroadcastIdRequest("vijaysinghthakurhnl@gmail.com");

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