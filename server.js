const WebSocket = require('ws');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Send heart animation trigger every few seconds
    const heartbeat = setInterval(() => {
        ws.send(JSON.stringify({
            type: 'heart',
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            position: Math.random() * 100
        }));
    }, 3000);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(heartbeat);
    });

    // Handle messages from client
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'love_click') {
            // Broadcast love click to all clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'love_reaction',
                        position: data.position
                    }));
                }
            });
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});