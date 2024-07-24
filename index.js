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

// Calling and emitting events on io "connection" event
io.on("connection", (socket) => {
	// Emitting "getBroadcastId" events on socket "requestBroadcast" event
	socket.on("requestBroadcast", (data) => {
		// Getting broadcaster id from frontend
		io.emit("getBroadcastId", data);
	});

	// Emitting "connectBroadcaster" events on socket "broadcastId" event to broadcaster socket id
	socket.on("broadcastId", data => {
		// Connecting to broadcaster with data
		io.to(data.broadcastId).emit("connectBroadcaster", data)
	})

	// Emitting "broadcasterResponse" events on socket "respondListener" event
	socket.on("respondListener", (data) => {
		// Responding to listener with broadcaster's signal
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
