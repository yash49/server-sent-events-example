const express = require("express");
const path = require("path");
const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "public")));

app.get("/events", (req, res) => {
  const lastEventId = parseInt(req.headers["last-event-id"], 10);
  console.log(`Last-Event-ID from client: ${lastEventId || "None"}`);

  let eventId = lastEventId ? lastEventId : 0;

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log("Client connected for SSE. Starting stream...");

  // Send a new event every 2 seconds
  const intervalId = setInterval(() => {
    eventId++;
    const data = `Hello from server - ${eventId}`;
    res.write(`id: ${eventId}\n`);
    res.write(`data: ${data}\n\n`); // Two newlines to separate events

    console.log(`Sent event ${eventId}`);
  }, 2000);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
    console.log("Client disconnected from SSE stream.");
    res.end(); // End the response
  });
});

app.listen(port, () => {
  console.log(`SSE server running on http://localhost:${port}`);
});
