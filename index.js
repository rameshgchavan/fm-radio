// Import express and middlewares
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotEnv = require("dotenv");


// Instance of express
const app = express();

// https server
const server = http.createServer(app);

// Creating io websocket connection
const io = new Server(server, { cors: true });

// Calling and emiting events on io "connection" event
io.on("connection", (socket) => {
	// Emiting "getBroadcastId" events on socket "requestBroadcast" event
	socket.on("requestBroadcast", (data) => {
		io.emit("getBroadcastId", data);
	});

	socket.on("braodcastId", data => {
		// Emiting "connectBroadcaster" events on socket "braodcastId" event to broadcaster socket id
		io.to(data.broadcastId).emit("connectBroadcaster", data)
	})

	// Emiting "broadcasterResponse" events on socket "respondListener" event
	socket.on("respondListener", (data) => {
		// Emiting "callAccepted" events on io "callAccepted" event to listener socket id
		io.to(data.listenerId).emit("broadcasterResponse", data.broadcasterSignal)
	});
})


// Import Routes
const userRoutes = require("./src/apiRoutes/userRoutes");

app.use(express.json({ limit: '200mb' }));
app.use("/users", userRoutes);

// Run frontend
app.use(express.static('./client/build')); //Note: Copy build folder of frontend and paste it into backend

// If request route miss matching then send index.html file in build directory
app.get('/*', (req, res) => {
	// root: __dirname is used to get rid off error 
	// 'path must be absolute or specify root to res.sendFile'
	res.sendFile('./client/build/index.html', { root: __dirname });
});

// Environment setting
dotEnv.config();
const PORT = process.env.PORT;

server.listen(PORT || 8080, () => console.log(`server is running on port ${PORT}`))
