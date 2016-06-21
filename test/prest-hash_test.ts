/// <reference path="../src/prest/prest-hash.ts" />
/// <reference path="../src/prest/prest-encode.ts" />

import Hash = prest.hash.Hash;


window.onload = () => {
    var output = document.getElementById("output");
    output.innerHTML = "test";

    var hash:Hash<any> = new Hash<any>();
    hash.setEncoder((data) => {
        return prest.encode.UrlEncodedData.encode(data);
        //return prest.encode.Base64.encode(
        //    prest.encode.UrlEncodedData.encode(data));
    });
    hash.setDecoder((str) => {
        return prest.encode.UrlEncodedData.decode(str);
        //return prest.encode.UrlEncodedData.decode(
        //    prest.encode.Base64.decode(str));
    });
    hash.onChange((data) => {
        console.log('hash: ' + JSON.stringify(data));
        output.innerHTML += '<br/>' + 'hash: ' + JSON.stringify(data);
    });
    hash.write({aaa: 'aaa'});

    var h:HTMLElement = document.getElementById("hash");
    h.onclick = (e:MouseEvent) => {
        hash.write({aaa: new Date().getTime()});
    };
};
