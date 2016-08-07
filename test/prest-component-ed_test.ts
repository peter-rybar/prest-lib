/// <reference path="../src/prest/prest-component.ts" />

window.onload = () => {

    class Item {
        constructor(public text:string, public count:number) {
        }
    }

    class MyComponent implements prest.components.Component {

        private _element:HTMLUListElement;
        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        render():HTMLElement {
            document.createDocumentFragment();
            var ol = document.createElement('ol');
            this._element = ol;
            ol.onclick = (e) => {
                e.preventDefault();
                var target = e.target as HTMLElement;
                if (target.hasAttribute('data-id')) {
                    var id = target.getAttribute('data-id');
                    this._onSelect(this._items[id]);
                }
                // if (target && target.nodeName == 'SPAN') {
                //     this._onSelect(this._items[id]);
                // }
            };
            this._render();
            return ol;
        }

        private _render():void {
            var ol = this._element;
            var liElements = this._items.map((item, i) => {
                return `
                    <li>
                        <span class="label" data-id="${i}">${item.text}</span>
                        <small class="count" data-id="${i}">[${item.count}]</small>
                    </li>
                    `;
            });
            ol.innerHTML = liElements.join('');

            // var liEls:HTMLLIElement[] = <any>ol.getElementsByTagName('li');
            // var self = this;
            // for (var li of liEls) {
            //     li.onclick = function (e) {
            //         self._onSelect(self._items[this.getAttribute('data-id')]);
            //     };
            // }
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
