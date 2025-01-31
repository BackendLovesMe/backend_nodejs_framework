import redisClient from "./Redis";
import WebSocket from "ws";
const clients = new Map<string, WebSocket>(); // Store connected drivers

export function setupWebSocket(wss:any) {

  wss.on("connection", (ws, req) => {
    console.log("🔹 Driver connected");

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "register" && data.driverId) {
          clients.set(data.driverId, ws);
          console.log(`✅ Driver ${data.driverId} registered.`);
        }

        if (data.type === "location_update" && data.driverId && data.lat && data.lng) {
          // 🔹 Store driver location inside Redis
          redisClient.set(`driver:${data.driverId}`, JSON.stringify({ lat: data.lat, lng: data.lng }));
          console.log(`📍 Updated location for ${data.driverId}: ${data.lat}, ${data.lng}`);
        }
      } catch (error) {
        console.error("⚠️ Error processing message:", error);
      }
    });

    ws.on("close", () => {
      console.log("❌ Driver disconnected");
      clients.forEach((client, driverId) => {
        if (client === ws) clients.delete(driverId);
      });
    });
  });
}