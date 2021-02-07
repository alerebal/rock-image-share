// require('dotenv').config();
const express = require('express');

const config = require('./server/config');



// Database
require('./database');

const app = config(express())

const port = app.get('port')

app.listen(port, () => {
    console.log(`Server on port ${port}`)
})