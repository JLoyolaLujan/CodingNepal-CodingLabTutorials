const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel"); 
const arrowBtns = document.querySelectorAll(".wrapper .circle");
const firstCardWidth = carousel.querySelector(".card").offsetWidth; // to get width of the first card
const carouselChildrens = [...carousel.children]; // will use this to create infinite scrolling effect


let isDragging = false, startX, startScrollLeft, timeoutId; 

// get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth); 

// insert copies of the last few cards to the beginning of the carousel for infinite effect
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// insert copies of the last few cards to the end of the carousel for infinite effect
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// add event listeners for the arrow buttons to scroll left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () =>{
        // console.log(btn.id); // it responds!
        // if clicked button is left, then substract first card width from the carousel.scrollLeft, else add to it
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true; 
    carousel.classList.add("dragging"); // so text is not selected
    // records the initial cursor and scroll position of teh carousel
    startX = e.pageX; 
    startScrollLeft = carousel.scrollLeft; 
}

const dragStop = () => {
    isDragging = false; 
    carousel.classList.remove("dragging");
}

const dragging = (e) => {
    //console.log(e.pageX); //will print horizontal coordinates of mouse pointer
    if(!isDragging) return; // if isDragging is false, return from here
    // updates the scroll position of teh carousel based on teh cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    
}; 

const infiniteScroll = () => {
    // scrollLeft returns number of pixels an element's content is scrolled horizontally
    if(carousel.scrollLeft === 0) { 
        //console.log("you've reached the left's end"); // responds!
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth); // if carousel is at the beginning, scroll to the end
        carousel.classList.remove("no-transition");
    }
    // scrollWidth returns the width of the element's content including content not visible due to overflow
    // offsetWidth returns the viewable width of an element
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        //console.log("you've reached the right's end"); // responds!
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth; // if carousel is at the end, scroll to the beginning
        carousel.classList.remove("no-transition");
    }

    // clear existing timeout and start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

// let's now create an autoplay function

const autoPlay = () => {
    if(window.innerWidth < 800) return; // return if window is smaller than 800
    // autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500)
}; 

autoPlay(); 

carousel.addEventListener("mousedown", dragStart);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("scroll", infiniteScroll); 

// to move again if mouse stops hovering over the slides
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
