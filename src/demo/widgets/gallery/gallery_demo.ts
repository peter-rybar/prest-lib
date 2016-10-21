import * as gallery from "./gallery";

const items: gallery.Item[] = [];
for (let i = 2; i < 7; i++) {
    items.push({
        title: "Image " + i,
        url: `http://javascript.info/files/tutorial/browser/events/gallery/img${i}-lg.jpg`,
        thumb: `http://javascript.info/files/tutorial/browser/events/gallery/img${i}-thumb.jpg`
    });
}
// items = items.concat(items);
// console.log(items);

const g = new gallery.GalleryWidget(items);

g.onSelect((item) => {
    console.log("selected:", item);
    const selected = document.getElementById("selected") as HTMLSpanElement;
    selected.innerHTML = JSON.stringify(item);
});

const galleryElement = g.element();

const container = document.getElementById("gallery") as HTMLDivElement;
container.appendChild(galleryElement);
