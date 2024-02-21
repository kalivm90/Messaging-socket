import { server as WebSocketServer, request as WebSocketRequest, connection as WebSocketConnection, Message } from "websocket";
import {Server} from "http"

// Models
import {User} from "messaging-models/src/index"

// Keep track of connected clients using a dictionary
const clients: { [key: string]: WebSocketConnection } = {};

// Function to generate a unique user ID
const getUniqueID = (): string => {
    const s4 = (): string => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + "-" + s4();
};

// Handle incoming messages from clients
const handleMessage = (message: Message, connection: WebSocketConnection): void => {
    if (message.type === "utf8") {
        console.log("MESSAGE: ", message);
        console.log("Received Message:", message.utf8Data);

        // Send the received message to all connected clients
        Object.keys(clients).forEach((key) => {
            clients[key].sendUTF(message.utf8Data);
        });
    }
};

// Handle new WebSocket connection requests
const handleNewConnection = (request: WebSocketRequest): void => {
    const userID = getUniqueID();
    console.log(`${new Date()} Received a new connection from origin ${request.origin}`);

    // Accept the connection request and add the connection to the clients dictionary
    const connection = request.accept(null, request.origin) as WebSocketConnection;
    clients[userID] = connection;
    // console.log(`Connected ${userID} in ${Object.getOwnPropertyNames(clients).join(', ')}`);

    // Set up a message handler for the connection
    connection.on('message', (message: Message) => {
        handleMessage(message, connection)
    });
};

// Set up WebSocket handling by attaching it to the provided HTTP server
const setupWebSocket = (httpServer: Server): void => {
    const wsServer = new WebSocketServer({ httpServer });

    // Set up the event listener for new connection requests
    wsServer.on("request", handleNewConnection);
};

export {
    setupWebSocket,
    handleNewConnection,
};