import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import Peer from "simple-peer";

// api request function
import { updateUserRequest } from "../apiRequests/usersAPIs/updateUserAPIs";

// This component broadcast the voice stream using websocket
// Users: pages/broadcastPage.js
const Broadcast = () => {
    // Initialized state hooks
    const [receivedConnection, setReceivedConnection] = useState(false);
    const [listener, setListener] = useState();
    const [broadcastStream, setBroadcastStream] = useState(false);
    const [logEvent, setLogEvent] = useState(["App launched"]);

    // Getting login user details store
    const { scrutinizedUser } = useSelector(state => state.usersReducer);
    // Getting socket from store
    const { socket } = useSelector(state => state.socketReducer);

    // This function set socket id into db
    // Callers: /useEffect 
    const handleSetId = async (broadcastId) => {
        // api request to set socket id into db
        const res = await updateUserRequest(scrutinizedUser, { email: scrutinizedUser.email }, { broadcastId, isLogged: true });

        // Updating log state hook
        res.code === 202 ?
            setLogEvent((log) => [...log, "Broadcasting..."])
            : setLogEvent((log) => [...log, "Failed..."]);
    }

    // This generates media stream, sends socket id to backend and sets socket id in db
    useEffect(() => {
        // Getting voice stream of device
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                autoGainControl: false,
                channelCount: 2,
                echoCancellation: false,
                latency: 0,
                noiseSuppression: false,
                sampleRate: 48000,
                sampleSize: 16,
                volume: 1.0
            }
        })
            .then(stream => setBroadcastStream(stream));

        // Updating log events
        setLogEvent([...logEvent, `${socket.id} id generated`]);
        // Function calling to set socket id in db
        handleSetId(socket.id);

        // // Emitting socket "broadcastId" event on socket "getBroadcastId" event
        // // Sending broadcast id to backend
        // socket.on("getBroadcastId", data => {
        //     console.warn("getBroadcastId", socket.id);

        //     socket.emit("broadcastId", { broadcastId: socket.id, ...data });
        // });

        // Updating states on socket "connectBroadcaster" event
        socket.on("connectBroadcaster", (data) => {
            setReceivedConnection(true);
            setListener({ id: data.listenerId, signal: data.listenerSignal })

            console.warn("connectBroadcaster");
        });
    }, [socket]);

    const handleTabClosing = async () => {
        await updateUserRequest(scrutinizedUser, { email: scrutinizedUser.email }, { isLogged: false });
    }

    const alertUser = (event) => {
        event.preventDefault();
        event.returnValue = '';
    }

    // This sets isLogged to flase on browser close event
    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)
        window.addEventListener('unload', handleTabClosing)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
            window.removeEventListener('unload', handleTabClosing)
        };
    }, []);

    // This calls acceptConnection on receivedConnection true
    useEffect(() => {
        // function calling if receivingCall is true
        receivedConnection && acceptConnection();
        // Updating state hook
        setReceivedConnection(false);
    }, [receivedConnection])

    // This functions creates new peer and send listener id and signal to backend
    const acceptConnection = () => {
        console.warn("acceptConnection function");
        // Creating new peer
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: broadcastStream
        });

        // Emitting socket "answerCall" event on peer "signal" event
        // Sending listener id and broadcaster signal to backend
        peer.on("signal", (data) => {
            socket.emit("respondListener", { listenerId: listener.id, broadcasterSignal: data });
            console.warn("signal");
        });

        // peer signal function calling with argument listener's signals
        peer.signal(listener.signal);
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