const toggleMenuElement = document.getElementById("toggle-menu");
const mainMenuElement = document.getElementById("main-nav");
// const hamburgerWrapper = document.getElementById("toogle-menu");

toggleMenuElement.addEventListener('click', () => {
    mainMenuElement.classList.toggle("main-nav--show");
    toggleMenuElement.classList.toggle("active"); 
});