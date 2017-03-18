
export interface Widget {
    element(): HTMLElement;
}

// --------------------------------------------------------------------------

export interface XWidget {
    readonly name: string;
    mount(element: HTMLElement): this;
}

/*
export class XWidgets {

    private static _widgets: {[key: string]: any};

    static register(widgetClass: any): XWidget {
        XWidgets._widgets[] = widgetClass;
        return (new (XWidgets._widgets[name]))();
    }

    static getInstance(name: string): XWidget {
        return (new (XWidgets._widgets[name]))();
    }

}

class MyClass {}

const className = (<any>new MyClass()).constructor.name;
// OR var className = (new MyClass() as any).constructor.name;
console.log(className); // Should output "MyClass"
*/

/*
export function mount(element: HTMLElement, widget?: XWidget): void {
    if (widget) {
        widget.mount(element);
        element["widget"] = widget;
    // } else {
    //     const xw = XWidgets.getInstance(element.tagName);
    //     xw.mount(element);
    //     element["widget"] = xw;
    }
}


class MyXWidget implements XWidget {

    mount(element: HTMLElement): void {}

}

const mxw = MyXWidget;

mount(document.body, new mxw());

mount(document.body, new MyXWidget());
*/


// --------------------------------------------------------------------------


export function element(html: string): HTMLElement {
    html = html.trim();
    // const t = document.createElement("template") as HTMLTemplateElement;
    // if ("content" in t) {
    //     t.innerHTML = html;
    //     return t.content.cloneNode(true) as HTMLElement;
    // } else {
    let wrapMap: any = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        body: [0, "", ""],
        _default: [1, "<div>", "</div>"]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    const match = /<\s*\w.*?>/g.exec(html);
    let el: HTMLElement = document.createElement("div");
    if (match != null) {
        const tag = match[0].replace(/</g, "").replace(/>/g, "").split(" ")[0];
        if (tag.toLowerCase() === "body") {
            const body = document.createElement("body");
            // keeping the attributes
            el.innerHTML = html.replace(/<body/g, "<div").replace(/<\/body>/g, "</div>");
            const attrs = el.firstChild.attributes;
            body.innerHTML = html;
            for (let i = 0; i < attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            const map = wrapMap[tag] || wrapMap._default;
            html = map[1] + html + map[2];
            el.innerHTML = html;
            // Descend through wrappers to the right content
            let j = map[0] + 1;
            while (j--) {
                el = el.lastChild as HTMLElement;
            }
        }
    } else {
        el.innerHTML = html;
        el = el.lastChild as HTMLElement;
    }
    return el;
    // }
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
