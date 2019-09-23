const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRouter = require('../routers/auth/authRouter');
const authorization = require('../routers/auth/authorization');
const graphsRouter = require('../routers/graphs/graphs');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/graphs', authorization, graphsRouter);

server.get('/', (req, res) => {
    res.status(200).json("Server is up :)");
});

module.exports = server;