
export interface Attrs {
    _id?: string;
    _classes?: string[];
    _ref?: string;
    _key?: string;
    _skip?: boolean;
    data?: {[key: string]: any};
    styles?: {[key: string]: string};
    classes?: string[];
    [key: string]: any;
}

export type JsonMLFnc = (e?: HTMLElement) => void;

export interface JsonML extends Array<string | Attrs | JsonMLFnc | JsonML | Widget> {}


export interface JsonMLHandler {
    open(tag: string, attrs: any): boolean;
    close(tag: string): void;
    text(text: string): void;
    fnc(fnc: JsonMLFnc): void;
}

export function jsonml(markup: JsonML, handler: JsonMLHandler): void {
    if (!markup) {
        return;
    }

    const head = markup[0] as string;
    const attrsObj = markup[1] as any;
    const hasAttrs = attrsObj && attrsObj.constructor === Object;
    const childIdx = hasAttrs ? 2 : 1;

    const refSplit = head.split("~");
    const ref = refSplit[1];
    const dotSplit = refSplit[0].split(".");
    const hashSplit = dotSplit[0].split("#");
    const tag = hashSplit[0] || "div";
    const id = hashSplit[1];
    const classes = dotSplit.slice(1);

    let attrs: Attrs;
    if (hasAttrs) {
        attrs = attrsObj as Attrs;
    } else {
        attrs = {};
    }

    if (id) {
        attrs._id = id;
    }
    if (classes.length) {
        attrs._classes = classes;
    }
    if (ref) {
        attrs._ref = ref;
    }

    const skip = handler.open(tag, attrs);

    if (!skip) {
        for (let i = childIdx, l = markup.length; i < l; i++) {
            const node = markup[i] as any;
            if (node === undefined) {
                continue;
            }
            switch (node.constructor) {
                case Array:
                    jsonml(node, handler);
                    break;
                case Function:
                    handler.fnc(node);
                    break;
                case String:
                    handler.text(node);
                    break;
                default:
                    if (node instanceof Widget) {
                        const w = node as Widget;
                        jsonml(w.renderJsonML(), handler);
                    } else {
                        handler.text("" + node);
                    }
            }
        }
    }

    handler.close(tag);
}


class JsonmlHtmlHandler implements JsonMLHandler {

    public html: string = "";

    public pretty: boolean = false;
    public depth: number = 0;
    public indent: string = "    ";

    open(tag: string, attrs: Attrs): boolean {
        const props: any[] = [];
        let id: string;
        let ref: string;
        let classes: string[];
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_key":
                    case "_skip":
                        break;
                    case "_id":
                        id = attrs[a];
                        break;
                    case "_ref":
                        ref = attrs[a];
                        break;
                    case "_classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "data":
                        for (const d in attrs[a]) {
                            if (attrs[a].hasOwnProperty(d)) {
                                if (attrs[a][d].constructor === String) {
                                    props.push(["data-" + d, attrs[a][d]]);
                                } else {
                                    props.push(["data-" + d, JSON.stringify(attrs[a][d])]);
                                }
                            }
                        }
                        break;
                    case "styles":
                        let style = "";
                        for (const d in attrs[a]) {
                            if (attrs[a].hasOwnProperty(d)) {
                                const dd = d.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
                                style += dd + ":" + attrs[a][d] + ";";
                            }
                        }
                        props.push(["style", style]);
                        break;
                    default:
                        if (typeof attrs[a] !== "function") {
                            props.push([a, attrs[a]]);
                        }
                }
            }
        }
        if (this.pretty) {
            this.html +=  this.indent.repeat(this.depth);
            this.depth++;
        }
        if (ref) {
            props.unshift(["ref", ref]);
        }
        if (classes) {
            props.unshift(["class", classes.join(" ")]);
        }
        if (id) {
            props.unshift(["id", id]);
        }
        const args = props.map(p => `${p[0]}="${p[1]}"`).join(" ");
        this.html += "<" + tag + (args ? " " + args : "") + ">";
        if (this.pretty) {
            this.html += "\n";
        }
        return false;
    }

    close(tag: string): void {
        if (this.pretty) {
            this.depth--;
            this.html +=  this.indent.repeat(this.depth);
        }
        this.html += "</" + tag + ">";
        if (this.pretty) {
            this.html += "\n";
        }
    }

    text(text: string): void {
        if (this.pretty) {
            this.html +=  this.indent.repeat(this.depth);
        }
        this.html += text;
        if (this.pretty) {
            this.html += "\n";
        }
    }

    fnc(fnc: JsonMLFnc): void {
    }

}

