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

    export function xEventsBind(element: HTMLElement, context: Object, events: Array<string> = []) {
        // var events = [];
        if (!events.length) {
            // for (var k in context) {
            //     var m = k.match(/^_([a-z]+)_.*/);
            //     if (m && events.indexOf(m[1]) == -1) {
            //         events.push(m[1]);
            //     }
            // }
            for (let k in element) {
                if (element.hasOwnProperty(k) && k.search("on") === 0) {
                    const event = k.slice(2);
                    const x = element.querySelectorAll("[x-" + event + "]");
                    // console.log("xEventsBind: ", event, x);
                    if (x.length) {
                        events.push(event);
                    }
                }
            }
        }
        // console.log(events);
        for (let event of events) {
            // console.debug("xEventsBind: ", "x-" + event);
            element.addEventListener(event, function (e) {
                const evt = e || window.event;
                const target = (evt.target || e.srcElement) as HTMLElement;
                if (target.hasAttribute("x-" + evt.type)) {
                    const methodName = target.getAttribute("x-" + evt.type);
                    const method = context[methodName];
                    // console.debug("xEventsBind call: ", evt.type, methodName, method);
                    if (method) {
                        method.call(context, target, evt);
                    } else {
                        console.warn("xEventsBind missing method: ", methodName);
                    }
                }
                return false;
            });
        }
    }

}
