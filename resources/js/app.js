let socket = io();
import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';
import initAdmin from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cart-counter');

function updateCart(pizza) {
    axios.post('/update-cart', pizza)
        .then(res => {
            cartCounter.innerText = res.data.totalQty;
            new Noty({
                type: 'success',
                timeout: '1000',
                progressBar: false,
                text: 'Item added to Cart!!!'
            }).show();

        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: '1000',
                progressBar: false,
                text: 'Oops! Something went wrong...'
            }).show();
            console.log(err);
        });
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let pizza = JSON.parse(btn.dataset.pizza);

        updateCart(pizza);
    });
});

//remove alert message
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
};




// change order status
let statuses = document.querySelectorAll('.status-line');
let hiddenInput = document.querySelector('#hidden-input');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order)

let time = document.createElement('small');

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('completed');
        status.classList.remove('current');
    })
    let step = true;
    statuses.forEach((status) => {
        let data = status.dataset.status;
        if (step) {
            status.classList.add('completed');
        }
        if (data === order.status) {
            step = false
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    });
}

updateStatus(order);

// socket

if (order) {
    socket.emit('join', `order_${order._id}`);
}

let adminPath = window.location.pathname;
if (adminPath.includes('admin')) {
    initAdmin();
    socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updateAt = moment().format();
    updatedOrder.status = data.status;

    updateStatus(updatedOrder);

    new Noty({
        type: 'success',
        timeout: '1000',
        progressBar: false,
        text: 'Order updated!!!'
    }).show();

});