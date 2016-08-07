/// <reference path="../src/prest/prest-dom.ts" />

window.onload = () => {
    var divElement = prest.dom.element(`<span>text</span>`);
    console.log(divElement);

    var url = './';
    var template = `
        <a href="${url}" target="_blank">
            link
        </a>
        `;
    console.log(template);

    var e = document.getElementById('test');
    e.appendChild(divElement);

    var link = prest.dom.element(template);
    console.log(link);

    divElement.appendChild(link);
    console.log(divElement);

};