export function jsonml2html(markup: JsonML, pretty = false): string {
    const handler = new JsonmlHtmlHandler();
    handler.pretty = pretty;
    jsonml(markup, handler);
    return handler.html;
}


class JsonmlDomHandler implements JsonMLHandler {

    element: HTMLElement;

    private _current: HTMLElement;

    open(tag: string, attrs: Attrs): boolean {
        const e = document.createElement(tag);
        let classes: string[];
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_key":
                    case "_skip":
                        break;
                    case "_id":
                        e.setAttribute("id", attrs[a]);
                        break;
                    case "_ref":
                        e.setAttribute("ref", attrs[a]);
                        break;
                    case "_classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "data":
                        for (const d in attrs[a]) {
                            if (attrs[a].hasOwnProperty(d)) {
                                if (attrs[a][d].constructor === String) {
                                    e.dataset[d] = attrs[a][d];
                                } else {
                                    e.dataset[d] = JSON.stringify(attrs[a][d]);
                                }
                            }
                        }
                        break;
                    case "styles":
                        for (const d in attrs[a]) {
                            if (attrs[a].hasOwnProperty(d)) {
                                (e.style as any)[d] = attrs[a][d];
                            }
                        }
                        break;
                    default:
                        if (typeof attrs[a] === "function") {
                            e.addEventListener(a, attrs[a]);
                        } else {
                            e.setAttribute(a, attrs[a]);
                        }
                }
            }
        }
        if (classes) {
            e.classList.add(...classes);
        }
        if (this._current) {
            this._current.appendChild(e);
            this._current = e;
        } else {
            this.element = e;
            this._current = e;
        }
        return attrs._skip ? true : false;
    }

    close(tag: string): void {
        if (this._current !== this.element) {
            this._current = this._current.parentElement;
        }
    }

    text(text: string): void {
        this._current.appendChild(document.createTextNode(text));
    }

    fnc(fnc: JsonMLFnc): void {
        fnc(this._current);
    }

}

export function jsonml2dom(markup: JsonML): HTMLElement {
    const handler = new JsonmlDomHandler();
    jsonml(markup, handler);
    return handler.element;
}


declare var IncrementalDOM: any;

class JsonmlIDomHandler implements JsonMLHandler {

    open(tag: string, attrs: Attrs): boolean {
        const props: any = [];
        let id: string;
        let ref: string;
        let classes: string[];
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_key":
                    case "_skip":
                        break;
                    case "_id":
                        id = attrs[a];
                        break;
                    case "_ref":
                        ref = attrs[a];
                        break;
                    case "_classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "classes":
                        if (!classes) {
                            classes = [];
                        }
                        classes = classes.concat(attrs[a]);
                        break;
                    case "data":
                        for (const d in attrs[a]) {
                            if (attrs[a].hasOwnProperty(d)) {
                                if (attrs[a][d].constructor === String) {
                                    props.push("data-" + d, attrs[a][d]);
                                } else {
                                    props.push("data-" + d, JSON.stringify(attrs[a][d]));
                                }
                            }
                        }
                        break;
                    case "styles":
                        props.push("style", attrs[a]);
                        break;
                    default:
                        if (typeof attrs[a] === "function") {
                            props.push("on" + a, attrs[a]);
                        } else {
                            props.push(a, attrs[a]);
                        }
                }
            }
        }
        if (ref) {
            props.unshift("ref", ref);
        }
        if (classes) {
            console.log("----------------------", classes);
            props.unshift("class", classes.join(" "));
        }
        if (id) {
            props.unshift("id", id);
        }
        IncrementalDOM.elementOpen(tag, attrs._key || null, null, ...props);
        if (attrs._skip) {
            IncrementalDOM.skip();
        }
        return attrs._skip ? true : false;
    }

    close(tag: string): void {
        IncrementalDOM.elementClose(tag);
    }

    text(text: string): void {
        IncrementalDOM.text(text);
    }

    fnc(fnc: JsonMLFnc): void {
        fnc(IncrementalDOM.currentElement());
    }

}

