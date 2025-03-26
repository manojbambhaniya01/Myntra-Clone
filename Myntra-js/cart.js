    let bagItem = []; // Initialize the array
    onLoad();

    function onLoad() {
        let bagItemStr = localStorage.getItem('bagItems');
        bagItem = bagItemStr ? JSON.parse(bagItemStr) : []; // Use `bagItem` instead of `bagItems`
        
        displayItemBag();
        homePageItem();
    }

    function addBagItem(itemid) {
        // Check if item is already in the bag to avoid duplicates
        if (!bagItem.includes(itemid)) {
            bagItem.push(itemid);
            localStorage.setItem('bagItems', JSON.stringify(bagItem));
            displayItemBag();
        }
    }

    function displayItemBag() {
        let cartNumber = document.querySelector('.numberofitem');
        
        if (bagItem.length > 0) {
            cartNumber.style.visibility = 'visible';
            cartNumber.innerText = bagItem.length;
        } else {
            cartNumber.style.visibility = 'hidden';
        }
    }

    function homePageItem() {
        document.addEventListener("DOMContentLoaded", function () {
            const secondItemElement = document.querySelector('.cartfirst-item'); // Get the container for items
            
            let innerHtml = '';
            items.forEach(item => {
                innerHtml += `
                <div class="item">
                    <div class="first-item">
                        <img style="height:250px; width:200px; object-fit: cover;" src="${item.image}" alt="item-image">
                        <div class="imgdescription">
                            <div id="Carton-London">${item.company}</div>
                            <p id="rodium-text">${item.item_name}</p>
                            <span class="pricevalue">r
                                <div><b>Rs ${item.price}</b></div>
                                <div id="pastprice">Rs ${item.current_price}</div>
                                <div id="off">${item.off}% Off</div>
                            </span>
                            <button id="addcartButton" onclick="addBagItem('${item.id}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
                `;
            });

            // Insert the built HTML into the container
            secondItemElement.innerHTML = innerHtml;
        });
    }