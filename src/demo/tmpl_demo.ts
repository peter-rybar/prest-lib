import { tmpla, tmplo, tmpl } from "../main/prest/tmpl";

console.log("tmpla: ${0} ${1} ${0}", "|", tmpla("tmpla: ${0} ${1} ${0}", ["A", "B"]));
console.log("tmplo: ${a} ${b} ${a}", "|", tmplo("tmplo: ${a} ${b} ${a}", { a: "A", b: "B" }));
console.log("tmpl : ${a} ${b} ${a}", "|", tmpl("tmpl : ${a} ${b} ${a}")({ a: "A", b: "B" }));
console.log("tmpl : ", tmpl("tmpl : ${a} ${b} ${a}"));
