var shoppingCart = (function(global) {
    var db = [
        {img: "fa-coffee", name: "Coffee", price: 10},
        {img: "fa-glass", name: "Glass", price: 20}
    ];

    var cart = {
        content: [],

        add: function(item) {
            let cartItem = this.search(item);
            if (cartItem) {
                cartItem.inCart += 1;
            }
            else {
                item.inCart += 1;
                this.content.push(item);
            }
            
            Item.render();
            sessionStorage.setItem("cart", this);

        },

        search: function(item) {
            for (let i = 0; i < this.content.length; i++) {
                if (this.content[i] === item) {
                    return item;
                }
            }
        }
    };

    function makeElement(element, config) {
        let node = document.createElement(element);
        for (let attr in config) {
            node.setAttribute(attr, config[attr]);
        }
        return node;
    }

    document.addEventListener("click", handleItemClick, true);

    function handleItemClick(event) {
        let container = document.querySelector(".list-container");
        if (/list-item/.test(event.target.className)) {
            if (event.target.parentNode === container) {
                cart.add(Item.findByElement(event.target));
            } else {
                cart.add(Item.findByElement(event.target.parentNode));
            }
        }
    }

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
            Item.all[i].inCart = 0;
        }
    }

    Item.render = function() {
        let container = document.querySelector(".list-container");
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
            price.innerHTML = Item.all[i].price;
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

    Item.findByElement = function(element) {
        for (let i = 0; i < Item.all.length; i++) {
            if (Item.all[i].element === element) {
                return Item.all[i];
            }
        }
    }

    return {
        init: function() {
            Item.load(db);
            Item.render();
            localStorage.setItem("app", this);
            console.log(this);
        }
    }
})(window);

shoppingCart.init();