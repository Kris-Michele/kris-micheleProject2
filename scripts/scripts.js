import {app} from './firebase.js';
import {getDatabase, ref, onValue, update, push, get} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

const database = getDatabase(app);
const dbref = ref(database);

const productContainer = document.querySelector(`.galleryFlex`);
const filterBox = document.querySelector(`.filterBox`);
const filteredTags = [];
window.filteredTags = filteredTags;
const clearButton = document.getElementById('clearButton');

// Adding event listeners to the tags on page load

filterBox.addEventListener('click', (e) => {
    const tag = e.target;
    if(tag.nodeName === 'LI') {
        if(filteredTags.includes(tag.innerText)){
            //reject
        } else {
             filteredTags.push(tag.innerText);
        };
    };
});

//Adding the event listener to the button on page load

clearButton.addEventListener('click', () => {
    filteredTags.length = 0;
})

onValue(dbref,(data)=>{
    const allProducts = [];
    if(data.exists()){
        const payload = data.val().products
        for(let product in payload){
            allProducts.push(payload[product]);
        }
    };
    displayProducts(allProducts,productContainer);
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

// 1) Target the filter box
// 2) Add an event listener to each item inside the filter box
// 3) Create an empty array of selected tags
// 4) Create a function that loops throught products and find the products with matching tags
// 5) onClick array of selected tags will be equal to the inner text value of the button clicked(button from filter box)
// 6) Store those matching products into a new array
// 7) Pass the filtered products into the display products function

// Create a function to handle filtering. The function takes in the parameter: filterArr. This function will loop through the database to gather all the product information. Loop through each product's tag object and compare it to the filterArr. If there is a matching filter store the product information into an array called filteredProducts. Store data from database into a variable. At the end of the function after all filtering call display products and pass the desired node to display and the filtered products array. 

// Assign an event listener onto the parent div, if the target is = li then store the li innerText into an array called filteredTags. Assign a special event listener that will push the tags to the array and act as the catalyst for the filtering function(). 

// Put an on id on the clear button and when that button is clicked we reset the array of filtered tags to be empty and run the filtering function. And if there is no tags to passed it will = true and then rerun display products function. Ensure that both displayProducts function resets innerHTML of the container to be empty. 


