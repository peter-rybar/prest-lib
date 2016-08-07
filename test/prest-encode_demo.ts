/// <reference path="../src/prest/prest-encode.ts" />

window.onload = () => {
    // UrlEncodedData
    var data = {text: 'Hello World!', num: 5, a:[1, 2, '33']};
    console.log(data);
    var encodedData = prest.encode.UrlEncodedData.encode(data);
    console.log('UrlEncodedData encode: ', encodedData,
        encodedData == "text=Hello%20World!&num=5&a=1&a=2&a=33");
    var decodedData = prest.encode.UrlEncodedData.decode(encodedData);
    console.log('UrlEncodedData decode: ', JSON.stringify(decodedData),
        JSON.stringify(decodedData) == '{"text":"Hello World!","num":"5","a":["1","2","33"]}');

    // Base64
    var string = 'Hello World!';
    var encodedString = prest.encode.Base64.encode(string);
    console.log('Base64 encode: ', encodedString, encodedString == "SGVsbG8gV29ybGQh");
    var decodedString = prest.encode.Base64.decode(encodedString);
    console.log('Base64 decode: ', decodedString, decodedString == "Hello World!");
};
