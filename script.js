const switchMode = document.getElementsByClassName("switch-mode")[0];
const sunIcon = document.getElementsByClassName("fa-sun")[0];
const moonIcon = document.getElementsByClassName("fa-moon")[0];
const rootElement = document.documentElement;
const pagesContainer = document.getElementsByClassName("pages-container")[0];
const leftArrow = document.getElementsByClassName("arrow-left")[0];
const rightArrow = document.getElementsByClassName("arrow-right")[0];
const centerPage = document.getElementsByClassName("page-center")[0];
const leftPage = document.getElementsByClassName("page-left")[0];
const rightPage = document.getElementsByClassName("page-right")[0];
const quote = document.getElementsByClassName("quote")[0];
const author = document.getElementsByClassName("author")[0];

// Extract data from the JSON file.
let lightModeData = [];
let darkModeData = [];
let pagesData = [];
let selectedPageIndex = 0;
let quotesData = [];

(async () => {
  try {
    const response = await fetch('resources/data.json');
    const data = await response.json();
    
    lightModeData = data.colors.lightMode;
    darkModeData = data.colors.darkMode;
    pagesData = data.pages;
    quotesData = data.quotes;

    // Load the saved color mode.
    if (localStorage.getItem("darkMode") === null) {
      localStorage.setItem("darkMode", 0);
      moonIcon.classList.add("hidden");
    } else {
      if (localStorage.getItem("darkMode") == 1) {
        sunIcon.classList.add("hidden");
        setDarkMode();
      } else {
        moonIcon.classList.add("hidden");
        setLightMode();
      }
    }

    displayPages();
    
    // Display a random quote.
    const selectedQuote = quotesData[Math.floor(Math.random() * quotesData.length)]
    quote.innerHTML = '❝' + selectedQuote.quote + '❞';
    author.innerHTML = '— ' + selectedQuote.author;
  } catch (error) {
    console.error('Error: ', error);
  }
})();

switchMode.addEventListener("click", () => {
  switchState();
});

function switchState() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
    setLightMode();
  } else {
    localStorage.setItem("darkMode", 1);
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
    setDarkMode();
  }
}

function setLightMode() {
  rootElement.style.setProperty('--color-pri', lightModeData[0]);
  rootElement.style.setProperty('--color-sec', lightModeData[1]);
  rootElement.style.setProperty('--color-ter', lightModeData[2]);
}

function setDarkMode() {
  rootElement.style.setProperty('--color-pri', darkModeData[0]);
  rootElement.style.setProperty('--color-sec', darkModeData[1]);
  rootElement.style.setProperty('--color-ter', darkModeData[2]);
}

// Slider functionality.
leftPage.addEventListener('click', (e) => {
  e.preventDefault();
  centerPage.classList.add("jump");
  setTimeout(() => {
    centerPage.classList.remove("jump")
    shiftToLeft();
  }, 50);
});
rightPage.addEventListener('click', (e) => {
  e.preventDefault();
  centerPage.classList.add("jump");
  setTimeout(() => {
    centerPage.classList.remove("jump")
    shiftToRight();
  }, 50);
});

function shiftToLeft() {
  selectedPageIndex--;
  displayPages();
}

function shiftToRight() {
  selectedPageIndex++;
  displayPages();
}

function displayPages() {
  if (pagesData.length == 0) {
    pagesContainer.innerText = "NO PAGES TO DISPLAY.";
  } else {
    // Calculate circling behaviour to ensure all three pages have something to display.
    if (selectedPageIndex < 0) {
      selectedPageIndex = pagesData.length - 1;
    } else if (selectedPageIndex >= pagesData.length) {
      selectedPageIndex = 0;
    }
  
    let leftPageIndex = selectedPageIndex - 1;
    let rightPageIndex = selectedPageIndex + 1;

    if (leftPageIndex < 0) {
      leftPageIndex = pagesData.length - 1;
    } else if (leftPageIndex >= pagesData.length) {
      leftPageIndex = 0;
    }

    if (rightPageIndex < 0) {
      rightPageIndex = pagesData.length - 1;
    } else if (rightPageIndex >= pagesData.length) {
      rightPageIndex = 0;
    }
  
    // Display pages data according to the calculated indexes.
    centerPage.getElementsByTagName("h3")[0].innerText = pagesData[selectedPageIndex].title;
    centerPage.getElementsByTagName("p")[0].innerText = pagesData[selectedPageIndex].description;
    centerPage.href = pagesData[selectedPageIndex].link;
    centerPage.style.backgroundImage = pagesData[selectedPageIndex].image;

    leftPage.getElementsByTagName("h3")[0].innerText = pagesData[leftPageIndex].title;
    leftPage.getElementsByTagName("p")[0].innerText = pagesData[leftPageIndex].description;
    leftPage.href = pagesData[leftPageIndex].link;
    leftPage.style.backgroundImage = pagesData[leftPageIndex].image;

    rightPage.getElementsByTagName("h3")[0].innerText = pagesData[rightPageIndex].title;
    rightPage.getElementsByTagName("p")[0].innerText = pagesData[rightPageIndex].description;
    rightPage.href = pagesData[rightPageIndex].link;
    rightPage.style.backgroundImage = pagesData[rightPageIndex].image;
  }
}

// Add 3D mouse-following effect to the selected page.
document.addEventListener('mousemove', (e) => {
  // Get mouse position.
  const x = e.clientX;
  const y = e.clientY;

  // Find the center of the screen.
  const middleX = window.innerWidth / 2;
  const middleY = window.innerHeight / 2;

  // Calculate offset for use with the selected page.
  const offsetX = ((x - middleX) / middleX) * 20;
  const offsetY = ((y - middleY) / middleY) * 20;
  centerPage.style.setProperty("--rotateX", -offsetY + "deg");
  centerPage.style.setProperty("--rotateY", offsetX + "deg");

  // Calculate offset for use with the body element.
  const bodyOffsetX = ((x - middleX) / middleX) * 5;
  const bodyOffsetY = ((y - middleY) / middleY) * 5;
  document.body.style.setProperty("--rotateX", -bodyOffsetY + "deg");
  document.body.style.setProperty("--rotateY", bodyOffsetX + "deg");
});

// Add expanding animation for the selected page's shadow when a page is opened.
centerPage.style.setProperty("--inset", -1 + "rem");
centerPage.addEventListener('click', (e) => {
  e.preventDefault();
  centerPage.style.setProperty("--inset", -200 + "rem");
  setTimeout(() => {
    centerPage.style.setProperty("--inset", -1 + "rem");
    window.open(centerPage.href);
  }, 300);
});
