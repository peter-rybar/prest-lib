/// <reference path="../src/prest/prest-component.ts" />

import Component = prest.components.Component;

window.onload = () => {

    class Item {
        constructor(public text, public count) {
        }
    }

    class MyComponent implements Component {

        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        render():HTMLElement {
            var self = this;
            return <ol>
                { self._items.map((item) => {
                    return <li onclick={ (e) => { e.stopPropagation(); self._onSelect(item); } }>
                        <span class="label">{ item.text }</span>{ ' ' }
                        <small class="count">[{ item.count }]</small>
                    </li>;
                })
                }
            </ol>;
        }

    }

    // create component
    var myComponent = new MyComponent(
        [
            new Item('text 1', 1),
            new Item('text 2', 2),
            new Item('text 3', 3)
        ]
    );

    // setup component
    myComponent.onSelect((item) => {
        console.log('selected:', item);
        var selected = document.getElementById('selected') as HTMLSpanElement;
        selected.innerHTML = JSON.stringify(item);
    });

    // render component and add into DOM
    var myComponentElement = myComponent.render();

    var container = document.getElementById('container') as HTMLDivElement;
    container.appendChild(myComponentElement);
};
