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
                const result = await order.save();
                Order.populate(result, { path: 'customerId' }, (err, res) => {
                    req.flash('success', 'Order Placed Successfully!!!');
                    delete req.session.cart;
                    // emit
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', res);
                });
                return res.redirect('/customer/orders');
            } catch (error) {
                req.flash('error', 'Something went wrong!!!')
                return res.redirect('/cart')
            }


        },
        async index(req, res, next) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render('customers/orders', { orders, moment });
        },
        async show(req, res, next) {
            try {
                const order = await Order.findById(req.params.id);

                //authorize user
                if (req.user._id.toString() === order.customerId.toString()) {
                    return res.render('customers/singleOrder', { order });
                }
                res.redirect('/');
            } catch (error) {
                console.log(error);
                res.redirect('/');

            }
        }
    }
}

module.exports = orderController;