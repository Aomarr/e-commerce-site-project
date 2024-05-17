let cart = JSON.parse(localStorage.getItem("cart")) 
cartNumber()
showcart()
function showcart () {
    const cartproducts = document.querySelector(".cart-products")
    cart.forEach((element) => {
       cartproducts.innerHTML += `
<div class="item d-flex py-3 gap-2 gap-md-3">
    <div class="item-image">
    <img src="${element.image}" alt="product image">
    </div>
    <div class="item-info d-flex flex-column justify-content-between">
    <h3 class="item-name fs-6 fs-md-4">${element.title}</h3>
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
    increase()
    decrease()
}

function removeCartItem (value) {
    let match = cart.find((e) => e.id == value)
    let place = cart.indexOf(match)
    cart.splice(place, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    cartNumber()
    summation()
    increase()
    decrease()
}


function removeItem () {
    const remove = document.querySelectorAll(".delete")
    remove.forEach(element => {

        element.addEventListener("click", function (e) {
            e.target.closest(".item").remove()
            increase()
            decrease()
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
    let grouped = 0
    cart.forEach(element => {
    let numed = parseInt((element.price - (element.price*(element.sale_percentage / 100))).toFixed(0))
    grouped += numed * element.quantity   
    });
    console.log(grouped)
    // summed.textContent = grouped
    finalPrice.textContent = (grouped + 30 + 15)
}


function decrease () {
    const ItemQuantity = document.querySelectorAll(".quantity")
    const minus = document.querySelectorAll(".decrease")
    for (let i=0 ; i < cart.length; i++) {
        minus[i].addEventListener("click", function () {
            if (cart[i].quantity > 1) {
                cart[i].quantity --;
                ItemQuantity[i].textContent = cart[i].quantity
            }
        })
    localStorage.setItem("cart", JSON.stringify(cart))
    summation()
}};

function increase () {
    let ItemQuantity = document.querySelectorAll(".quantity")
    let plus = document.querySelectorAll(".increase")
    for (let i=0 ; i < cart.length; i++) {
        plus[i].addEventListener("click", function () {
                cart[i].quantity ++;
                ItemQuantity[i].textContent = cart[i].quantity
        })
    localStorage.setItem("cart", JSON.stringify(cart))
    summation()
}};







function searchProducts () {
    let search = document.querySelector(".search-bar")
    let productsList = document.querySelector(".products")
    stopReload()
    search.addEventListener("input", (e) => {
      const value = e.target.value
      productsList.innerHTML = ``
      lookFor(value)
  })
  }
  
  async function lookFor (item) {
    await fetch(`https://products-api-delta.vercel.app/api/products/search?q=${item}`)
    .then(res => res.json())
    .then(data => {
      showProducts(data)
      changeButtonToRemove()
      changeButtonToAdd()
      sessionStorage.setItem("results",JSON.stringify(data))
      return data
    }
  )
  }