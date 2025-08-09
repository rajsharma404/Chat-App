import express from 'express';
import "dotenv/config";
import cors from 'cors'
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
// create express and http server
const app = express();
const server = http.createServer(app)

//iniatlize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

//store online users
export const userScoketMap = {};// {userId:socketId}

//sockect,io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("user connected", userId);

    if (userId) userScoketMap[userId] = socket.id;

    //emit online user to all connected client
    io.emit("getOnlineUsers", Object.keys(userScoketMap))

    socket.on("diconnect", () => {
        console.log("User disconnected", userId);
        delete userScoketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userScoketMap))
    })
})

// middleware section
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
// app.use(expres.json({ limit: "4" }));
// app.use(cors());


//route setup
app.use("/api/status", (req, res) => res.send("server is live..."))
app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

// connect to MongoDb
await connectDB();
if (process.env.NODE_ENV !=="production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log("srver is running on port" + PORT)
    })
}
//export server for vercel
export default server;