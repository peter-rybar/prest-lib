/// <reference path="../src/prest/prest-widgets.ts" />

window.onload = () => {

    class Item {
        constructor(public text: string, public count: number) {
        }
    }

    class MyWidget implements prest.widgets.Widget {

        private _element: HTMLElement;
        private _items: Item[] = [];
        private _onSelect: (item) => void;

        constructor(items: Item[]) {
            this._items = items;
        }

        onSelect(callback: (item: Item) => void) {
            this._onSelect = callback;
        }

        addItem(item: Item) {
            item.text += this._items.length + 1;
            item.count = this._items.length + 1;
            this._items.push(item);
            this._renderItems();
        }

        element(): HTMLElement {
            if (!this._element) {
                const e = prest.widgets.element(`<ol class="widget"></ol>`);
                this._element = e;
                this._renderItems();
                prest.widgets.addEventListener(e, "li, li *", "click",
                    (target: HTMLElement, e: Event) => {
                        if (target.hasAttribute("data-id")) {
                            const id = target.getAttribute("data-id");
                            this._onSelect && this._onSelect(this._items[id]);
                        }
                    });
            }
            return this._element;
        }

        private _renderItems(): void {
            if (this._element) {
                this._element.innerHTML = this._items.map((item, i) => {
                    return `
                        <li data-id="${i}">
                            <span class="label" data-id="${i}">${item.text}</span>
                            <small class="count" data-id="${i}">[${item.count}]</small>
                        </li>`;
                }).join("\n");
            }
        }

    }

    const myWidget = new MyWidget(
        [
            new Item("text 1", 1),
            new Item("text 2", 2),
            new Item("text 3", 3)
        ]
    );

    myWidget.onSelect((item) => {
        console.log("selected:", item);
        const selected = document.getElementById("selected") as HTMLSpanElement;
        selected.innerHTML = JSON.stringify(item);
        myWidget.addItem(new Item("text ", 0));
    });

    const myWidgetElement = myWidget.element();

    const container = document.getElementById("container") as HTMLDivElement;
    container.appendChild(myWidgetElement);
};
