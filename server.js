const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

const app = express(); //creating an instance of express server

const PORT = process.env.PORT || 3000; //initialization of PORT

// routes
app.get('/', (req, res) => {
    res.render('home');
});



// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');



// starting the server
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});