const switchMode = document.getElementsByClassName("switch-mode")[0];
const moonIcon = document.getElementsByClassName("fa-moon")[0];
const sunIcon = document.getElementsByClassName("fa-sun")[0];
const rootElement = document.documentElement;
const pagesContainer = document.getElementsByClassName("pages-container")[0];
const selectedPage = document.getElementsByClassName("page-selected")[0];
const prevPage = document.getElementsByClassName("page-prev")[0];
const nextPage = document.getElementsByClassName("page-next")[0];
const quote = document.getElementsByClassName("quote")[0];
const author = document.getElementsByClassName("authorr")[0];

// Extract data from the JSON file.
let darkModeData = [];
let lightModeData = [];
let pagesData = [];
let quotesData = [];

// Load last selected page.
let selectedPageIndex;
if (localStorage.getItem("selectedPageIndex") === null) {
  localStorage.setItem("selectedPageIndex", 0)
} else {
  selectedPageIndex = localStorage.getItem("selectedPageIndex");
}

(async () => {
  try {
    const response = await fetch('resources/data.json');
    const data = await response.json();
    
    darkModeData = data.colors.darkMode;
    lightModeData = data.colors.lightMode;
    pagesData = data.pages;
    quotesData = data.quotes;

    // Load the saved color mode.
    if (localStorage.getItem("darkMode") === null) {
      localStorage.setItem("darkMode", 1);
      sunIcon.classList.add("hidden");
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
prevPage.addEventListener('click', (e) => {
  e.preventDefault();
  selectedPage.classList.add("jump");
  setTimeout(() => {
    selectedPage.classList.remove("jump")
    shiftToPrev();
  }, 100);
});
nextPage.addEventListener('click', (e) => {
  e.preventDefault();
  selectedPage.classList.add("jump");
  setTimeout(() => {
    selectedPage.classList.remove("jump")
    shiftToNext();
  }, 100);
});

function shiftToPrev() {
  selectedPageIndex--;
  displayPages();
}

function shiftToNext() {
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
  
    localStorage.setItem("selectedPageIndex", selectedPageIndex);
    let prevPageIndex = Number(selectedPageIndex) - 1;
    let nextPageIndex = Number(selectedPageIndex) + 1;

    if (prevPageIndex < 0) {
      prevPageIndex = pagesData.length - 1;
    } else if (prevPageIndex >= pagesData.length) {
      prevPageIndex = 0;
    }

    if (nextPageIndex < 0) {
      nextPageIndex = pagesData.length - 1;
    } else if (nextPageIndex >= pagesData.length) {
      nextPageIndex = 0;
    }
  
    // Display pages data according to the calculated indexes.
    selectedPage.getElementsByTagName("h3")[0].innerText = pagesData[selectedPageIndex].title;
    selectedPage.getElementsByTagName("p")[0].innerText = pagesData[selectedPageIndex].description;
    selectedPage.href = pagesData[selectedPageIndex].link;
    selectedPage.style.backgroundImage = pagesData[selectedPageIndex].image;

    prevPage.getElementsByTagName("h3")[0].innerText = pagesData[prevPageIndex].title;
    prevPage.getElementsByTagName("p")[0].innerText = pagesData[prevPageIndex].description;
    prevPage.href = pagesData[prevPageIndex].link;
    prevPage.style.backgroundImage = pagesData[prevPageIndex].image;

    nextPage.getElementsByTagName("h3")[0].innerText = pagesData[nextPageIndex].title;
    nextPage.getElementsByTagName("p")[0].innerText = pagesData[nextPageIndex].description;
    nextPage.href = pagesData[nextPageIndex].link;
    nextPage.style.backgroundImage = pagesData[nextPageIndex].image;
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
  selectedPage.style.setProperty("--rotateX", -offsetY + "deg");
  selectedPage.style.setProperty("--rotateY", offsetX + "deg");

  // Calculate offset for use with the body element.
  const bodyOffsetX = ((x - middleX) / middleX) * 5;
  const bodyOffsetY = ((y - middleY) / middleY) * 5;
  document.body.style.setProperty("--rotateX", -bodyOffsetY + "deg");
  document.body.style.setProperty("--rotateY", bodyOffsetX + "deg");
});

// Add expanding animation for the selected page's shadow when a page is opened.
selectedPage.style.setProperty("--inset", -1 + "rem");
selectedPage.addEventListener('click', (e) => {
  e.preventDefault();
  selectedPage.style.setProperty("--inset", -200 + "rem");
  setTimeout(() => {
    selectedPage.style.setProperty("--inset", -1 + "rem");
    window.open(selectedPage.href);
  }, 300);
});
