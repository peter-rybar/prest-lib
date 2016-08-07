/// <reference path="../../src/prest/prest-component.ts" />

module components {

    export class Item {
        constructor(public title:string, public url:string, public thumb:string) {
        }
    }

    export class Gallery implements prest.components.Component {

        private _element:HTMLDivElement;
        private _items:Item[] = [];
        private _onSelect:(item)=>void;

        constructor(items:Item[]) {
            this._items = items;
        }

        onSelect(callback:(item:Item)=>void) {
            this._onSelect = callback;
        }

        render():HTMLElement {
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
                e = e || window.event;
                var target = e.target || e.srcElement;
                if (target.nodeName == 'IMG') {
                    var anchor = target.parentNode;
                    var imageEl = div.getElementsByClassName('gallery-image')[0];
                    this._renderImage({
                        title: anchor.title,
                        url: anchor.href,
                        thumb: ''});
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
                this._renderImage(this._items[0]);
            }
            this._renderThumbs(this._items);
        }

        private _renderImage(item:Item):void {
            var e = this._element.getElementsByClassName('gallery-image')[0];
            e.innerHTML = `
                <img src="${item.url}"
                     alt="${item.title}">
                `;
        }

        private _renderThumbs(items:Item[]):void {
            var thumbs = this._items.map((item) => {
                return `
                    <a href="${item.url}"
                       title="${item.title}"><img
                       src="${item.thumb}"></a>
                    `;
            });
            var e = this._element.getElementsByClassName('gallery-thumbs')[0];
            e.innerHTML = thumbs.join('');
        }

    }

}
