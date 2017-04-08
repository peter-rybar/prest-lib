import * as gallery from "./gallery";
import { select } from "../../../main/prest/dom";

const items: gallery.Item[] = [];
for (let i = 1; i < 6; i++) {
    items.push({
        title: "Image " + i,
        url: `http://placehold.it/500x400.jpg?text=img ${i}`,
        thumb: `http://placehold.it/99x100.jpg?text=img ${i}`
    });
}
// items = items.concat(items);
// console.log(items);

new gallery.GalleryWidget()
    .setItems(items)
    .onSelect(item => {
        console.log("selected:", item);
        const selected = select("#selected") as HTMLSpanElement;
        selected.innerHTML = JSON.stringify(item);
    })
    .mount(select("#gallery"));
