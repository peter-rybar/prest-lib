namespace prest.widgets {

    export interface Widget {
        element(): HTMLElement;
    }


    export function element(html: string): HTMLElement {
        const e: HTMLElement = document.createElement("div");
        e.innerHTML = html.trim();
        const f: DocumentFragment = document.createDocumentFragment();
        return <HTMLElement>f.appendChild(e.removeChild(e.firstChild));
    }

    export function empty(element: HTMLElement) {
        while (element.firstChild /*.hasChildNodes()*/) {
            element.removeChild(element.firstChild);
        }
    }


    if (!Element.prototype.matches) {
        const ep: any = Element.prototype;
        if (ep.webkitMatchesSelector) // Chrome <34, SF<7.1, iOS<8
            ep.matches = ep.webkitMatchesSelector;
        if (ep.msMatchesSelector) // IE9/10/11 & Edge
            ep.matches = ep.msMatchesSelector;
        if (ep.mozMatchesSelector) // FF<34
            ep.matches = ep.mozMatchesSelector;
        if (ep.oMatchesSelector) // Opera
            ep.matches = ep.oMatchesSelector;
    }

    export function addEventListener(element: HTMLElement,
                                     selector: string,
                                     event: string,
                                     listener: (target: HTMLElement, evt: Event) => void,
                                     useCapture: boolean = false) {
        element.addEventListener(
            event,
            function (e: Event) {
                const evt: Event = e || window.event;
                const target = (evt.target || e.srcElement) as HTMLElement;
                if (target && target.matches(selector)) {
                    listener(target, evt);
                }
            },
            useCapture);
    }
    export function removeEventListener(element: HTMLElement,
                                        event: string,
                                        listener: (evt: Event) => void,
                                        useCapture: boolean = false) {
        element.removeEventListener(event, listener, useCapture);
    }

}
