module prest.dom {

    export function element(html:string):HTMLElement {
        var e:HTMLElement = document.createElement('div');
        e.innerHTML = html;
        var frag:DocumentFragment = document.createDocumentFragment();
        return <HTMLElement>frag.appendChild(e.removeChild(e.firstChild));
    }

    export function empty(element:HTMLElement) {
        while (element.firstChild /*.hasChildNodes()*/) {
            element.removeChild(element.firstChild);
        }
    }

}
