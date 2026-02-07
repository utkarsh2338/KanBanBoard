import { httpServer } from "./server.js";

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`WebSocket server is ready for connections`);
});