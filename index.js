// Import express and middlewares
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotEnv = require("dotenv");


// // Create object of express
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: true });

io.on("connection", (socket) => {
	console.log("connection estalished by id ", socket.id)
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
