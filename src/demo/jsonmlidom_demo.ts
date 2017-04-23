import { remove, select, Widget } from "../main/prest/dom";
import { patch } from "../main/prest/jsonmlidom";


class Item {
    constructor(
        public text: string,
        public count: number) {
    }
}

class MyWidget implements Widget {

    readonly name: string;

    private _items: Item[] = [];
    private _onSelect: (item: Item) => void;

    private _element: HTMLElement;

    constructor(name?: string) {
        this.name = name;
    }

    setItems(items: Item[]): this {
        this._items = items;
        this._update();
        return this;
    }

    getItems(): Item[] {
        return this._items;
    }

    addItem(item: Item): this {
        this._items.push(item);
        this._update();
        return this;
    }

    removeItem(item: Item): this {
        this._items = this._items.filter(i => i !== item);
        this._update();
        return this;
    }

    onSelect(callback: (item: Item) => void): this {
        this._onSelect = callback;
        return this;
    }

    mount(e: HTMLElement): this {
        this._element = e;
        this._update();
        return this;
    }

    umount(): this {
        remove(this._element);
        return this;
    }

    private _update(): void {
        if (this._element) {
            patch(this._element,
                ["div",
                    ["form", {
                        onsubmit: (e: Event) => {
                            e.preventDefault();
                            const form = (e.target as HTMLFormElement);
                            const input = (select("input", form) as HTMLInputElement);
                            console.log("submit", input.value);
                            this.addItem(new Item(input.value, this._items.length));
                            input.value = "";
                        }},
                        ["input", {
                            type: "text", name: "text",
                            oninput: (e: Event) => {
                                console.log("input", (e.target as HTMLInputElement).value);
                            },
                            onchange: (e: Event) => {
                                console.log("change", (e.target as HTMLInputElement).value);
                            }}
                        ],
                        ["input", { type: "submit", value: "add"}]
                    ],
                    ["ol",
                        ...this._items.map(item => {
                            return (
                                ["li", {
                                    onclick: (e: Event) => {
                                        e.stopPropagation();
                                        if (this._onSelect) {
                                            this._onSelect(item);
                                        }
                                    }},
                                    ["span.label", item.text], " ",
                                    ["small.count", `[${item.count}]`]
                                ]
                            );
                        })
                    ]
                ]
            );
        }
    }

}

new MyWidget()
    .setItems([
        new Item("text 1", 0),
        new Item("text 2", 1),
        new Item("text 3", 2)])
    .onSelect(item => {
        console.log("selected:", item);
        const selected = select("#selected") as HTMLSpanElement;
        selected.innerHTML = JSON.stringify(item);
    })
    .mount(select("#container"));