export function jsonml2idom(markup: JsonML): void {
    jsonml(markup, new JsonmlIDomHandler());
}


export type JsonMLs = Array<JsonML | Widget>;

export function jsonmls2idom(jsonmls: JsonMLs) {
    for (const jsonml of jsonmls) {
        if (jsonml instanceof Widget) {
            const w = jsonml as Widget;
            jsonml2idom(w.renderJsonML());
        } else {
            jsonml2idom(jsonml);
        }
    }
}


export function patch(node: Node, jsonml: JsonML) {
    IncrementalDOM.patch(node, jsonml2idom, jsonml);
}

export function patchAll(node: Node, jsonmls: JsonMLs) {
    IncrementalDOM.patch(node, jsonmls2idom, jsonmls);
}


interface DomWidget {
    domAttach?(): void;
    domDetach?(): void;
}

export abstract class Widget implements DomWidget {

    private static __count = 0;

    readonly type = this.constructor.name;
    readonly id = this.constructor.name + "-" + Widget.__count++;
    readonly dom: HTMLElement;
    readonly refs: { [key: string]: HTMLElement } = {};

    abstract render(patch: boolean): JsonMLs;

    update(node?: Node): this {
        const e = node || this.dom;
        if (e) {
            patchAll(e, this.render(!!e));
        } else {
            console.warn("no element for id: ", this.id);
        }
        return this;
    }

    renderJsonML(): JsonML {
        const jsonMLs = (this as any).render();
        return [
            this.constructor.name, {
                _id: this.id,
                _key: this.id
            },
            ...jsonMLs,
            (e: HTMLElement) => {
                if (!this.dom) {
                    (this as any).dom = e;
                    if ((this as any).domAttach) {
                        (this as any).domAttach();
                    }
                    const observer = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            const removed = mutation.removedNodes as any;
                            for (const r of removed) {
                                if (r.id === this.id) {
                                    (this as any).dom = undefined;
                                    if ((this as any).domDetach) {
                                        (this as any).domDetach();
                                    }
                                }
                            }
                        });
                    });
                    observer.observe(e.parentElement, { childList: true });
                }
                // collect dom refs
                const qsa = e.querySelectorAll("[ref]");
                const refs: { [key: string]: HTMLElement } = {};
                for (let i = 0; i < qsa.length; i++) {
                    const el = qsa[i] as HTMLElement;
                    refs[el.getAttribute("ref")] = el;
                }
                (this as any).refs = refs;
            }
        ];
    }

}


// const observer = new MutationObserver(mutations => {
//     mutations.forEach(mutation => {
//         // console.log(mutation.type);
//         // console.log(mutation.target);
//         // console.log("add", mutation.addedNodes);
//         // console.log("rm", mutation.removedNodes);
//         const added = mutation.addedNodes as any;
//         for (const a of added) {
//             console.log("added", a);
//         }
//         const removed = mutation.removedNodes as any;
//         for (const r of removed) {
//             console.log("removed", r);
//         }
//     });
// });
// const config = {
//     childList: true,
//     // attributes: true,
//     // characterData: true,
//     // subtree: true,
//     // attributeOldValue: true,
//     // characterDataOldValue: true,
//     attributeFilter: [] as string[]
// };
// observer.observe(document.getElementById("app"), config);
// // observer.disconnect();
