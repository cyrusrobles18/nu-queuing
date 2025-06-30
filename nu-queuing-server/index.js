require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const queueRoutes = require('./routes/queueRoutes');
const windowRoutes = require('./routes/windowRoutes');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  addTrailingSlash: false
});

// Make io accessible in controllers
app.set('io', io);

// Database Connection
connectDB();

app.use(express.json());

//Middleware
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/window', windowRoutes);


//Getting UI
// if (process.env.NODE_ENV === "production") {
//     const root = path.join(__dirname, '../nu-queueing-client/dist');
//     app.use(express.static(root));
//     app.all('/{*any}', (req, res, next) => {
//         res.sendFile(path.join(root, 'index.html'));
//     })
//     // app.get('*', (req, res) => {
//         // res.sendFile(path.join(root, 'index.html'));
//     // });
// }


// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));