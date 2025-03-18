import { injectable } from "inversify";
import { Server as WebSocketServer, WebSocket } from "ws";
import { createServer, Server as HTTPServer } from "http";
import { Application } from "express";

@injectable()
export class WebSocketService {
  private wss: WebSocketServer;
  private server: HTTPServer;

  initialize(app: Application) {
    // Create an HTTP server and attach Express to it
    this.server = createServer(app);

    // Attach WebSockets to the HTTP server
    this.wss = new WebSocketServer({ server: this.server });

    // Start the server
    this.server.listen(3000, () => {
      console.log("✅ HTTP & WebSocket Server running on http://localhost:3000");
    });

    // Handle WebSocket connections
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("✅ New WebSocket connection established!");

      ws.on("message", (message) => {
        console.log("📩 Received:", message.toString());

        // Echo message back to the client
        
      });
    });
  }
  sendMessage(data: string) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}
