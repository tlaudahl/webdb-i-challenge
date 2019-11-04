const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', (req, res) => {
    db.select('*').from('accounts')
    .then(actions => res.status(200).json(actions))
    .catch(err => res.status(500).json({ error: "Could not get the actions from the DB"}))
})

server.get('/accounts/:id', (req, res) => {
    db.select('*').from('accounts').where({ id: req.params.id })
    .then(account => {
        if(account) {
            res.status(200).json(account)
        } else {
            res.status(404).json({ error: "Account with that ID could not be found"})
        }
    })
    .catch(err => res.status(500).json({ error: "Could not get the account from the DB"}))
})

server.post('/accounts', (req, res) => {
    db.insert(req.body, 'id')
    .into('accounts')
    .then(ids => res.status(201).json(ids))
    .catch(err => res.status(500).json({ error: "Failed to add to the database" }))
})

server.put('/accounts/:id', (req, res) => {
    const changes = req.body;
    knex('accounts').where({ id: req.params.id }).update(changes)
    .then(count => res.status(200).json(count))
    .catch(err => res.status(500).json({ error : "Could not update that account" }))
})

server.delete('/account/:id', (req, res) => {
    knex('accounts').where({ id: req.params.id }).del()
    .then(count => res.status(200).json(count))
    .catch(err => res.status(500).json({ error: "Could not delete the account from the database" }))
})

module.exports = server;