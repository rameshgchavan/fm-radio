import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import Peer from "simple-peer";

// api request fuction
import { updateUserRequest } from "../apiRequests/usersAPIs/updateUserAPIs";

// This component broadcast the voice stream using websocket
// Users: pages/broadcastPage.js
const Broadcast = () => {
    // Initialized state hooks
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [broadcastStream, setBroadcastStream] = useState(false);
    const [logEvent, setLogEvent] = useState(["App lounched"]);

    // Getting login user details store
    const { scrutinizedUser } = useSelector(state => state.usersReducer);
    // Getting socket from store
    const { socket } = useSelector(state => state.socketReducer);

    useEffect(() => {
        // Getting voice stream of device
        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then(stream => setBroadcastStream(stream));

        // Updating log evenets
        setLogEvent([...logEvent, `${socket.id} id generated`]);
        // Fucntion calling to set socket id in db
        handleSetId(socket.id);

        // Updating states on socket "callUser" event
        socket.on("callUser", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });
    }, [socket])

    // This fuction set socket id into db
    // Callers: /useEffect 
    const handleSetId = async (broadcastId) => {
        // api request to set socket id into db
        const res = await updateUserRequest(scrutinizedUser, { email: scrutinizedUser.email }, { broadcastId });

        // Updating log state hook
        res.code === 202 ?
            setLogEvent((log) => [...log, "Broadcasting..."])
            : setLogEvent((log) => [...log, "Failled..."]);
    }

    useEffect(() => {
        // Fuction calling if receivingCall is true
        receivingCall && answerCall();
        // Updating state hook
        setReceivingCall(false);
    }, [receivingCall])

    const answerCall = () => {
        // Creating new peer
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: broadcastStream
        });

        // Emiting socket "answerCall" event on peer "signal" event
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        // peer signal function calling with argument listener's signals
        peer.signal(callerSignal);
    }

    return (
        <Container
            className="d-flex flex-column rounded-3 text-center"
            style={{
                backgroundImage: "url(/hingolifm-broadcast.jpg)",
                backgroundRepeat: "no-repeat",
                // backgroundSize: "77.5rem",
                // width: "77.5rem",
                height: "33rem"
            }}
        >
            {/* Printing logs */}
            {<ul style={{ color: "yellow", fontSize: "10px" }} className=" text-start">
                {logEvent?.map((log, index) => <li key={index}>{log}</li>)}
            </ul>
            }
        </Container >
    )
}

export default Broadcast;