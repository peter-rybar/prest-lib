/// <reference path="../src/prest/prest-history.ts" />

interface PageState {
    title:string;
    content:string;
}

window.onload = function () {

    var pages:{[key:string]:PageState;} = {
        'prest-history_test': {
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
    var navLinks = document.querySelectorAll('.load-content');
    var titleElement = document.getElementById('title');
    var contentElement = document.getElementById('content');

    function displayPage(state) {
        // Check to make sure that this state object is not null.
        if (state) {
            document.title = state.title;
            titleElement.innerHTML = state.title;
            contentElement.innerHTML = state.content;
        }
    }

    var history = new prest.history.History<PageState>();

    history.onChange((pageState) => {
        displayPage(pageState);
    });


    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault();
            var pageURL = this.attributes['href'].value;
            var pageState = pages[pageURL.split('.')[0]];
            displayPage(pageState);
            history.pushState(pageState, pageState.title, pageURL);
        });
    }


    displayPage(pages['prest-history_test']);

    history.replaceState(pages['prest-history_test'], pages['prest-history_test'].title, '');
};