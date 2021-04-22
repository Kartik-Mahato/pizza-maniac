const Order = require("../../../models/order")

function AdminOrderController() {
    return {
        index(req, res, next) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((error, orders) => {
                if(req.xhr) {
                    return res.json(orders)
                }

                return res.render('admin/orders');
            });
        }
    }
}

module.exports = AdminOrderController