import {app} from './firebase.js';
import {getDatabase, ref, onValue, update, push, get} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const database = getDatabase(app);
const dbref = ref(database);

const productContainer = document.querySelector(`.galleryFlex`);
const filterBox = document.querySelector(`.filterBox`);
const filteredTags = [];
const clearButton = document.getElementById('clearButton');

// Adding event listeners to the tags on page load
filterBox.addEventListener('click', (e) => {
    const tag = e.target;
    if(tag.nodeName === 'LI' && tag.classList.contains('tag')){
        if(filteredTags.includes(tag.innerText)){

            // removes if being filtered for already
            let tagChecked = filteredTags.indexOf(tag.innerText);
            delete filteredTags[tagChecked];
            filterProductRendering(filteredTags);
            tag.classList.toggle("tagActive");

        } else {
             filteredTags.push(tag.innerText);
             filterProductRendering(filteredTags);
             tag.classList.toggle("tagActive");
        };
    };
});

//Adding the event listener to the clear button on page load
clearButton.addEventListener('click', () => {
    filteredTags.length = 0;
    filterProductRendering(filteredTags);
    const allTags = document.querySelectorAll(".tag");
    console.log(allTags);
    allTags.forEach((tag)=>{
        if(tag.classList.contains("tagActive")){
            tag.classList.toggle("tagActive");
        };
    });
});

 const intialRender = () =>
    onValue(dbref,(data)=>{
        const allProducts = [];
        console.log(allProducts);
        if(data.exists()){
            const payload = data.val().products;
            for(let product in payload){
                allProducts.push(payload[product]);
            };
        };
    console.log(allProducts);
    displayProducts(allProducts,productContainer);
    addToCartEvents();
});
const displayProducts = (productsArr,node) =>{ 
    node.innerHTML = "";
    productsArr.forEach((product)=>{
        //creating the required elements for the listing.
        const productArticle = document.createElement(`article`);
        const imgContainer = document.createElement(`div`);
        const productInfoContainer = document.createElement(`div`);
        const img = document.createElement(`img`);
        const productTitle = document.createElement(`h3`);
        const description = document.createElement(`p`);
        const price = document.createElement(`p`);
        const span = document.createElement(`span`);
        const addToCartBtn = document.createElement(`button`);

        // assigning img src and alt from the firebase realtime database.
        img.src = product.img;
        img.alt = product.alt;

        // assigning text values of each product
        productTitle.innerText = product.product;
        description.innerText = product.description;
        price.innerText = product.price;
        span.innerText = product.formerPrice;

        // creating the structure in the dom.
        productArticle.appendChild(imgContainer);
        imgContainer.appendChild(img);
        productArticle.appendChild(productInfoContainer);
        productInfoContainer.appendChild(productTitle);
        productInfoContainer.appendChild(description);
        productInfoContainer.appendChild(price);
        price.append(span);
        productInfoContainer.appendChild(addToCartBtn);
        addToCartBtn.innerText = "Add To Cart"

        //appending to page
        node.appendChild(productArticle);

        // assiging classes to required elements
        productArticle.classList.add(`productArticle`);
        imgContainer.classList.add(`vegetableImage`);
        productInfoContainer.classList.add(`vegetableText`);
        price.classList.add(`price`);
        span.classList.add(`formerPrice`);
        addToCartBtn.classList.add(`productButton`);
    });
};

const filterProductRendering = (filtersArr) =>{
    onValue(dbref,(data)=>{
        const allProducts = [];
        if(data.exists()){
            const payload = data.val().products
            for(let product in payload){
                allProducts.push(payload[product]);
            }
        };
        const filteredProducts = allProducts.filter((product)=>{
            const productTags = Object.values(product.tagObj);
            return  filtersArr.every((tag)=> productTags.includes(tag));
        });
        if(filteredProducts.length === 0){
            console.log(`no matches`);
        }else{
            displayProducts(filteredProducts,productContainer)
        };
  });
};

const addToCartEvents = () =>{
    const cartButtonsArray = document.querySelectorAll('.productButton');
    cartButtonsArray.forEach((button)=>{
        button.addEventListener(`click`, (e)=>{
        const updatedCart = parseInt(cartContainer.textContent)+1;
        const newCart = {cart: updatedCart}
        push(dbref,newCart);
        cartContainer.textContent = updatedCart;
        });
    }); 
};

export {intialRender};


