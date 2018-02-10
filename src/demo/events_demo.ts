import { Events } from "../main/prest/events";


const es = new Events<number>(3);

es.on(undefined, (data, ctx, e) => console.log("on all:", data, ctx, e));

es.emit("e", "eee1");
es.on("e", (data, ctx, e) => console.log(data, ctx, e));
es.emit("e", "eee2");
es.off("e");
es.emit("e", "eee3");

es.off(undefined);

es.once(undefined, (data, ctx, e) => console.log("once all:", data, ctx, e));

es.emit("o", "ooo1");
es.once("o", (data, ctx, e) => console.log(data, ctx, e));
es.emit("o", "ooo2");
es.emit("o", "ooo3");
