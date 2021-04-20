import axios from 'axios';
import Noty from 'noty';

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
    })
})