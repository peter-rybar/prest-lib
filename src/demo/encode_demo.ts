import { UrlEncodedData, Base64 } from "../main/prest/encode";


// UrlEncodedData
const dataObj = {text: "Hello World!", num: 5, a: [1, 2, "33"]};
console.log(dataObj);

const encodedData = UrlEncodedData.encode(dataObj);
console.log("UrlEncodedData encode: ", encodedData,
    encodedData === "text=Hello%20World!&num=5&a=1&a=2&a=33");

const decodedData = UrlEncodedData.decode(encodedData);
console.log("UrlEncodedData decode: ", JSON.stringify(decodedData),
    JSON.stringify(decodedData) === `{"text":"Hello World!","num":"5","a":["1","2","33"]}`);


// Base64
const dataStr = "Hello World!";
console.log(dataStr);

const encodedString = Base64.encode(dataStr);
console.log("Base64 encode: ", encodedString, encodedString === "SGVsbG8gV29ybGQh");

const decodedString = Base64.decode(encodedString);
console.log("Base64 decode: ", decodedString, decodedString === "Hello World!");
