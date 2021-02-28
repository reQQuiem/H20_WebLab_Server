const port = 5555;
const UsersRepository = require('./user.repository')
const express = require('express')
const bodyParser = require('body-parser');
const server = express();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const tokenSecret = process.env.TOKEN_SECRET;

server.use(bodyParser.json({extended: false }));

server.post('/users', async (req, res) => {
    try {
        let repo = new UsersRepository();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = {
            name: req.body.name,
            password: hashedPassword,
            blogIds: []
        }
        repo.createUser(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

server.post('/users/login', async (req, res) => {
    let repo = new UsersRepository();
    const user = repo.getUser(req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not Allowed');
        }

    } catch {
        res.status(500).send();
    }
});

server.get('/users', (req, res) => {
    let repo = new UsersRepository();
    repo.getUsers()
        .then(obj => res.status(200).send(obj))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
})

server.post('/login', async (req, res) => {
    let repo = new UsersRepository();
    const user = await repo.getUser(req.body.name.trim());
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const username = req.body.name;
            const user = { name: username }
            const accessToken = generateAccessToken(user);
            res.json( {accessToken: accessToken} );
        } else {
            res.send('Not Allowed');
        }

    } catch {
        res.status(500).send();
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, tokenSecret, { expiresIn: '30m' });
}

server.listen(port, () => {
    console.log('Web Programming lab server is running...');
});
