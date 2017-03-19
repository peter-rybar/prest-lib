import * as sidebar from "./sidebar";
import { Widget } from "../../../main/prest/widgets";

class Content implements Widget {
    name: string;
    mount(el: HTMLElement): this {
        const e = document.createElement("p");
        e.innerHTML = "content text";
        el.appendChild(e);
        return this;
    }
    umount(): this {
        return this;
    }
}

const s = new sidebar.Sidebar()
    .setTitle("title")
    .setCancelOnClickOut()
    .setCancelOnEsc()
    .onSigOpen(() => {
        console.log("open");
    })
    .onSigClose(() => {
        console.log("close");
    })
    .onSigCancel(() => {
        console.log("cancel clicked");
    })
    .setContent(new Content())
    .mount(document.getElementById("sidebar"));


document.getElementById("btn").addEventListener("click", () => {
    s.open();
    // setTimeout(() => s.cancel(), 3000);
});

