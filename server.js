const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const Emitter = require('events');

require('dotenv').config();

const app = express(); //creating an instance of express server

const PORT = process.env.PORT || 3000; //initialization of PORT

// database configuration
const url = process.env.DB_URI;
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).catch(err => {
    console.log('Connection failed', err);
});

// session store configuration
let mongoStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'sessions'
});

// event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24hrs
}));

// passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// globals
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

// assets/static files
app.use(express.static('public'));


// set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// importing routes
require('./routes/web')(app);

// starting the server
const server = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
});

// socket configuration

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('join', (orderId) => {
        socket.join(orderId);
    });
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
});