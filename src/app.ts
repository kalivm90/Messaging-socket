import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import {MongoInit, User} from "messaging-models/src/index";

const app = express();


const mongoURI = process.env.MONGODB_URI || "";
const conn = new MongoInit(mongoURI, "SockMessage");

app.use(cors({
    origin: process.env.CLIENT_DOMAIN ?? "http://localhost:3000",
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Sessions
const sessionExperation = 1000 * 60 * 60 * 24; // 1 day 

const sessionStore = MongoStore.create({
    mongoUrl: mongoURI,
    dbName: 'sessions',
    autoRemove: 'native',
    ttl: sessionExperation,
})

app.use(session({
    secret: "some secret", // Change this later, or delete it to auto generate key
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: sessionExperation
    }
}));

export default app;





// import * as http from "http";
// import { setupWebSocket } from "./sockets/sockets";
// import {MongoInit, User} from "messaging-models/src/index";
// import dotenv from "dotenv";
// dotenv.config();

// // const webSocketsServerPort = 8000;
// const webSocketsServerPort = process.env.PORT || 8000

// // Create an HTTP server
// const server = http.createServer();

// setupWebSocket(server);

// // Connect to DB
// const mongoURI = process.env.MONGODB_URI || "";

// const conn = new MongoInit(mongoURI, "SockMessage");


// // Listen for errors on the server
// server.on('error', (error: NodeJS.ErrnoException) => {
//     console.error('Server error:', error.message);
// });

// // Listen for the 'listening' event to know when the server has started successfully
// server.listen(webSocketsServerPort, () => {
//     console.log(`Server is listening on port ${webSocketsServerPort}`);
// });

// // Handle process termination signals
// process.on('SIGINT', () => {
//     console.log('Received SIGINT. Shutting down gracefully...');
//     server.close(() => {
//         console.log('Server closed. Exiting process.');
//         process.exit(0);
//     });
// });

// // Kill process
// process.on('SIGTERM', () => {
//     console.log('Received SIGTERM. Shutting down gracefully...');
//     server.close(() => {
//         console.log('Server closed. Exiting process.');
//         process.exit(0);
//     });
// });
