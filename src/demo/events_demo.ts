import { Events } from "../main/prest/events";


const e = new Events();

e.on(undefined, (data, e) => console.log("on all:", data, e));

e.emit("e", "eee1");
e.on("e", (data, e) => console.log(data, e));
e.emit("e", "eee2");
e.off("e");
e.emit("e", "eee3");

e.off(undefined);

e.once(undefined, (data, e) => console.log("once all:", data, e));

e.emit("o", "ooo1");
e.once("o", (data, e) => console.log(data, e));
e.emit("o", "ooo2");
e.emit("o", "ooo3");
