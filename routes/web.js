const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const homeController = require('../app/http/controllers/homeController');
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const admin = require('../app/http/middlewares/admin');
const statusController = require('../app/http/controllers/admin/statusController');

const initRoutes = (app) => {
    app.get('/', homeController().index); //home route

    app.get('/cart', cartController().index); //cart route

    app.post('/update-cart', cartController().update); //update-cart route

    app.get('/login', guest, authController().login); //get login page route
    app.post('/login', authController().postLogin); //post login page route

    app.get('/register', guest, authController().register); //get register page route
    app.post('/register', authController().postRegister); //post register page route

    app.post('/logout', authController().logout); //post logout route 

    app.post('/orders', auth, orderController().store); //order controller route
    app.get('/customer/orders', auth, orderController().index) //get orders page

    // admin routes
    app.get('/admin/orders', admin, AdminOrderController().index);
    app.post('/admin/order/status',admin, statusController().update)

};

module.exports = initRoutes;