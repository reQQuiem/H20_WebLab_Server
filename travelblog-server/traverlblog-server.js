const http = require('http');

const server = http.createServer((req, res) => {
    res.end('hello web programming lab!');
});

server.listen(4444, () => {
    console.log('Web Programming lab server is running...');
});
