// CONSTS
// Link js consts to each DOM element
const body = document.querySelector('body');
const loading = document.querySelector('.js-loading');
const title = document.querySelector('.js-title');
const navigation = document.querySelector('.js-nav');
const pageContent = document.querySelector('.js-page-content');
const footer = document.querySelector('.js-footer');

// RENDER FUNCTIONS
// (the nav, footer, and header functions could be merged into one function to clean up the code)
function renderHeader(content) {
  // Set the inner HTML content
  title.innerHTML = content;
}

function renderNav(content) {
  let navContent = '';

  content.forEach((link) => {
    // Check for sub menu links and render
    let submenuMarkup = '';

    if (link.submenu) {
      link.submenu.forEach((sublink) => {
        const linkMarkup = `
          <div class="nav-sublink">
            <a class="js-link" href=${sublink.url}>${sublink.title}</a>
          </div>
        `;

        submenuMarkup += linkMarkup;
      });
    }

    // Loop through the menu data and render the links and any submenu links if found
    const linkMarkup = `
      <div class="nav-link">
        <a class="link js-link" href=${link.url}>${link.title}</a>
        ${submenuMarkup}
      </div>
    `;

    // Add the new markup to nav content
    navContent += linkMarkup;
  });

  // Set the inner HTML content as usual
  navigation.innerHTML = navContent;
}

function renderFooter(content) {
  // Set the inner HTML content
  footer.innerHTML = content;
}

function renderPage(content) {
  // Set the inner HTML content
  pageContent.innerHTML = content;
}

// ANIMATION FUNCTIONS
function toggleMobileNav() {
  if (navigation.classList.contains('menu-open')) {
    navigation.classList.remove('menu-open');
  } else {
    navigation.classList.add('menu-open');
  }
}

function siteReady() {
  body.classList.add('page-ready');
  setTimeout(() => {
    loading.classList.add('remove-loading');
  }, 400);
}

// FETCH AND INIT FUNCTIONS
// Fetch json data util function
function initHomePage() {
  // Get the page data
  fetch('./data/json.txt')
    // Massage the data into json format
    .then(payload => payload.json())
    // Render the home page
    .then((payload) => {
      // Render page sections
      renderHeader(payload.header);
      renderPage(payload.body);
      renderNav(payload.menu);
      renderFooter(payload.footer);
    })
    // Add event listeners
    .then(() => {
      // Add mobile nav event listener (could be run earlier but this way is cleaner)
      document.querySelector('.js-toggle-mobile-nav').addEventListener('click', toggleMobileNav);

      // Get all links nav link with a class of js-link
      const jsLinksList = document.getElementsByClassName('js-link');

      // Add event listener to each link
      Array.from(jsLinksList).forEach((link) => {
        link.addEventListener('click', navigateToPage);
      });
    })
    // Once all the data has been loaded, page sections rendered and the event listeners have been set animate the page in
    .then(() => {
      siteReady();
    })
    // Catch any errors and log to the console
    .catch(error => console.error(error));
}

// Fetch HTML page content util function
function navigateToPage(e) {
  e.preventDefault();
  const shortUrl = e.target.href.replace(`${window.location.origin}/`, '');

  if (shortUrl === 'index.html') {
    // This needs to be rewritten to avoid unnecessary rendering with the home page specific content split out
    initHomePage();
  } else {
    fetch(`${shortUrl}`)
      .then(payload => payload.text())
      .then((payload) => {
        renderPage(payload);
      })
      .then(() => {
        toggleMobileNav();
      });
  }
}

// INIT
// Let the show begin
window.onload = () => {
  // Get json data and render the homepage after an artificial 2 second delay
  setTimeout(initHomePage, 2000);
};
