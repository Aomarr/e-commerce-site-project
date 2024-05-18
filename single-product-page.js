let cart = JSON.parse(localStorage.getItem("cart"));
function cartNumber() {
    cartCount = document.querySelector(".cart-count");
    cartCount.textContent = cart.length;
}
cartNumber();
searchProducts()
const getUrlParam = (param) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(param);
};

const getCurrentProduct = async (id) => {
    const res = await fetch(
        `https://products-api-delta.vercel.app/api/product/${id}`
    );
    const data = await res.json();
    return data;
};

const displayProduct = (product) => {
    document.querySelector("title").textContent = product.title
    document.querySelector(".product-image").src = product.image;
    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-information").textContent = product.description;
    document.querySelector(".old-price").textContent = product.price.toFixed(0);
    document.querySelector(".current-price").textContent = (product.price - product.price * (product.sale_percentage / 100)).toFixed(0);
    checkProduct(product)
    changeButtonToRemove(product);
    changeButtonToAdd(product);
};

const initProductPage = async () => {
    const productId = getUrlParam("id");
    const product = await getCurrentProduct(productId);
    if (Object.keys(product).length === 0) {
        window.alert("Item not found");
        return;
    }
    displayProduct(product);
    searchProducts();
};

initProductPage();

function searchProducts () {
    let search = document.querySelector(".search-bar")
    search.addEventListener("input", (e) => {
        console.log(e.target.value)
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

function changeButtonToRemove(thing) {
    const red = document.querySelector(".remove");
    const blue = document.querySelector(".add");
    blue.addEventListener("click", function (e) {
        e.target.style.display = "none";
        red.style.display = "inline-block";
        const exist = cart.find(point => point == thing)
        if (exist === undefined) {
            cart.push({ ...thing, quantity: 1});
        }
        cartNumber()
        localStorage.setItem("cart", JSON.stringify(cart))
    });
}

function changeButtonToAdd(thing) {
    const red = document.querySelector(".remove");
    const blue = document.querySelector(".add");
    red.addEventListener("click", function (e) {
        e.target.style.display = "none";
        blue.style.display = "inline-block";
        const exist = cart.find(point => point.id == thing.id)
        if (exist !== undefined) {
            index = cart.indexOf(exist)
            cart.splice(index, 1)
        }
        cartNumber()
        localStorage.setItem("cart", JSON.stringify(cart))
    });
    ;
}

function checkProduct(item) {
    const red = document.querySelector(".remove");
    const blue = document.querySelector(".add");
    let check = cart.find((e) => e.id == item.id);
    if (check !== undefined) {
        blue.style.display = "none"
        red.style.display = "inline-block"
    }
}
