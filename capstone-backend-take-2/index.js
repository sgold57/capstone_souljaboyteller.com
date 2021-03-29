const express = require('express');
const app = express();
const port = 8080;

const knex = require('knex');
const config = require('./knexfile').development;
const database = knex(config);

require('dotenv').config();

const axios = require('axios');

app.get("/api", (req, res) => {
  axios.post('https://sandbox.plaid.com/sandbox/public_token/create', {
    "client_id": process.env.CLIENT_ID,
    "secret": process.env.SECRET,
    "institution_id": "ins_3",
    "initial_products": ["auth"],
    "options": {
      "webhook": "https://www.genericwebhookurl.com/webhook"
    }
  })
    .then(function({ data: { public_token } }) {
      // handle success

      axios.post('https://sandbox.plaid.com/item/public_token/exchange', {
        "client_id": process.env.CLIENT_ID,
        "secret": process.env.SECRET,
        "public_token": public_token
      })
        .then(({ data: { access_token }}) => res.send({ access_token }))
        .catch(error => res.send({ error }))

    })
    .catch(function (error) {
      // handle error
      res.send({ error: error });
    })
    .then(function () {
      // always executed
    });
})

app.get('/users', (req, res) => {
  database('users')
    .then(users => res.json({ users }))
});

// const plaid = require('plaid');

app.listen(port, () => console.log(`listening on port ${port}`));