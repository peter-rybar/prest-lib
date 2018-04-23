import * as sidebar from "./sidebar";
import { html, select, Widget } from "../../../main/dom";

class Content implements Widget {
    name: string;
    mount(el: HTMLElement): this {
        el.appendChild(html(`<p>content text</p>`));
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
    .mount(select("#sidebar"));


select("#btn").addEventListener("click", () => {
    s.open();
    // setTimeout(() => s.cancel(), 3000);
});

