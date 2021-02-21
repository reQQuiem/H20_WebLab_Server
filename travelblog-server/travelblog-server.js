const port = 4444;
const express = require('express')
const bodyParser = require('body-parser');
const server = express();
const TravelblogRepository = require('./travelblog.repository')


server.use(bodyParser.json({extended: false }));

server.post('/travelblog', (req, res) => {
    let repo = new TravelblogRepository();
    repo.createTravelblog()
        .then(id => res.status(201).send({ _id: id }))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

server.get('/travelblog/:id', (req, res) => {
    let repo = new TravelblogRepository();
    repo.getTravelblog(req.params.id)
        .then(obj => {
            console.log(obj);
            res.status(200).send(obj)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

server.get('/travelblogs', (req, res) => {
    let repo = new TravelblogRepository();
    repo.getTravelblogs()
        .then(obj => res.status(200).send(obj))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

server.delete('/travelblog', (req, res) => {
    let id = req.body._id;
    if (!id) {
        res.status(400).json({ error: 'Please include id' });
    }

    let repo = new TravelblogRepository();
    repo.deleteTravelblog(id)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(500));
});

server.put('/travelblog', (req, res) => {
    if (!req.body._id) {
        res.status(400).json({ error: 'Please include id' });
    }
    let repo = new TravelblogRepository();
    repo.updateTravelblog(req.body)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(500));
});

server.listen(port, () => {
    console.log('Web Programming lab server is running...');
});