import { WebSocketServer, WebSocket } from "ws";
import {createServer} from "http";
import type { RoomObject } from "./types";

const server = createServer();
const wss = new WebSocketServer({
  server
});

//Let's break down the following line:
//- Map stores key-value pairs.
//- string represents a room ID.
//- Set<WebSocket> stores the connections belonging to that room.
//- Set prevents duplicate socket entries.

const rooms = new Map<string, Set<WebSocket>>();

function joinRoom(roomId: string, socket: WebSocket) {
  const id = String(roomId);

  if (!rooms.has(id)) {
    rooms.set(id, new Set());
  }

  rooms.get(id)!.add(socket);
  
}

function broadcastToRoom(roomId: string, data: RoomObject) {
  console.log(`function called 1st log`);
  const id = String(roomId);
  const clients = rooms.get(id);

  if (!clients) {
    console.log(`No clients found for room: ${roomId}`);
    return;
  }
  
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
  

}

wss.on("connection", (socket) => {
  console.log("A client connected!")

  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());
    //console.log(`room: ${data.roomId} data type: ${data.type}` );
    if(data.type === "join_room") {
      joinRoom(data.roomId, socket);
    }

    if(data.type === "typing") {
      //console.log(`room id of type: ${typeof data.roomId}`);
      broadcastToRoom(data.roomId, { type: "typing", username: data.username });
    }
    
  });

  socket.on("close", () => {
    console.log("A client disconnected!");
  });
});

server.on("request", (req, res) => {
  //check for POST and /broadcast endpoint
  if (req.method !== "POST" || req.url !== "/broadcast") {
    res.writeHead(404);
    res.end();
    return;
  }

  let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const { roomId, message, username } = JSON.parse(body);

        // Validate the incoming payload before broadcasting
        if (
          (typeof roomId !== "string" && typeof roomId !== "number") ||
          typeof message !== "string"
        ) {
          res.writeHead(400);
          res.end("Invalid payload");
          return;
        }

        broadcastToRoom(String(roomId), {
          type: "new_message",
          message: message,
          username: username || "Unknown"
        });

        res.writeHead(200).end("Broadcast request received");

      } catch (error) {
        console.error("Error parsing broadcast request body:", error);
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });

    
});

// Starts listening for connections on port 8080 and keeps Node.js running. 
//if no server.listen() is called, the server will not start and Node.js will exit immediately after executing the script.
server.listen(8080, () => {
  console.log("WebSocket server running on port 8080");
});


