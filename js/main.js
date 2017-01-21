function makeElement(element, config) {
    let node = document.createElement(element);
    for (let attr in config) {
        node.setAttribute(attr, config[attr]);
    }
    return node;
}

let shoppingCart = (function(global) {
    let db = [
        {img: "fa-address-card", name: "Address Card", price: 10},
        {img: "fa-anchor", name: "Anchor", price: 20},
        {img: "fa-bath", name: "Bath", price: 30},
        {img: "fa-birthday-cake", name: "Birthday Cake", price: 40},
        {img: "fa-bed", name: "Bed", price: 50},
        {img: "fa-bomb", name: "Bomb", price: 60},
        {img: "fa-calculator", name: "Calculator", price: 70},
        {img: "fa-calendar", name: "Calendar", price: 80},
        {img: "fa-cloud", name: "Cloud", price: 90},
        {img: "fa-cube", name: "Cube", price: 100},
        {img: "fa-eraser", name: "Eraser", price: 110},
        {img: "fa-fighter-jet", name: "Fighter Jet", price: 120},
        {img: "fa-flag", name: "Flag", price: 130},
        {img: "fa-gift", name: "Gift", price: 140},
        {img: "fa-pencil", name: "Pencil", price: 150},
    ];

    let cart = (function() {
        let content = [];

        return {
            getContent: function() {
                return content;
            },

            add: function(item) {
                let cartItem = this.search(item);
                if (cartItem) {
                    cartItem.inCart += 1;
                }
                else {
                    item.inCart += 1;
                    content.push(item);
                }
                
                Item.render();
            },

            search: function(item) {
                for (let i = 0; i < content.length; i++) {
                    if (content[i] === item) {
                        return item;
                    }
                }
            },

            render: function() {
                let container = document.querySelector(".cart-container");
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }

                if (content.length === 0) {
                    return;
                }

                for (let i = 0; i < content.length; i++) {
                    let holder = makeElement("div", {"class": "list-item"});
                    let imgClasses = "list-item-img fa fa-3x " + content[i].img;
                    let img = makeElement("i", {"class": imgClasses});
                    let name = makeElement("P", {"class": "list-item-name"});
                    name.innerHTML = content[i].name;
                    let price = makeElement("span", {"class": "list-item-price"});
                    price.innerHTML = "Price: " + content[i].price;
                    let inCart = makeElement("span", {"class": "list-item-in-cart"});
                    inCart.innerHTML = content[i].inCart;

                    holder.appendChild(img);
                    holder.appendChild(name);
                    holder.appendChild(price);
                    holder.appendChild(inCart);
                    container.appendChild(holder);

                    
                    content.element = holder;
                }

                let moveBottom = makeElement("div", {"class": "move-bottom"});
                let options = makeElement("div", {"class": "options"});
                let totalPriceSpan = makeElement("span", {"class": "total-price"});
                let buttonBuy = makeElement("BUTTON", {"class": "btn btn-buy"});
                buttonBuy.innerHTML = "Buy";
                let buttonEmpty = makeElement("BUTTON", {"class": "btn btn-empty"});
                buttonEmpty.innerHTML = "Empty Cart";

                let totalPrice;
                if (content.length === 1) {
                    totalPrice = content[0].price * content[0].inCart;
                } else {
                    totalPrice =
                        content.reduce((a, b) => a.price * a.inCart + b.price * b.inCart);
                }
                totalPriceSpan.innerHTML = "Total Price: " + totalPrice;
                options.appendChild(totalPriceSpan);
                options.appendChild(buttonBuy);
                options.appendChild(buttonEmpty);
                moveBottom.appendChild(options);
                container.appendChild(moveBottom);

                document.querySelector(".btn-buy").addEventListener("click", function(event) {
                    cart.empty();
                });

                document.querySelector(".btn-empty").addEventListener("click", function(event) {
                    cart.empty();
                });
            },

            empty: function() {
                content = [];
                this.render();
                Item.empty();
                Item.render();
            }
        };
    })();

    function handleItemClick(event) {
        let container = document.querySelector(".shop-container");
        if (!container.contains(event.target)) {
            return;
        }

        if (/list-item/.test(event.target.className)) {
            if (event.target.parentNode === container) {
                cart.add(Item.findByElement(event.target));
            } else {
                cart.add(Item.findByElement(event.target.parentNode));
            }
        }
    }

    document.querySelector(".btn-cart").addEventListener("click", function(event) {
        let shopPage = document.querySelector(".page-shop");
        let cartPage = document.querySelector(".page-shopping-cart");
        let baseClasses = "btn-cart fa fa-2x ";

        if (this.dataset.on === "false") {
            this.dataset.on = "true";
            this.setAttribute("class", baseClasses + "fa-arrow-left");
            cart.render();
            shopPage.style.display = "none";
            cartPage.style.display = "block";
        }
        else {
            this.dataset.on = "false";
            this.setAttribute("class", baseClasses + "fa-shopping-cart");
            shopPage.style.display = "block";
            cartPage.style.display = "none";
        }
    })

    function Item(config) {
        this.img = config.img;
        this.name = config.name;
        this.price = config.price;
        this.inCart = 0;
    }
    Item.all = [];

    Item.load = function(db) {
        Item.all = [];
        for (let i = 0; i < db.length; i++) {
            Item.all.push(new Item(db[i]));
        }
    }

    Item.render = function() {
        let container = document.querySelector(".shop-container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        for (let i = 0; i < Item.all.length; i++) {
            let holder = makeElement("div", {"class": "list-item"});
            let imgClasses = "list-item-img fa fa-3x " + Item.all[i].img;
            let img = makeElement("i", {"class": imgClasses});
            let name = makeElement("P", {"class": "list-item-name"});
            name.innerHTML = Item.all[i].name;
            let price = makeElement("span", {"class": "list-item-price"});
            price.innerHTML = "Price: " + Item.all[i].price;
            let inCart = makeElement("span", {"class": "list-item-in-cart"});
            inCart.innerHTML = Item.all[i].inCart;

            holder.appendChild(img);
            holder.appendChild(name);
            holder.appendChild(price);
            holder.appendChild(inCart);
            container.appendChild(holder);

            
            Item.all[i].element = holder;
        }
    }

    Item.empty = function() {
        for (var i = 0; i < Item.all.length; i++) {
            Item.all[i].inCart = 0;
        }
    }

    Item.findByElement = function(element) {
        for (let i = 0; i < Item.all.length; i++) {
            if (Item.all[i].element === element) {
                return Item.all[i];
            }
        }
    }


    // Event listeners
    document.addEventListener("click", function(event) {
        handleItemClick(event);
    });

    return {
        init: function() {
            Item.load(db);
            Item.render();
        }
    }
})(window);

shoppingCart.init();