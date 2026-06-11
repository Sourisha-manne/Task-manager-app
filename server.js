const express = require('express');
const cors = require('cors');
require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const server = http.createServer(app);

// SOCKET SETUP
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// SOCKET CONNECTION
io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on('taskUpdated', () => {
        io.emit('refreshTasks'); // send to all users
    });
});

app.get('/', (req, res) => {
    res.send("Task Manager Running");
});

server.listen(5000, () => {
    console.log('Server Running On Port 5000');
});