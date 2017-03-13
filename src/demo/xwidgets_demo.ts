import { XWidget, element } from "../main/prest/widgets";

class Item {
    constructor(public text: string, public count: number) {
    }
}

class MyXWidget implements XWidget {

    private _items: Item[] = [];
    private _onSelect: (item: Item) => void;

    private _element: HTMLElement;

    setItems(items: Item[]): this {
        this._items = items;
        this._updateItems();
        return this;
    }

    getItems(): Item[] {
        return this._items;
    }

    addItem(item: Item): this {
        this._items.push(item);
        this._updateItems();
        return this;
    }

    removeItem(item: Item): this {
        this._items = this._items.filter(i => i !== item);
        this._updateItems();
        return this;
    }

    onSelect(callback: (item: Item) => void): this {
        this._onSelect = callback;
        return this;
    }

    mount(el: HTMLElement): void {
        this._element = element(`<ol class="xwidget"></ol>`);
        el.appendChild(this._element);
        this._updateItems();
    }

    private _updateItems(): void {
        if (this._element) {
            this._element.innerHTML = "";
            this._items.map(item => {
                const li = element(`
                        <li>
                            <span class="label" >${item.text}</span>
                            <small class="count">[${item.count}]</small>
                        </li>`);
                li.addEventListener("click", e => {
                    e.stopPropagation();
                    this._onSelect(item);
                });
                this._element.appendChild(li);
            });
        }
    }

}

const myXWidget = new MyXWidget().setItems(
    [
        new Item("text 1", 1),
        new Item("text 2", 2),
        new Item("text 3", 3)
    ]);

myXWidget.onSelect(item => {
    console.log("selected:", item);
    const selected = document.getElementById("selected") as HTMLSpanElement;
    selected.innerHTML = JSON.stringify(item);
    const l = myXWidget.getItems().length;
    myXWidget.addItem(new Item("text " + (l + 1), l + 1));
});

myXWidget.mount(document.getElementById("container"));
