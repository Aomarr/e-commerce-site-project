let cart = JSON.parse(localStorage.getItem("cart")) 
cartNumber()
summation()
showcart()
searchProducts()
function showcart () {
    const cartproducts = document.querySelector(".cart-products")
    cartproducts.innerHTML = ``
    cart.forEach((element) => {
       cartproducts.innerHTML += `
<div class="item d-flex py-3 gap-2 gap-md-3">
    <div class="item-image">
    <img src="${element.image}" alt="product image">
    </div>
    <div class="item-info d-flex flex-column justify-content-between">
    <h3 class="item-name fs-6 fs-md-4"><a class="single-link" href="singular.html?id=${element.id}">${element.title}</a></h3>
    <p class="p-0 m-0 priced"><span class="item-price">${(
        element.price -
        element.price * (element.sale_percentage / 100)
      ).toFixed(0)}</span>$</p>
    </div>
    <div class="item-actions ms-auto d-flex flex-column justify-content-between">
    <span class="delete d-flex justify-content-end p-2 align-self-end" role="button" onclick="removeCartItem(${element.id})">
        <img src="./icons/remove.svg" alt="remove item" class="img-fluid">
    </span>
    <div class="item-options d-flex flex-nowrap">
        <span class="decrease" role="button">-</span>
        <span class="quantity">${element.quantity}</span>
        <span class="increase" role="button">+</span>
    </div>
    </div>
</div>
       `
    });
    removeItem()
    increase(cart)
    decrease(cart)
}

function removeCartItem (value) {
    let match = cart.find((e) => e.id == value)
    let place = cart.indexOf(match)
    cart.splice(place, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    removeItem()
    cartNumber()
    summation()
}


function removeItem () {
    const remove = document.querySelectorAll(".delete")
    remove.forEach(element => {
        element.addEventListener("click", function (e) {
            e.target.closest(".item").remove()
            showcart()
        })
    });
}



function cartNumber () {
cartCount = document.querySelector(".cart-count")
cartCount.textContent = cart.length
 }

function summation () {
    const summed = document.querySelector(".cart-sum")
    const finalPrice = document.querySelector(".final-price")
    const tax = document.querySelector(".tax-value")
    const shipping = document.querySelector(".shipping-value")
    let grouped = 0
    cart.forEach(element => {
    let numed = parseInt((element.price - (element.price*(element.sale_percentage / 100))).toFixed(0))
    grouped += numed * element.quantity   
    });
    summed.textContent = grouped 
    if (grouped !== 0) {
        tax.textContent = 30
        shipping.textContent = 15
    }
    else {
        tax.textContent = 0
        shipping.textContent = 0
    }
    finalPrice.textContent = (grouped + parseInt(tax.textContent) + parseInt(shipping.textContent))
}

function increase () {
    let ItemQuantity = document.querySelectorAll(".quantity")
    let plus = document.querySelectorAll(".increase")
    plus.forEach((element, i) => {
        element.addEventListener("click", function () {
            cart[i].quantity ++
            ItemQuantity[i].textContent = cart[i].quantity
            summation()
            localStorage.setItem("cart", JSON.stringify(cart))
        })
    });
}

function decrease () {
    let ItemQuantity = document.querySelectorAll(".quantity")
    let minus = document.querySelectorAll(".decrease")
    minus.forEach((element, i) => {
        element.addEventListener("click", function () {
            if (cart[i].quantity > 1) {
                cart[i].quantity --
                ItemQuantity[i].textContent = cart[i].quantity
                summation()
                localStorage.setItem("cart", JSON.stringify(cart))
            }
        })
    });

}

function searchProducts () {
    let search = document.querySelector(".search-bar")
    const searchParam = document.querySelector("form")
    search.addEventListener("input", (e) => {
      const value = e.target.value
      lookFor(value)
    })
}
 
async function lookFor (item) {
    await fetch(`https://products-api-delta.vercel.app/api/products/search?q=${item}`)
    .then(res => res.json())
    .then(data => {
      sessionStorage.setItem("results",JSON.stringify(data))
      return data
    }
  )
}