import { html, remove, select, Widget } from "../../../main/prest/dom";


export class Item {
    constructor(
        public title: string,
        public url: string,
        public thumb: string) {
    }
}

export class GalleryWidget implements Widget {

    readonly name: string;

    private _element: HTMLDivElement;
    private _items: Item[] = [];
    private _onSelect: (item: Item) => void;

    constructor(name?: string) {
        this.name = name;
    }

    setItems(items: Item[]): this {
        this._items = items;
        return this;
    }

    onSelect(callback: (item: Item) => void): this {
        this._onSelect = callback;
        return this;
    }

    element(): HTMLElement {
        if (!this._element) {
            const div = html(`
                <div>
                    <style>
                        .gallery-image img {
                            width: 550px;
                            height: 400px;
                            border: solid 1px #ccc;
                            padding: 5px;
                        }
                        .gallery-thumbs img {
                            width: 99px;
                            height: 100px;
                            border: solid 1px #ccc;
                            padding: 4px;
                        }
                        .gallery-thumbs img:hover {
                            border-color: #FF9900;
                        }
                    </style>
                    <p class="gallery-image"></p>
                    <div class="gallery-thumbs"></div>
                </div>`) as HTMLDivElement;
            this._element = div;

            const updateImage = (e: Event) => {
                e.preventDefault();
                const event = e || window.event;
                const target = (event.target || e.srcElement) as HTMLElement;
                if (target.nodeName === "IMG") {
                    const a = target.parentNode as HTMLAnchorElement;
                    const i = select(".gallery-image img") as HTMLImageElement;
                    i.alt = a.title;
                    i.src = a.href;
                }
                return false;
            };

            const thumbs = select(".gallery-thumbs", div) as HTMLDivElement;
            thumbs.addEventListener("click", updateImage);
            thumbs.addEventListener("mouseover", updateImage);

            this._render();
        }
        return this._element;
    }

    mount(element: HTMLElement): this {
        element.appendChild(this.element());
        return this;
    }

    umount(): this {
        remove(this._element);
        return this;
    }

    private _render(): void {
        if (this._items.length > 0) {
            const item = this._items[0];
            const e = select(".gallery-image", this._element);
            e.innerHTML = `<img src="${item.url}" alt="${item.title}">`;
        }
        const t = select(".gallery-thumbs", this._element);
        t.innerHTML = this._items.map(item => {
            return `<a href="${item.url}" title="${item.title}"><img src="${item.thumb}"></a>`;
        }).join(" ");
    }

}
