import * as encode from "../main/prest/encode";

// UrlEncodedData
const dataObj = {text: "Hello World!", num: 5, a: [1, 2, "33"]};
console.log(dataObj);
const encodedData = encode.UrlEncodedData.encode(dataObj);
console.log("UrlEncodedData encode: ", encodedData,
    encodedData === "text=Hello%20World!&num=5&a=1&a=2&a=33");
const decodedData = encode.UrlEncodedData.decode(encodedData);
console.log("UrlEncodedData decode: ", JSON.stringify(decodedData),
    JSON.stringify(decodedData) === `{"text":"Hello World!","num":"5","a":["1","2","33"]}`);

// Base64
const dataStr = "Hello World!";
const encodedString = encode.Base64.encode(dataStr);
console.log("Base64 encode: ", encodedString, encodedString === "SGVsbG8gV29ybGQh");
const decodedString = encode.Base64.decode(encodedString);
console.log("Base64 decode: ", decodedString, decodedString === "Hello World!");
