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

export type JsonMLCtx = any;

export interface JsonML extends Array<string | Attrs | JsonML | JsonMLFnc | JsonMLCtx> {
    // 0: string;
    // 1?: Attrs | JsonML | JsonMLFnc | JsonMLCtx;
}

export interface JsonMLs extends Array<JsonML | string | JsonMLCtx> {
}


export interface JsonMLHandler {
    open(tag: string, attrs: Attrs, ctx?: JsonMLCtx): boolean;
    close(tag: string, ctx?: JsonMLCtx): void;
    text(text: string, ctx?: JsonMLCtx): void;
    fnc(fnc: JsonMLFnc, ctx?: JsonMLCtx): void;
    obj(obj: any, ctx?: JsonMLCtx): void;
}

export function jsonml(markup: JsonML, handler: JsonMLHandler, ctx?: JsonMLCtx): void {
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

    const skip = handler.open(tag, attrs, ctx);

    if (!skip) {
        for (let i = childIdx, l = markup.length; i < l; i++) {
            const node = markup[i] as any;
            if (node === undefined) {
                continue;
            }
            switch (node.constructor) {
                case Array:
                    jsonml(node, handler, ctx);
                    break;
                case Function:
                    handler.fnc(node, ctx);
                    break;
                case String:
                    handler.text(node, ctx);
                    break;
                default:
                    handler.obj(node, ctx);
            }
        }
    }

    handler.close(tag, ctx);
}


class JsonmlHtmlHandler implements JsonMLHandler {

    public html: string = "";

    public pretty: boolean = false;
    public depth: number = 0;
    public indent: string = "\t";

