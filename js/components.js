"use strict";

// Custom VH
var vh = window.innerHeight * 0.01;
var vw = document.documentElement.clientWidth;
document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
window.addEventListener('resize', function () {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
  var vw = document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--vw', "".concat(vw, "px"));
});

// Remove class
function removeClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.remove(className);
  });
}
function addClass(nodes, className) {
  nodes.forEach(function (node) {
    node.classList.add(className);
  });
}

// Breakpoints checker, прослуховувач медіазапитів
var breakpoint_mob = window.matchMedia('(max-width:767px)'); // 0 - 767
var breakpoint_tablet = window.matchMedia('(max-width:1023px)'); // 767 - 1023
var breakpoint_laptop = window.matchMedia('(max-width:1339px)'); // 1024 - 1279
var breakpoint_desktop = window.matchMedia('(min-width:1440px)'); // 1279 >
//
// const breakpoint_mob = window.matchMedia('(max-width:767px)'); // 0 - 767
// const breakpoint_tablet = window.matchMedia('(min-width:768px)'); // 767 - 1023
// const breakpoint_laptop = window.matchMedia('(min-width:1024px)'); // 1024 - 1440
// const breakpoint_desktop = window.matchMedia('(min-width:1440px)'); // 1440 >

var swiperShop, swiperCompany;
var breakpointChecker = function breakpointChecker() {
  if (breakpoint_mob.matches === true) {
    console.log('mobile');

    // Ініціалізація слайдеру послуг (swiper-services)
    return false;
  }
  if (breakpoint_tablet.matches === true) {
    console.log('tablet');
    return false;
  }
  if (breakpoint_laptop.matches === true) {
    console.log('laptop');
    return false;
  }
  if (breakpoint_desktop.matches === true) {
    console.log('desktop');
    return false;
  }
};
breakpoint_mob.addEventListener('change', breakpointChecker);
breakpoint_tablet.addEventListener('change', breakpointChecker);
breakpoint_laptop.addEventListener('change', breakpointChecker);
breakpoint_desktop.addEventListener('change', breakpointChecker);
breakpointChecker();
var btns_anchor = document.querySelectorAll('._js-anchor');
btns_anchor.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    var href = btn.dataset.anchor;
    var target = document.querySelector("#".concat(href));
    var topOffset = target.offsetTop - document.querySelector('nav').clientHeight - 20;
    window.scrollTo({
      top: topOffset,
      behavior: "smooth"
    });
    if (btn.closest('.nav') && btn.closest('.nav').classList.contains('active')) {
      btn.closest('.nav').classList.remove('active');
    }
  });
});
if (document.querySelector('._js-scroll-top')) {
  document.querySelector('._js-scroll-top').addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
var burger = document.querySelector('._js-burger'),
  header = document.querySelector('header'),
  searchIcon = document.querySelector('._js-search-icon');
if (burger) {
  burger.addEventListener('click', function () {
    if (!header.classList.contains('show-menu') && !header.classList.contains('show-search')) {
      header.classList.add('show-menu');
      document.body.classList.add('_hide-scroll');
    } else if (header.classList.contains('show-menu') || header.classList.contains('show-search')) {
      header.classList.remove('show-menu');
      header.classList.remove('show-search');
      document.body.classList.remove('_hide-scroll');
    }
    burger.classList.toggle('active');
  });
}
if (searchIcon) {
  searchIcon.addEventListener('click', function () {
    header.classList.toggle('show-search');
    burger.classList.toggle('active');
    document.body.classList.toggle('_hide-scroll');
  });
}