import app from './app.js';
import http from "http";
import setupSocket from "./socket/socket.js";  // Import the socket setup

const server = http.createServer(app);

// Initialize Socket.io
setupSocket(server);

const PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});