
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

function jsonml2idom(markup: Array<any>) {
    const head = markup[0];
    const attrsObj = markup[1];
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
            const node = markup[i];

            if (node === undefined) continue;

            switch (node.constructor) {
                case Array:
                    jsonml2idom(node);
                    break;
                case Function:
                    node(currentElement());
                    break;
                default:
                    text(node);
            }
        }
    }

    elementClose(tagName);
}

export function patch(node: Node, jsonml: Array<any>) {
    IncrementalDOM.patch(node, jsonml2idom, jsonml);
}
