/// <reference path="../src/prest/prest-widgets.ts" />

window.onload = () => {

    class Item {
        constructor(public text:string, public count:number) {
        }
    }

    class MyWidget extends prest.widgets.XWidget {

        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            super();
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        addItem(item:Item) {
            item.text += this._items.length + 1;
            item.count = this._items.length + 1;
            this._items.push(item);
            this._element.innerHTML = this._itemsHtml();
        }

        protected _render():HTMLElement {
            var e = prest.widgets.XWidget.element(`<ol class="widget"></ol>`);
            e.innerHTML = this._itemsHtml();
            prest.widgets.XWidget.xEventsBind(e, this);
            return e;
        }

        private _itemsHtml():string {
            return this._items.map((item, i) => {
                return `
                    <li>
                        <span class="label" x-click="_click_" data-id="${i}">${item.text}</span>
                        <small class="count" x-click="_click_" data-id="${i}">[${item.count}]</small>
                    </li>`;
            }).join('\n');
        }

        private _click_(target, event):void {
            if (target.hasAttribute('data-id')) {
                var id = target.getAttribute('data-id');
                this._onSelect && this._onSelect(this._items[id]);
            }
        }

    }

    var myWidget = new MyWidget(
        [
            new Item('text 1', 1),
            new Item('text 2', 2),
            new Item('text 3', 3)
        ]
    );

    myWidget.onSelect((item) => {
        console.log('selected:', item);
        var selected = document.getElementById('selected') as HTMLSpanElement;
        selected.innerHTML = JSON.stringify(item);
        myWidget.addItem(new Item('text ', 0));
    });

    var myWidgetElement = myWidget.element();

    var container = document.getElementById('container') as HTMLDivElement;
    container.appendChild(myWidgetElement);
};
