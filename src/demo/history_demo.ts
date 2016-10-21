import * as history from "../main/prest/history";

interface PageState {
    title: string;
    content: string;
}


const pages: { [key: string]: PageState; } = {
    history_demo: {
        title: "Home Page",
        content: "This is the home page."
    },
    about: {
        title: "About",
        content: "Some content about the business."
    },
    products: {
        title: "Products",
        content: "Buy some of our great products!"
    },
    contact: {
        title: "Contact",
        content: "Say hello! We love to chat."
    }
};


// Get references to the page elements.
const navLinks = document.querySelectorAll(".load-content");
const titleElement = document.getElementById("title");
const contentElement = document.getElementById("content");

function displayPage(state) {
    // Check to make sure that this state object is not null.
    if (state) {
        document.title = state.title;
        titleElement.innerHTML = state.title;
        contentElement.innerHTML = state.content;
    }
}

const h = new history.History<PageState>();

h.onChange((pageState) => {
    displayPage(pageState);
});


for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function (e) {
        e.preventDefault();
        const pageURL = this.attributes["href"].value;
        const pageState = pages[pageURL.split(".")[0]];
        displayPage(pageState);
        h.pushState(pageState, pageState.title, pageURL);
    });
}


displayPage(pages["history_demo"]);

h.replaceState(pages["history_demo"], pages["history_demo"].title, "");
