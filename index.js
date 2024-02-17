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
	// console.log(`${socket.id} socket connected`);

	// socket.emit("me", socket.id)

	// Emiting "callUser" events on socket "callUser" event
	socket.on("callUser", (data) => {
		// Emiting "callUser" events on io "callUser" event to broadcaster socket id
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from })
	});

	// Emiting "callAccepted" events on socket "answerCall" event
	socket.on("answerCall", (data) => {
		// Emiting "callAccepted" events on io "callAccepted" event to listener socket id
		io.to(data.to).emit("callAccepted", data.signal)
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
