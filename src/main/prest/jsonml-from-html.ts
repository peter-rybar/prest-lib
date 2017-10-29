/// <reference path="../../../node_modules/@types/sax/index.d.ts" />

import * as sax from "sax";

export function html2jsonml(html: string): any {
    const strict = false; // set to false for html-mode
    const parser = sax.parser(strict, {});

    const jsonml = [] as any;
    const jsonmlPath = [] as any;
    let jsonmlNode = jsonml;

    parser.onerror = error => {
        console.error("error:\t", error);
    };
    parser.ontext = text => {
        // console.log("text:\t", JSON.stringify(text));
        // console.log(jsonml, jsonmlNode, jsonmlPath);
        jsonmlNode.push(text);
    };
    parser.onopentag = node => {
        // console.log("open:\t", JSON.stringify(node));
        const attrKeys = Object.keys(node.attributes);
        let id;
        let classes = [] as string[];
        const attrs = {} as {[key: string]: any};
        const attrData = {} as {[key: string]: any};
        if (attrKeys.length) {
            attrKeys.forEach(key => {
                const value = node.attributes[key] as string;
                if (key === "ID") {
                    id = value;
                } else if (key === "CLASS") {
                    const clss = value.split(" ");
                    classes = classes.concat(clss);
                } else if (/DATA-.+/.test(key)) {
                    const g = /DATA-(.+)/.exec(key);
                    attrData[g[1].toLowerCase()] = value;
                } else {
                    attrs[key.toLowerCase()] = value;
                }
            });
        }
        let name = node.name.toLowerCase();
        if (id) {
            name += "#" + id;
        }
        if (classes.length) {
            name += "." + classes.join(".");
        }
        if (Object.keys(attrData).length) {
            attrs["data"] = attrData;
        }
        const n = [name] as any[];
        if (Object.keys(attrs).length) {
            n.push(attrs);
        }

        jsonmlNode.push(n);
        jsonmlPath.push(n);
        jsonmlNode = n;
        // console.log(">>>", jsonmlPath.map(x => x[0]));
    };
    parser.onclosetag = tag => {
        // console.log("close:\t", JSON.stringify(tag));
        jsonmlPath.pop();
        jsonmlNode = jsonmlPath[jsonmlPath.length - 1];
        // console.log(">>>", jsonmlPath.map(x => x[0]));
    };
    // parser.onattribute = attr => {
    //     // console.log("attr:\t", attr);
    // };
    // parser.onend = () => {
    //     console.log("end:\t");
    // };

    parser.write(html.trim()).close();

    return jsonml[0];
}

// const html = '<body>Hello<hr id="id1" class="c1 c2" data-x="dx"  data-y="dy" />, <em name="world">world</em>!</body>';
// console.log(html, "\n");

// const jsonml = html2jsonml(html);

// // console.log(jsonml);
// // console.log(JSON.stringify(jsonml));
// console.log(JSON.stringify(jsonml, null, 4));




// function mkIndent(count) {
//     let indent = "";
//     for (let i = 0; i < count; i++) {
//         indent += "    ";
//     }
//     return indent;
// }

// function jsonmlPrint(node, depth=0) {
//     switch (node.constructor) {
//         case Array:
//             console.log(mkIndent(depth) + "[" + JSON.stringify(node[0]) +
//                 (node.length > 1 ? "," : ""));
//             for (const i = 1; i < node.length; i++) {
//                 jsonmlPrint(node[i], depth + 1);
//             }
//             console.log(mkIndent(depth) + "]");
//             break;
//         // case Function:
//         //     break;
//         case String:
//             console.log(mkIndent(depth) + JSON.stringify(node) +
//                 (node.length > 1 ? "," : ""));
//             break;
//         default: // Object
//             console.log(mkIndent(depth) + JSON.stringify(node) +
//                 (node.length > 2 ? "," : ""));
//     }
// }

// const html = '<body>Hello<hr id="id1" class="c1 c2" data-x="dx"  data-y="dy" />, <em name="world">world</em>!</body>';
// console.log(html, "\n");

// const jsonml = html2jsonml(html);

// jsonmlPrint(jsonml);
