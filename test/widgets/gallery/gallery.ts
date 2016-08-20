/// <reference path="../../../src/prest/prest-widgets.ts" />

module gallery {

    export class Item {
        constructor(public title:string, public url:string, public thumb:string) {
        }
    }

    export class GalleryWidget implements prest.widgets.Widget {

        private _element:HTMLDivElement;
        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        element():HTMLElement {
            var div = document.createElement('div');
            this._element = div;
            div.innerHTML = `
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
            `;

            var updateImage = (e) => {
                e.stopPropagation();
                var event = e || window.event;
                var target = (event.target || e.srcElement) as HTMLElement;
                if (target.nodeName == 'IMG') {
                    var a = target.parentNode as HTMLAnchorElement;
                    var i = div.getElementsByClassName('gallery-image')[0]
                        .getElementsByTagName('img')[0] as HTMLImageElement;
                    i.alt = a.title;
                    i.src = a.href;
                }
                return false;
            };

            var thumbs = div.getElementsByClassName('gallery-thumbs')[0] as HTMLDivElement;
            thumbs.onclick = updateImage;
            thumbs.onmouseover = updateImage;

            this._render();
            return div;
        }

        private _render():void {
            if (this._items.length > 0) {
                var item = this._items[0];
                var e = this._element.getElementsByClassName('gallery-image')[0];
                e.innerHTML = `<img src="${item.url}" alt="${item.title}">`;
            }
            var t = this._element.getElementsByClassName('gallery-thumbs')[0];
            t.innerHTML = this._items.map((item) => {
                return `<a href="${item.url}" title="${item.title}"><img src="${item.thumb}"></a>`;
            }).join(' ');
        }

    }

}
