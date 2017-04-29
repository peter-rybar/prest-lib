
declare var IncrementalDOM: any;

const elementOpenStart = IncrementalDOM.elementOpenStart;
const elementOpenEnd = IncrementalDOM.elementOpenEnd;
const elementClose = IncrementalDOM.elementClose;
const currentElement = IncrementalDOM.currentElement;
const skip = IncrementalDOM.skip;
const attr = IncrementalDOM.attr;
const text = IncrementalDOM.text;

function openTag(head: string, keyAttr: any) {
    const dotSplit = head.split(".");
    const hashSplit = dotSplit[0].split("#");

    const tagName = hashSplit[0] || "div";
    const id = hashSplit[1];
    const className = dotSplit.slice(1).join(" ");

    elementOpenStart(tagName, keyAttr);

    if (id) attr("id", id);
    if (className) attr("class", className);

    return tagName;
}

function applyAttrsObj(attrsObj: any) {
    for (const k in attrsObj) {
        if (attrsObj.hasOwnProperty(k)) {
            attr(k, attrsObj[k]);
        }
    }
}

export type JsonML = (string | any[] | {[key: string]: any} | Widget)[];

function jsonml2idom(markup: JsonML) {
    const head = markup[0] as string;
    const attrsObj = markup[1] as any;
    const hasAttrs = attrsObj && attrsObj.constructor === Object;
    const firstChildPos = hasAttrs ? 2 : 1;
    const keyAttr = hasAttrs && attrsObj.key;
    const skipAttr = hasAttrs && attrsObj.skip;

    const tagName = openTag(head, keyAttr);

    if (hasAttrs) applyAttrsObj(attrsObj);

    elementOpenEnd();

    if (skipAttr) {
        skip();
    } else {
        for (let i = firstChildPos, len = markup.length; i < len; i++) {
            const node = markup[i] as any;

            if (node === undefined) continue;

            switch (node.constructor) {
                case Array:
                    jsonml2idom(node);
                    break;
                case Function:
                    node(currentElement());
                    break;
                case String:
                    text(node);
                    break;
                default:
                    if (node instanceof Widget) {
                        const w = node as Widget;
                        jsonml2idom(w.renderJsonML());
                    } else {
                        // console.warn("unsupported type: ", node);
                        text("" + node);
                    }
            }
        }
    }

    elementClose(tagName);
}

export type JsonMLW = (JsonML | Widget)[];

function jsonmlArray2idom(jsonmls: JsonML[]) {
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

export function patchAll(node: Node, jsonmls: JsonMLW) {
    IncrementalDOM.patch(node, jsonmlArray2idom, jsonmls);
}


export abstract class Widget {

    private static __count = 0;

    readonly id = this.constructor.name + "-" + Widget.__count++;

    abstract render(patch: boolean): JsonMLW;

    update(element?: HTMLElement | string): this {
        let e: HTMLElement;
        if (element) {
            if (typeof element === "string") {
                e = document.getElementById(element);
            } else {
                e = element;
            }
        } else {
            e = document.getElementById(this.id);
        }
        if (e) {
            patchAll(e, this.render(!!e));
        } else {
            console.warn("no element for id: ", this.id);
        }
        return this;
    }

    renderJsonML(): JsonML {
        const jsonmlw = (this as any).render();
        return [this.constructor.name, { id: this.id, __key: this.id }, ...jsonmlw];
    }

}

// const observer = new MutationObserver(function(mutations) {
//     mutations.forEach(mutation => {
//         // console.log(mutation.type);
//         // console.log(mutation.target);
//         // console.log("add", mutation.addedNodes);
//         // console.log("rm", mutation.removedNodes);
//         const added = mutation.addedNodes as any;
//         for (const a of added) {
//             console.log(a);
//         }
//         const removed = mutation.removedNodes as any;
//         for (const r of removed) {
//             console.log(r);
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

