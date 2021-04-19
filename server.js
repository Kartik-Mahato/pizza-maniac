const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const app = express(); //creating an instance of express server

const PORT = process.env.PORT || 3000; //initialization of PORT

// assets/static files
app.use(express.static('public'));


// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/cart', (req, res) => {
    res.render('customers/cart');
});

app.get('/login', (req, res) => {
    res.render('auth/login');
});
app.get('/register', (req, res) => {
    res.render('auth/register');
});


// starting the server
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});