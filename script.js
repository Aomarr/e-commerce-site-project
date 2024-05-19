let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || []
let searchRedirect = sessionStorage.getItem("results")
let allResults = JSON.parse(searchRedirect)
getProducts();

function getProducts() {
  fetch("https://products-api-delta.vercel.app/api/products")
    .then((data) => data.json())
    .then((data) => {
      showProducts(allResults || data)
      products = data;
      cartNumber()
      changeButtonToRemove()
      changeButtonToAdd()      
      return data
    })
    .then(() => searchProducts());
}

function showProducts(items) {
  const productsList = document.querySelector(".products");
  items.forEach((element) => {
    const object = cart.find((e) => e.id == element.id)
    if (object != undefined) {
      productsList.innerHTML += `
    <div class="product-card d-flex flex-column justify-content-between">
    <div class="image">
      <img src="${element.image}" alt="product image" />
    </div>
    <div class="product-info">
    <a class="single-link" href="singular.html?id=${element.id}">
      <h3 class="product-main">${element.title}</h3>
      </a>
      <p class="price">${(
        element.price -
        element.price * (element.sale_percentage / 100)
      ).toFixed(0)}$</p>
      <p class="pro-sub">${element.description}</p>
    </div>
    <div class="action">
      <button class="add btn full-width pad-13" onclick="addToCart(${
        element.id
      })" style = "display: none;">Add To Cart</button>
      <button class="btn remove btn-danger full-width pad-13" onclick="removeFromCart(${element.id})" style = "display: inline-block;">Remove from cart</button>
    </div>
  </div>
    `;
    }
    else {
    productsList.innerHTML += `
    <div class="product-card d-flex flex-column justify-content-between">
    <div class="image">
      <img src="${element.image}" alt="product image" />
    </div>
    <div class="product-info">
    <a class="single-link" href="singular.html?id=${element.id}">
      <h3 class="product-main">${element.title}</h3>
      </a>
      <p class="price">${(
        element.price -
        element.price * (element.sale_percentage / 100)
      ).toFixed(0)}$</p>
      <p class="pro-sub">${element.description}</p>
    </div>
    <div class="action">
      <button class="add btn full-width pad-13" value="${element.id}" onclick="addToCart(${
        element.id
      })">Add To Cart</button>
      <button class="btn remove btn-danger full-width pad-13" onclick="removeFromCart(${element.id})">Remove from cart</button>
    </div>
  </div>
    `;
  }});
  sessionStorage.clear()
}

function addToCart(index) {
  products.forEach((item) => {

    const exist = cart.find(point => point.id == item.id)
    if (item.id == index && exist == undefined) {
      cart.push({ ...item, quantity: 1});
    }
    else if (item.id == index && exist != undefined) {
        exist.quantity ++
      }     
    }
  );
  localStorage.setItem("cart", JSON.stringify(cart))
  cartNumber()
}

function removeFromCart (index) {
  const found = cart.find(e => e.id == index);
  let instance = cart.indexOf(found)
  cart.splice(instance, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  cartNumber()
}

function changeButtonToRemove () {
  const red = document.querySelectorAll(".remove")
  const blue = document.querySelectorAll(".add")
  blue.forEach((element, index) => {
      element.addEventListener("click", function (e) {
        e.target.style.display = "none"
        red[index].style.display = "inline-block"
      })
  });
}

function changeButtonToAdd () {
  const red = document.querySelectorAll(".remove")
  const blue = document.querySelectorAll(".add")
  red.forEach((element, index) => {
      element.addEventListener("click", function (e) {
        e.target.style.display = "none"
        blue[index].style.display = "inline-block"
      })
  });
}

function cartNumber () {
  cartCount = document.querySelector(".cart-count")
  cartCount.textContent = cart.length
}

function adjustedButtons () {
  const red = document.querySelectorAll(".remove")


}

function searchProducts () {
  const search = document.querySelector(".search-bar")
  search.addEventListener("input", (e) => {
    const value = e.target.value
    lookFor(value)
})
}

async function lookFor (item) {
  await fetch(`https://products-api-delta.vercel.app/api/products/search?q=${item}`)
  .then(res => res.json())
  .then(data => {
    cleared()
    showProducts(data)
    changeButtonToRemove()
    changeButtonToAdd()
    sessionStorage.setItem("results",JSON.stringify(data))
    return data
  }
)
}

function cleared () {
  const productsList = document.querySelector(".products")
  productsList.innerHTML = ``
}