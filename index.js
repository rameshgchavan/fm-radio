// Import express and middlewares
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// // Create object of express
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: true });

io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from })
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
})


// Import Routes
const adminRoutes = require("./src/apiRoutes/adminRoute");

app.use(express.json({ limit: '200mb' }));
app.use("/admin", adminRoutes);

server.listen(5000, () => console.log("server is running on port 5000"))
