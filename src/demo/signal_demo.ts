import {Signal} from "../main/prest/signal";


const s: Signal<string> = new Signal<string>();

console.log("-------------------------------------");

const slotFunction = (data) => {
    console.log("function data: " + data);
};

s.connect(slotFunction);

s.emit("emit");

console.log("disconnect");
s.disconnect(slotFunction);

s.emit("emit");

console.log("-------------------------------------");

class X {
    slotMethod(data: string): void {
        console.log("method data: " + data, this);
    }
}

const x = new X();

s.connect(x.slotMethod, x);

s.emit("emit");

console.log("disconnect");
s.disconnect(x.slotMethod, x);

s.emit("emit");

console.log("-------------------------------------");


class A {
    private a = "A.a";

    sigNum = new Signal<number>();
    sigStr = new Signal<string>();

    slot(data/*:number*/) {
        console.log("A.slot() data: '" + this.a + "' " + " " + data);
    }
}

class B {
    private a = "B.a";

    slot = (data: number) => {
        console.log("B.slot() data: '" + this.a + "' " + " " + data);
    }
}

function slot(data: number) {
    console.log("slot() data: '" + this.a + "' " + " " + data);
}

const a = new A();

const b = new B();

a.sigNum.connect(a.slot);
a.sigNum.connect(a.slot, a);
a.sigNum.connect(a.slot, b);
a.sigNum.connect(b.slot);
a.sigNum.connect(b.slot, b);
a.sigNum.connect(b.slot, a);
a.sigNum.connect(slot);
a.sigNum.connect(slot, a);
a.sigNum.connect(slot, b);
a.sigNum.emit(5);

console.log("-------------------------------------");

a.sigStr.connect(a.slot, a);
// a.sigStr.slot = slot; // ES5

a.sigStr.emit("str");

console.log("freeze");
a.sigStr.freeze();
a.sigStr.emit("str");

console.log("unfreeze");
a.sigStr.unfreeze();
a.sigStr.emit("str");