    open(tag: string, attrs: Attrs, ctx?: JsonMLCtx): boolean {
        const props: any[] = [];
        let id: string = attrs._id;
        let classes: string[] = attrs._classes ? attrs._classes : [];
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_id":
                    case "_classes":
                    case "_ref":
                    case "_key":
                    case "_skip":
                        break;
                    case "id":
                        id = attrs[a];
                        break;
                    case "classes":
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
            this.html += this._indent(this.depth);
            this.depth++;
        }
        if (classes.length) {
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

    close(tag: string, ctx?: JsonMLCtx): void {
        if (this.pretty) {
            this.depth--;
            this.html += this._indent(this.depth);
        }
        this.html += "</" + tag + ">";
        if (this.pretty) {
            this.html += "\n";
        }
    }

    text(text: string, ctx?: JsonMLCtx): void {
        if (this.pretty) {
            this.html += this._indent(this.depth);
        }
        this.html += text;
        if (this.pretty) {
            this.html += "\n";
        }
    }

    fnc(fnc: JsonMLFnc, ctx?: JsonMLCtx): void {
    }

    obj(obj: any, ctx?: JsonMLCtx): void {
        if (obj instanceof Widget) {
            const w = obj as Widget;
            jsonml(w.renderJsonML(), this, w);
        } else {
            this.text("" + obj, ctx);
        }
    }

    private _indent(count: number): string {
        let indent = "";
        for (let i = 0; i < count; i++) {
            indent += this.indent;
        }
        return indent;
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

    open(tag: string, attrs: Attrs, ctx?: JsonMLCtx): boolean {
        const e = document.createElement(tag);
        let id: string = attrs._id;
        let classes: string[] = attrs._classes ? attrs._classes : [];
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_id":
                    case "_classes":
                    case "_ref":
                    case "_key":
                    case "_skip":
                        break;
                    case "id":
                        id = attrs[a];
                        break;
                    case "classes":
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
        if (id) {
            e.setAttribute("id", id);
        }
        if (classes.length) {
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

    close(tag: string, ctx?: JsonMLCtx): void {
        if (this._current !== this.element) {
            this._current = this._current.parentElement;
        }
    }

    text(text: string, ctx?: JsonMLCtx): void {
        this._current.appendChild(document.createTextNode(text));
    }

    fnc(fnc: JsonMLFnc, ctx?: JsonMLCtx): void {
        fnc(this._current);
    }

    obj(obj: any, ctx?: JsonMLCtx): void {
        if (obj instanceof Widget) {
            const w = obj as Widget;
            jsonml(w.renderJsonML(), this, w);
        } else {
            this.text("" + obj, ctx);
        }
    }

}

export function jsonml2dom(markup: JsonML, ctx?: JsonMLCtx): HTMLElement {
    const handler = new JsonmlDomHandler();
    jsonml(markup, handler, ctx);
    return handler.element;
}


declare var IncrementalDOM: any;

class JsonmlIDomHandler implements JsonMLHandler {

    open(tag: string, attrs: Attrs, ctx?: JsonMLCtx): boolean {
        const props: any = [];
        let id: string = attrs._id;
        let classes: string[] = attrs._classes ? attrs._classes : [];
        let ref: string = attrs._ref;
        for (const a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                switch (a) {
                    case "_id":
                    case "_classes":
                    case "_ref":
                    case "_key":
                    case "_skip":
                        break;
                    case "id":
                        id = attrs[a];
                        break;
                    case "classes":
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
        if (classes.length) {
            props.unshift("class", classes.join(" "));
        }
        if (id) {
            props.unshift("id", id);
        }
        IncrementalDOM.elementOpen(tag, attrs._key || null, null, ...props);
        if (attrs._skip) {
            IncrementalDOM.skip();
        }
        if (ctx && ref) {
            ctx.refs[ref] = IncrementalDOM.currentElement();
        }
        return attrs._skip ? true : false;
    }

    close(tag: string, ctx?: JsonMLCtx): void {
        IncrementalDOM.elementClose(tag);
    }

    text(text: string, ctx?: JsonMLCtx): void {
        IncrementalDOM.text(text);
    }

    fnc(fnc: JsonMLFnc, ctx?: JsonMLCtx): void {
        fnc(IncrementalDOM.currentElement());
    }

    obj(obj: any, ctx?: JsonMLCtx): void {
        if (obj instanceof Widget) {
            const w = obj as Widget;
            jsonml(w.renderJsonML(), this, w);
        } else {
            this.text("" + obj, ctx);
        }
    }

}

function jsonml2idom(markup: JsonML, ctx?: JsonMLCtx): void {
    jsonml(markup, new JsonmlIDomHandler(), ctx);
}


function jsonmls2idom(jsonmls: JsonMLs, ctx?: JsonMLCtx): void {
    for (const jsonml of jsonmls) {
        if (jsonml instanceof Widget) {
            const w = jsonml as Widget;
            jsonml2idom(w.renderJsonML(), w);
        } else if (jsonml.constructor === String) {
            IncrementalDOM.text(jsonml);
        } else {
            jsonml2idom(jsonml as JsonML, ctx);
        }
    }
}


export function patch(node: Node, jsonml: JsonML, ctx?: JsonMLCtx): void {
    IncrementalDOM.patch(node,
        (data: JsonML) => jsonml2idom(data, ctx), jsonml);
}

export function patchAll(node: Node, jsonmls: JsonMLs, ctx?: JsonMLCtx): void {
    IncrementalDOM.patch(node,
        (data: JsonMLs) => jsonmls2idom(data, ctx), jsonmls);
}


export interface DomWidget {
    domAttach?(): void;
    domDetach?(): void;
}

export abstract class Widget implements DomWidget {

    private static __count = 0;

    readonly type: string = "Widget"; // this.constructor.name;
    readonly id: string = this.type + "-" + Widget.__count++;
    readonly dom: HTMLElement;
    readonly refs: { [key: string]: HTMLElement } = {};

    private _updateSched: number;

    constructor(type: string = "") {
        if (type) {
            this.type = type;
        }
    }

    abstract render(): JsonMLs;

    mount(e: HTMLElement): this {
        if (!this.dom) {
            (this as any).dom = e;
            const jsonMLs = (this as any).render();
            patchAll(e, jsonMLs, this);
            if ((this as any).domAttach) {
                (this as any).domAttach();
            }
            // onDetach(e, () => {
            //     (this as any).dom = undefined;
            //     if ((this as any).domDetach) {
            //         (this as any).domDetach();
            //     }
            // });
        }
        return this;
    }

    umount(): this {
        if (this.dom) {
            if ((this as any).domDetach) {
                (this as any).domDetach();
            }
            this.dom.parentElement.removeChild(this.dom);
            (this as any).dom = undefined;
        }
        return this;
    }

    update(): this {
        const e = this.dom;
        if (e && !this._updateSched) {
            this._updateSched = setTimeout(() => {
                patchAll(e, this.render(), this);
                this._updateSched = null;
            }, 0);
        }
        return this;
    }

    renderJsonML(): JsonML {
        const jsonMLs = (this as any).render();
        return [this.type, { _id: this.id, _key: this.id },
            ...jsonMLs,
            (e: HTMLElement) => {
                if (!this.dom) {
                    (this as any).dom = e;
                    if ((this as any).domAttach) {
                        (this as any).domAttach();
                    }
                    // onDetach(e, () => {
                    //     (this as any).dom = undefined;
                    //     if ((this as any).domDetach) {
                    //         (this as any).domDetach();
                    //     }
                    // });
                }
            }
        ];
    }

}

// function onDetach(e: HTMLElement, callback: () => void) {
//     new MutationObserver(mutations => {
//         mutations.forEach(mutation => {
//             const removed = mutation.removedNodes as any;
//             for (const r of removed) {
//                 console.log(r, r === e);
//                 if (r === e) {
//                     callback();
//                 }
//             }
//         });
//     }).observe(e.parentElement, { childList: true });
//     // }).observe(e.parentElement, { childList: true, subtree: true });
// }


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
