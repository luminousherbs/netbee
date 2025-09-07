import { host } from "../config/network.js";

import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";

// Recreate __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json()); // parse json
app.use(express.static(path.join(__dirname, ".."))); // serve from root

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = {};
const connectionPhrase = "pls can i join the hive";

console.log("Queen ready");

function broadcast(responseType = "other", responseContent = "bzz") {
    for (const [name, ws] of Object.entries(clients)) {
        sendResponse(ws, responseType, responseContent)
    }
}

function sendResponse(ws, responseType = "other", responseContent = "bzz") {
    const message = {
        type: responseType,
        content: responseContent,
    }
    console.log(`${message.type}: ${message.content.text ?? ""}`);
    ws.send(JSON.stringify(message));
}

wss.on("connection", (ws) => {
    console.log("connected to worker");
    ws.on("message", (data) => {

        const message = JSON.parse(data.toString());

        switch (message.type) {

            case "join":
                console.log(`${message.name} wants to join`);
                if (clients[message.name]) {
                    sendResponse(ws, "error", {text: "that name is already in use"});
                    return;
                }
                clients[message.name] = ws;
                sendResponse(ws, "success", {text: "you have joined the hive"});
                broadcast("add user", {name: message.name});

                break;
            
            case "get users":
                sendResponse(ws, "get users", {users: Object.keys(clients)});
                break;
            
            case "send":
                console.log(`${message.name} is sending a message to ${message.recipient}`);
                console.log(`${message.text}`);
                const userMessage = {
                    type: "send",
                    text: message.text,
                    recipient: message.recipient,
                    sender: message.name,
                };

                if (clients[userMessage.recipient]) {
                    clients[userMessage.recipient].send(JSON.stringify(userMessage));
                    sendResponse(ws, "success", "message sent");
                } else {
                    sendResponse(ws, "error", {text: `there is no bee named ${userMessage.recipient}`});
                }
                break;
            
            default:
                sendResponse(ws, "error", {text: "your message was not processed properly"});
                break;

        }

    });
    ws.on("close", () => {
        // O(rubbish)
        const user = Object.keys(clients).find(k => clients[k] === ws);
        console.log(`${user} has disconnected.`);
        broadcast("remove user", {name: user});
        delete clients[user];
    });
});

server.listen(host.port, () => {
    console.log(`Open on localhost:${host.port}`);
});