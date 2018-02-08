/// <reference path="../../node_modules/moment/moment.d.ts" />

// import * as moment from "moment";
declare const moment: any;

console.log(new Date().toString());
console.log(new Date().toISOString());
console.log(new Date().toUTCString());
console.log(new Date().toDateString());
console.log(new Date().toTimeString());

console.log("");
console.log(moment(new Date()).locale("en").format());
console.log(moment(new Date()).locale("sk").format());

console.log("");
console.log(moment(new Date().toISOString(), moment.ISO_8601).format());
console.log(moment(new Date().toISOString(), moment.ISO_8601).format("L LT"));
console.log(moment(new Date().toISOString(), moment.ISO_8601).format("l"));

console.log("");
console.log(moment("2018-01-01").format("LLLL"));
console.log(moment("2018-01-01").locale("en_GB").format("LLLL"));
console.log(moment("2018-01-01").locale("en").format("LLLL"));
console.log(moment("2018-01-01").locale("fr").format("LLLL"));
console.log(moment("2018-01-01").locale("sk").format("LLLL"));

console.log("");
console.log(moment("2018-01-15").locale("en_GB").format("L"));
console.log(moment("2018-01-15").locale("en").format("L"));
console.log(moment("2018-01-15").locale("fr").format("L"));
console.log(moment("2018-01-15").locale("sk").format("L"));

console.log("");
console.log(moment("2018-01-15").locale("en_GB").format("l"));
console.log(moment("2018-01-15").locale("en").format("l"));
console.log(moment("2018-01-15").locale("fr").format("l"));
console.log(moment("2018-01-15").locale("sk").format("l"));

console.log("");
console.log(moment("2018-01-15").locale("en_GB").format("l LT"));
console.log(moment("2018-01-15").locale("en").format("l LT"));
console.log(moment("2018-01-15").locale("fr").format("l LT"));
console.log(moment("2018-01-15").locale("sk").format("l LT"));

console.log("");
console.log(moment("2018-01-15").locale("en_GB").format("LT"));
console.log(moment("2018-01-15").locale("en").format("LT"));
console.log(moment("2018-01-15").locale("fr").format("LT"));
console.log(moment("2018-01-15").locale("sk").format("LT"));

console.log("");
moment.locale("sk");
console.log(moment("01.03.2013", "L").toISOString());
moment.locale("en");
console.log(moment("03/01/2013", "L").toISOString());
console.log("");
console.log(moment("01.03.2013", "L", "sk").toISOString());
console.log(moment("03/01/2013", "L", "en").toISOString());
console.log(moment("03/01/2013", "L", "fr").toISOString());

console.log("");
const iso = "2017-03-15T00:00:00+01:00";
console.log(iso);
const sk = moment(iso, moment.ISO_8601).locale("sk").format("l");
console.log(sk);
console.log(moment(sk, "L", "sk").format());

console.log(moment("abc", "l", "sk").format());
console.log(moment("15.1.2017", "l", "sk").isValid());
console.log(moment("abc", "l", "sk").isValid());
console.log(moment("", "l", "sk").isValid());

numeral.locale("sk");

console.log(numeral(123456.789).format());
console.log(numeral(123456.789).format("0,0.0"));
console.log(numeral(123456.789).format("0,0.00"));
console.log(numeral(123456.789).format("0,0.0[0000]"));
console.log(numeral(123456.78).format("0,0.0[0000]"));

console.log(numeral("123.45").value());
console.log(numeral("123,45").value());
console.log(numeral("123.45,67").value());
console.log(numeral("123,45.67").value());

numeral.locale("en");

console.log(numeral(123456.789).format());
console.log(numeral(123456.789).format("0,0.0"));
console.log(numeral(123456.789).format("0,0.00"));
console.log(numeral(123456.789).format("0,0.0[0000]"));
console.log(numeral(123456.78).format("0,0.0[0000]"));

console.log(numeral("123.45").value());
console.log(numeral("123,45").value());
console.log(numeral("123.45,67").value());
console.log(numeral("123,45.67").value());

console.log(numeral("sa").value());

numeral.locale("sk");
console.log(numeral("abc"));

// console.log("-----------------------------------");
