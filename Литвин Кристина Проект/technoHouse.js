/* section title */
var myTitle = document.getElementById('title');
myTitle.innerText='TechnoHouse.Техника в Беларуси'; 

let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { 
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") { 
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    myTitle.innerText='Возвращайся, пожалуйста!!!';
  } else {
    myTitle.innerText='TechnoHouse.Техника в Беларуси';
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);

/* section news */
var slideIndex = 0;

function nextSlide() {
    slideIndex = slideIndex + 1;
    showSlider();
}

function prevSlide() {
    slideIndex = slideIndex - 1;
    showSlider();
}

function currentSlider(num) {
    slideIndex = num;
    showSlider();
}

function showSlider() {
    var slides = document.getElementsByClassName('item__news');

    if (slideIndex === slides.length) {
        slideIndex = 0;
    }

    if (slideIndex < 0) {
        slideIndex = slides.length-1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[slideIndex].style.display = 'block';

    var dots = document.getElementsByClassName('slider-dots_item')
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = 'slider-dots_item';
    }

    dots[slideIndex].className =dots[slideIndex].className + ' active';
}

showSlider();

setInterval(function() { nextSlide(1) }, 2000);

/* section header */
function change() {
  var burger = document.getElementById("burger");
  var span = document.getElementById('spanMenu');
  var span2 = document.getElementById('spanMenu2');
  var span3 = document.getElementById('spanMenu3');
  burger.classList.toggle('hide');
  span.classList.toggle('menu__btn__close');
  span2.classList.toggle('menu__btn__close2');
  span3.classList.toggle('menu__btn__close3');
}

function closeMenu() {
  var burger = document.getElementById("burger");
  burger.className = 'burgerNone';
  var span = document.getElementById('spanMenu');
  var span2 = document.getElementById('spanMenu2');
  var span3 = document.getElementById('spanMenu3');
  span.classList.toggle('menu__btn__close');
  span2.classList.toggle('menu__btn__close2');
  span3.classList.toggle('menu__btn__close3');
}