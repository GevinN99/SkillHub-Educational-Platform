const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');

const app = express();
const proxy = httpProxy.createProxyServer();

require('dotenv').config();
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const learnerServiceUrl = 'http://localhost:8073';
const instructorServiceUrl = 'http://localhost:8072';
const adminServiceUrl = 'http://localhost:8071';

// Proxy configuration
const proxyOptions = {
    changeOrigin: true,
};

// Proxy requests based on path
app.use('/api/learner', (req, res) => {
    proxy.web(req, res, { target: learnerServiceUrl, ...proxyOptions }, error => {
        console.error('Proxy error:', error);
        res.status(500).send('Proxy error occurred');
    });
});

app.use('/api/instructor', (req, res) => {
    proxy.web(req, res, { target: instructorServiceUrl, ...proxyOptions }, error => {
        console.error('Proxy error:', error);
        res.status(500).send('Proxy error occurred');
    });
});

app.use('/api/admin', (req, res) => {
    proxy.web(req, res, { target: adminServiceUrl, ...proxyOptions }, error => {
        console.error('Proxy error:', error);
        res.status(500).send('Proxy error occurred');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const port = process.env.PORT || 8075;

app.listen(port, () => console.log(`Gateway up and running on port ${port}!`));
