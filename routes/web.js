const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middlewares/guest');

const initRoutes = (app) => {
    app.get('/', homeController().index); //home route

    app.get('/cart', cartController().index); //cart route

    app.post('/update-cart', cartController().update); //update-cart route

    app.get('/login', guest, authController().login); //get login page route
    app.post('/login', authController().postLogin); //post login page route

    app.get('/register', guest, authController().register); //get register page route
    app.post('/register', authController().postRegister); //post register page route

    app.post('/logout', authController().logout); //post logout route 

};

module.exports = initRoutes;