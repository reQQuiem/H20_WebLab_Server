const port = 4444;
const express = require('express')
const bodyParser = require('body-parser');
const server = express();

server.use(bodyParser.json({extended: false }));

server.post('/travelblog', (req, res) => {
    let repo = new TravelblogRepository();
    repo.createTravelblog()
        .then(id => res.status(201).send({ id: id }))
        .catch(err => {
            console.log(err);
            res.send(500);
        });
});

server.get('/travelblog/:id', (req, res) => {
    let repo = new TravelblogRepository();
    repo.getTravelblog(req.params.id)
        .then(obj => res.status(200).send(obj))
        .catch(err => {
            console.log(err);
            res.send(500);
        })
});

server.get('/travelblogs', (req, res) => {
    let repo = new TravelblogRepository();
    repo.getTravelblogs()
        .then(obj => res.status(200).send(obj))
        .catch(err => {
            console.log(err);
            res.send(500);
        })
});

server.delete('/travelblog', (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ error: 'Please include id' });
    }
    let repo = new TravelblogRepository();
    repo.deleteTravelblog(req.body.id)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(500));
});

server.put('/travelblog', (req, res) => {
    if (!req.body.id) {
        res.status(400).json({ error: 'Please include id' });
    }
    let repo = new TravelblogRepository();
    let travelblogBody = req.body;
    delete travelblogBody.id;
    repo.updateTravelblog(id, travelblogBody)
        .then(_ => res.sendStatus(200))
        .catch(_ => res.sendStatus(500));
});

server.listen(port, () => {
    console.log('Web Programming lab server is running...');
});
