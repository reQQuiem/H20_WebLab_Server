const port = 4444;
const express = require('express')
const bodyParser = require('body-parser');
const server = express();

server.use(bodyParser.json({extended: false }));

server.post('/blogpost', (req, res) => {
    res.status(201);
    res.send('POST worked, returning generated id');
});

server.get('/blogpost/:id', (req, res) => {
    res.status(200).send('Trying to get Travelblog with id: ' + req.params.id);
});

server.get('/blogposts', (req, res) => {
    res.status(200).send('Getting all travelblogs');
});

server.delete('/blogpost', (req, res) => {
    console.log(req.body);
    if (!req.body.id) {
        res.status(400).json({ error: 'Please include id' });
    }
    res.status(204).send();
});

server.put('/blogpost', (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ error: 'Please include id' });
    }
    res.status(204).send();
});

server.listen(port, () => {
    console.log('Web Programming lab server is running...');
});
