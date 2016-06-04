///<reference path="../src/prest/prest-signal.ts" />
/// <reference path="../src/prest/prest-hash.ts" />
/// <reference path="../src/prest/prest-http.ts" />
/// <reference path="../src/prest/prest-encode.ts" />

import Signal = prest.signal.Signal;
import Hash = prest.hash.Hash;


//-----------------------------------------------------------------------------
// test signals

var s:Signal<string> = new Signal<string>();

var id:number = s.connect((data) => {
    console.log("data: " + data);
});
// ES5
//s.slot = (data) => {
//    console.log("slot data: " + data);
//};

s.emit("emittt");

s.disconnect(id);

s.emit("emittt");

console.log("-------------------------------------");


class A {
    private a = "A.a";

    signalNum = new Signal<number>();
    signalStr = new Signal<string>();

    slot(data) {
        console.log("A.slot() data: '" + this.a + "' " + " " + data);
    }
}

class B {
    private a = "B.a";

    slot = (data) => {
        console.log("B.slot() data: '" + this.a + "' " + " " + data);
    }
}

function slot(data) {
    console.log("slot() data: '" + this.a + "' " + " " + data);
}

var a = new A();

var b = new B();

a.signalNum.connect(a.slot);
a.signalNum.connect(a.slot, a);
a.signalNum.connect(a.slot, b);
a.signalNum.connect(b.slot);
a.signalNum.connect(b.slot, b);
a.signalNum.connect(b.slot, a);
a.signalNum.connect(slot);
a.signalNum.connect(slot, a);
a.signalNum.connect(slot, b);
a.signalNum.emit(5);

console.log("-------------------------------------");

a.signalStr.connect(a.slot, a);
//a.signalStr.slot = slot; // ES5

a.signalStr.emit("str");


//-----------------------------------------------------------------------------
// test dom

console.log("DOM");

window.onload = main;

function main() {
    console.log("main()");

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

    new prest.http.HttpRequest()
        .url('https://maps.googleapis.com/maps/api/geocode/json',
             {sensor: false, address: 'Bratislava I', xxx: ['yyy', 'zzz']})
        .method('GET')
        .onResponse((response:prest.http.HttpResponse) => {
            console.log("response: " + response.getContentType(), response.getJson());
        })
        .onError((error) => {
            console.log("response error: ", error);
        })
        .send();

    prest.http.GET(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {sensor: false, address: 'Bratislava II', xxx: ['yyy', 'zzz']},
        (err, res) => {
            if (err) {
                console.log("response error: ", err);
            } else {
                console.log("response: " + res.getContentType(), res.getJson());
            }
        });

    // UrlEncodedData
    var data = {text: 'Hello World!', num: 5, a:[1, 2, '33']};
    var encodedData = prest.encode.UrlEncodedData.encode(data);
    console.log('UrlEncodedData: ' + encodedData, encodedData == "text=Hello%20World!&num=5&a=1&a=2&a=33");
    var decodedData = prest.encode.UrlEncodedData.decode(encodedData);
    console.log('UrlEncodedData: ' + JSON.stringify(decodedData), JSON.stringify(decodedData) == '{"text":"Hello World!","num":"5","a":["1","2","33"]}');

    // Base64
    var string = 'Hello World!';
    var encodedString = prest.encode.Base64.encode(string);
    console.log('Base64: ' + encodedString, encodedString == "SGVsbG8gV29ybGQh");
    var decodedString = prest.encode.Base64.decode(encodedString);
    console.log('Base64: ' + decodedString, decodedString == "Hello World!");

}
