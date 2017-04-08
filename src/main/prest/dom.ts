
export function selectAll(selector: string, element?: HTMLElement): HTMLElement[] {
    const e = element || document;
    const qsa = e.querySelectorAll(selector);
    const a: HTMLElement[] = [];
    for (let i = 0; i < qsa.length; i++) {
        a.push(qsa[i] as HTMLElement);
    }
    return a;
}

export function select(selector: string, element?: HTMLElement): HTMLElement {
    const e = element || document;
    return e.querySelector(selector) as HTMLElement;
}

export function remove(element: HTMLElement): void {
    element.parentElement.removeChild(element);
}

export function empty(element: HTMLElement) {
    element.innerHTML = "";
    // while (element.firstChild /*.hasChildNodes()*/) {
    //     element.removeChild(element.firstChild);
    // }
}


export function html(html: string): HTMLElement {
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

export function jsonml(markup: Array<any>) : HTMLElement {
    let e: HTMLElement;
    markup.forEach((m, i) => {
        if (i === 0) {
            m.split(".").forEach((x: string, i: number) => {
                if (i === 0) {
                    e = document.createElement(x);
                } else {
                    e.classList.add(x);
                }
            });
        } else {
            console.log(m);
            if (m) {
                switch (m.constructor) {
                    case Object:
                        for (const a in m) {
                            if (m.hasOwnProperty(a)) {
                                if (typeof m[a] === "function") {
                                    e.addEventListener(a, m[a]);
                                } else {
                                    e.setAttribute(a, m[a]);
                                }
                            }
                        }
                        break;
                    case Array:
                        e.appendChild(jsonml(m));
                        break;
                    default:
                        e.appendChild(document.createTextNode(m));
                }
            }
        }
    });
    return e;
}


if (!Element.prototype.matches) {
    Element.prototype.matches =
        (Element.prototype as any).matchesSelector ||
        (Element.prototype as any).mozMatchesSelector ||
        (Element.prototype as any).msMatchesSelector ||
        (Element.prototype as any).oMatchesSelector ||
        (Element.prototype as any).webkitMatchesSelector ||
        function(this: any, s: string) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
    };
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


export interface Widget {
    readonly name: string;
    mount(element: HTMLElement): this;
    umount(): this;
}


// class Widgets {
//
//     public names: {[key: string]: Widget[]} = {};
//     public types: {[key: string]: Widget[]} = {};
//
//     mount(element: HTMLElement | string, widget: Widget): this {
//         let e: HTMLElement;
//         if (typeof element === "string") {
//             e = document.getElementById(element);
//         } else {
//             e = element;
//         }
//
//         widget.mount(e);
//
//         const type = widget.constructor.name;
//         if (!this.types[type]) {
//             this.types[type] = [];
//         }
//         this.types[type].push(widget);
//
//         const name = widget.name;
//         if (name) {
//             if (!this.names[name]) {
//                 this.names[name] = [];
//             }
//             this.names[name].push(widget);
//         }
//
//         (e as any).xw = widget;
//
//         return this;
//     }
// }
//
// export const xw = new Widgets();


// Widgets.register("xw-tag", MyWidget);
//
// Widgets.mount(
//     document.getElementsByTagName("xw-tag")[0] as HTMLElement,
//     new MyWidget());
//
// Widgets.mount(
//     document.getElementsByTagName("xw-tag")[0] as HTMLElement);

// xw
//     .mount(
//         document.getElementById("xw-1"),
//         new MyWidget("my-1")
//             .setItems([
//                 new Item("text 1", 1),
//                 new Item("text 2", 2),
//             ])
//             .onSelect(i => console.log(i)))
//     .mount(
//         "xw-2",
//         new MyWidget("my-2")
//             .setItems([
//                 new Item("text 2", 2),
//                 new Item("text 3", 3)
//             ])
//             .onSelect(i => console.log(i)));
//
// console.log(xw.names, xw.types);
//
// Object.keys(xw.names).forEach(n => console.log(n, xw.names[n]));
// Object.keys(xw.types).forEach(t => console.log(t, xw.types[t]));


// type WidgetConstructor =  new () => Widget;
//
// export type WidgetClass =  Function;
//
// export class Widgets {
//
//     private static _widgets: {[key: string]: WidgetClass} = {};
//
//     // static register(xwTagName: string, widgetClass: WidgetClass): void {
//     static register(xwTagName: string, widgetClass: WidgetClass): void {
//         Widgets._widgets[xwTagName.toUpperCase()] = widgetClass;
//     }
//
//     static create(xwTagName: string): Widget {
//         const xwClass = Widgets._widgets[xwTagName] as WidgetConstructor;
//         if (xwClass) {
//             return new xwClass();
//         } else {
//             return null;
//         }
//     }
//
//     static mount(element: HTMLElement, widget?: Widget): void {
//         if (widget) {
//             widget.mount(element);
//             (element as any).xw = widget;
//         } else {
//             const xw = Widgets.create(element.tagName);
//             if (xw) {
//                 xw.mount(element);
//                 (element as any).xw = widget;
//             } else {
//                 console.warn("no Widget regiter for", element.tagName);
//             }
//         }
//     }
//
// }
//
// class MyClass {
// }
//
// const className = (new MyClass() as any).constructor.name;
// console.log(className); // Should output "MyClass"


// class MyWidget implements Widget {
//
//     readonly name: string;
//
//     constructor(name?: string) {
//         this.name = name;
//     }
//
//     mount(element: HTMLElement): this {
//         return this;
//     }
//
// }
//
// const mxw = MyWidget;
//
// Widgets.mount(document.body, new mxw());
// Widgets.mount(document.body, new MyWidget());
