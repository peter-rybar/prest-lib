/// <reference path="../src/prest/prest-widgets.ts" />

window.onload = () => {

    class Item {
        constructor(public text:string, public count:number) {
        }
    }

    class MyWidget implements prest.widgets.Widget {

        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        element():HTMLElement {
            var _this = this;
            return <ol>
                { _this._items.map((item) => {
                    return <li onclick={
                            (e) => {
                                e.stopPropagation();
                                _this._onSelect(item);
                            }
                        }>
                        <span class="label">{ item.text }</span>{ ' ' }
                        <small class="count">[{ item.count }]</small>
                    </li>;
                })
                }
            </ol>;
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
    });

    var myWidgetElement = myWidget.element();

    var container = document.getElementById('container') as HTMLDivElement;
    container.appendChild(myWidgetElement);
};
