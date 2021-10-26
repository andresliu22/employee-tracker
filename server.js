const express = require('express');
const routes = require('./routes');
const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

app.listen(PORT, () => console.log(`Now listening to PORT: ${PORT}`));