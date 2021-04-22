const moment = require('moment');
const Order = require('../../../models/order');

function orderController() {
    return {
        async store(req, res, next) {
            // validate request
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required!!!');
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });

            try {
                await order.save();
                req.flash('success', 'Order Placed Successfully!!!');
                delete req.session.cart
                return res.redirect('/customer/orders');
            } catch (error) {
                req.flash('error', 'Something went wrong!!!')
                return res.redirect('/cart')
            }


        },
        async index(req, res, next) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders', { orders, moment });
        }
    }
}

module.exports = orderController;