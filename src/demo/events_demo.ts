import { Events } from "../main/events";

const es = new Events<number>(3);

es.any((data, ctx, e) => console.log("any:", data, ctx, e));

es.emit("e", "eee1");
es.on("e", (data, ctx, e) => console.log(data, ctx, e));
es.emit("e", "eee2");
es.off("e");
es.emit("e", "eee3");

es.off(Events.any);

es.once(Events.any, (data, ctx, e) => console.log("once all:", data, ctx, e));

es.emit("o", "ooo1");
es.once("o", (data, ctx, e) => console.log(data, ctx, e));
es.emit("o", "ooo2");
es.emit("o", "ooo3");

es.all(["e1", "e3"], (data, ctx, e) => console.log(data, ctx, e));
es.emit("e1", "all e1");
es.emit("e2", "all e2");
es.emit("e3", "all e3");
