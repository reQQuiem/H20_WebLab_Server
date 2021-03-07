const port = 4444;
const express = require('express')
const bodyParser = require('body-parser');
const server = express();
const TravelblogRepository = require('./travelblog.repository');
const jwt = require("jsonwebtoken");
const tokenSecret = process.env.TOKEN_SECRET;
require("dotenv").config();

var cors = require('cors');

server.use(cors()); // res.header({ 'Access-Control-Allow-Origin': 'http://localhost:4200'})
server.use(bodyParser.json({extended: false}));
server.use(express.json());

// TODO: nur für Testzwecke
const posts = [
    {
        username: 'Colin',
        title: 'Post 1'
    },
    {
        username: 'Mischa',
        title: 'Post 2'
    }
]

// TODO: nur für Testzwecke
server.get('/login', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token
    jwt.verify(token, tokenSecret, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}


server.post('/travelblog', authenticateToken, (req, res) => {
    let repo = new TravelblogRepository();
    repo.createTravelblog(req.body, req.user.name) // TODO: userId instead of name
        .then(id => res.status(201).send({_id: id}))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

server.get('/travelblog/:id', (req, res) => {
    let repo = new TravelblogRepository();
    repo.getTravelblog(req.params.id)
        .then(obj => {
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

server.delete('/travelblog/:id', authenticateToken, (req, res) => {
    let id = req.params.id;
    if (!id) {
        res.status(400).json({error: 'Please include id'});
    }

    let repo = new TravelblogRepository();
    repo.deleteTravelblog(id, req.user.name)
        .then(x => {
            if (x.result.n < 1)
                res.sendStatus(204);
            else
                res.status(202).send( {message: 'Accepted'} );
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

server.put('/travelblog', authenticateToken, (req, res) => {
    if (!req.body._id) {
        res.status(400).json({error: 'Please include id'});
    }
    let repo = new TravelblogRepository();
    repo.updateTravelblog(req.body, req.user.name)
        .then(x => {
            if (x.result.n < 1)
                res.sendStatus(401);
            else
                res.sendStatus(200);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

server.listen(port, () => {
    console.log('Travelblog-Server is running...');
});
