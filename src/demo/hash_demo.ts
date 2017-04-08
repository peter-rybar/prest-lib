import * as hash from "../main/prest/hash";
import * as encode from "../main/prest/encode";
import { select } from "../main/prest/dom";


const oe = select("#output");
oe.innerHTML = "test";

const h: hash.Hash<any> = new hash.Hash<any>();
h.setEncoder((data) => {
    return encode.UrlEncodedData.encode(data);
    // return encode.Base64.encode(
    //    encode.UrlEncodedData.encode(data));
});
h.setDecoder((str) => {
    return encode.UrlEncodedData.decode(str);
    // return encode.UrlEncodedData.decode(
    //    encode.Base64.decode(str));
});
h.onChange((data) => {
    console.log("hash: " + JSON.stringify(data));
    oe.innerHTML += "<br/>" + "hash: " + JSON.stringify(data);
});
h.write({aaa: "aaa"});

select("#hash").onclick = (e: MouseEvent) => {
    h.write({aaa: new Date().getTime()});
};
