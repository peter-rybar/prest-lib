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

export interface JsonMLObj {
    toJsonML?(): JsonML;
}

export interface JsonML extends Array<string | Attrs | JsonML | JsonMLFnc | JsonMLObj> {
    // 0: string;
    // 1?: Attrs | JsonML | JsonMLFnc | JsonMObj;
}

export interface JsonMLs extends Array<JsonML | string | JsonMLObj> {
}


export interface JsonMLHandler {
    open(tag: string, attrs: Attrs, children: number, ctx?: any): boolean;
    close(tag: string, children: number, ctx?: any): void;
    text(text: string, ctx?: any): void;
    fnc(fnc: JsonMLFnc, ctx?: any): void;
    obj(obj: JsonMLObj, ctx?: any): void;
}

export function jsonml(markup: JsonML, handler: JsonMLHandler, ctx?: any): void {
    if (!markup) {
        return;
    }

    const head = markup[0] as string;
    const attrsObj = markup[1] as any;
    const hasAttrs = attrsObj && attrsObj.constructor === Object;
    const childIdx = hasAttrs ? 2 : 1;

    let children = 0;
    for (let i = childIdx; i < markup.length; i++) {
        if (markup[i].constructor !== Function) {
            children++;
        }
    }

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

    const skip = handler.open(tag, attrs, children, ctx);

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

    handler.close(tag, children, ctx);
}


class JsonmlHtmlHandler implements JsonMLHandler {

    public html: string = "";

    public pretty: boolean = false;
    public depth: number = 0;
    public indent: string = "\t";

    open(tag: string, attrs: Attrs, children: number, ctx?: any): boolean {
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
        this.html += "<" + tag + (args ? " " + args : "") + (children ? ">" : "/>");
        if (this.pretty) {
            this.html += "\n";
        }
        return false;
    }

    close(tag: string, children: number, ctx?: any): void {
        if (this.pretty) {
            this.depth--;
            if (children) {
                this.html += this._indent(this.depth);
            }
        }
        if (children) {
            this.html += "</" + tag + ">";
            if (this.pretty) {
                this.html += "\n";
            }
        }
    }

    text(text: string, ctx?: any): void {
        if (this.pretty) {
            this.html += this._indent(this.depth);
        }
        this.html += text;
        if (this.pretty) {
            this.html += "\n";
        }
    }

    fnc(fnc: JsonMLFnc, ctx?: any): void {
    }

    obj(obj: JsonMLObj, ctx?: any): void {
        if ("toJsonML" in obj) {
            jsonml(obj.toJsonML(), this, obj);
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

    open(tag: string, attrs: Attrs, children: number, ctx?: any): boolean {
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

    close(tag: string, children: number, ctx?: any): void {
        if (this._current !== this.element) {
            this._current = this._current.parentElement;
        }
    }

    text(text: string, ctx?: any): void {
        this._current.appendChild(document.createTextNode(text));
    }

    fnc(fnc: JsonMLFnc, ctx?: any): void {
        fnc(this._current);
    }

    obj(obj: JsonMLObj, ctx?: any): void {
        if ("toJsonML" in obj) {
            jsonml(obj.toJsonML(), this, obj);
        } else {
            this.text("" + obj, ctx);
        }
    }

}

export function jsonml2dom(markup: JsonML, ctx?: any): HTMLElement {
    const handler = new JsonmlDomHandler();
    jsonml(markup, handler, ctx);
    return handler.element;
}


declare var IncrementalDOM: any;

class JsonmlIDomHandler implements JsonMLHandler {

    open(tag: string, attrs: Attrs, children: number, ctx?: any): boolean {
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

    close(tag: string, children: number, ctx?: any): void {
        IncrementalDOM.elementClose(tag);
    }

    text(text: string, ctx?: any): void {
        IncrementalDOM.text(text);
    }

    fnc(fnc: JsonMLFnc, ctx?: any): void {
        fnc(IncrementalDOM.currentElement());
    }

    obj(obj: JsonMLObj, ctx?: any): void {
        if ("toJsonML" in obj) {
            jsonml(obj.toJsonML(), this, obj);
        } else {
            this.text("" + obj, ctx);
        }
    }

}

function jsonml2idom(markup: JsonML, ctx?: any): void {
    jsonml(markup, new JsonmlIDomHandler(), ctx);
}


function jsonmls2idom(jsonmls: JsonMLs, ctx?: any): void {
    for (const jsonml of jsonmls) {
        if ("toJsonML" in (jsonml as any)) {
            const obj = jsonml as JsonMLObj;
            jsonml2idom(obj.toJsonML(), obj);
        } else if (jsonml.constructor === String) {
            IncrementalDOM.text(jsonml);
        } else {
            jsonml2idom(jsonml as JsonML, ctx);
        }
    }
}


export function patch(node: Node, jsonml: JsonML, ctx?: any): void {
    IncrementalDOM.patch(node,
        (data: JsonML) => jsonml2idom(data, ctx), jsonml);
}

export function patchAll(node: Node, jsonmls: JsonMLs, ctx?: any): void {
    IncrementalDOM.patch(node,
        (data: JsonMLs) => jsonmls2idom(data, ctx), jsonmls);
}
