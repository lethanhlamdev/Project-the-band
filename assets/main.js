var sliderContainer = document.querySelector("#slider");
var listImages = [
    {
        heading: "Music & Life",
        slogan: "Music is the breath of life.",
        image: "./assets/img/music1.jpg",
    },
    {
        heading: "Music & Life",
        slogan: "Music is the color of the soul.",
        image: "./assets/img/music2.jpg",
    },
    {
        heading: "Music & Life",
        slogan: "Music is the shape of sound",
        image: "./assets/img/music3.jpg",
    },
];

let i = 0;
setInterval(function () {
    sliderContainer.innerHTML = `
                            <img src=${listImages[i].image} class="slider-img"> 
                            <div class="text-content-slider">
                                <h2 class="text-heading">${listImages[i].heading}</h2> 
                                <p class="text-slogan">${listImages[i].slogan}</p>
                            </div> 
                            `;
    i++;
    if (i === 3) {
        i = 0;
    }
}, 5000);

const buyBtns = document.querySelectorAll(".js-buy-ticket");
const modal = document.querySelector(".js-modal");
const modalClose = document.querySelector(".js-modal-close");
const modalContainer = document.querySelector(".js-modal-container");

function hideBuyTickets() {
    modal.classList.remove("open");
}
function showBuyTickets() {
    modal.classList.add("open");
}
for (const buyBtn of buyBtns) {
    buyBtn.addEventListener("click", showBuyTickets);
}
modalClose.addEventListener("click", hideBuyTickets);

modal.addEventListener("click", hideBuyTickets);
modalContainer.addEventListener("click", function (e) {
    e.stopImmediatePropagation();
});

let header = document.getElementById("header");
let mobileMenu = document.getElementById("mobile-menu");
let headerHeight = header.clientHeight;
mobileMenu.onclick = () => {
    let isClose = header.clientHeight === headerHeight;
    if (isClose) {
        header.style.height = "auto";
    } else {
        header.style.height = null;
    }
};

let menuItems = document.querySelectorAll('#nav li a[href*="#"]');
for (let i = 0; i < menuItems.length; i++) {
    let menuItem = menuItems[i];

    menuItem.onclick = function (e) {
        let isParentMenu =
            this.nextElementSibling &&
            this.nextElementSibling.classList.contains("subnav");
        if (isParentMenu) {
            e.preventDefaul();
        } else {
            header.style.height = null;
        }
    };
}
