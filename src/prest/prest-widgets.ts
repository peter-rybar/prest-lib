module prest.widgets {

    export interface Widget {
        element():HTMLElement;
    }


    export abstract class XWidget implements Widget {

        static element(html:string):HTMLElement {
            var d:HTMLElement = document.createElement('div');
            d.innerHTML = html.trim();
            var f:DocumentFragment = document.createDocumentFragment();
            return f.appendChild(d.removeChild(d.firstChild)) as HTMLElement;
        }

        static xEventsBind(element, context, prefix='x-') {
            var events = [];
            for (var k in context) {
                var m = k.match(/^_([a-z]+)_.*/);
                if (m && events.indexOf(m[1]) == -1) {
                    events.push(m[1]);
                }
            }
            // for (var k in element) {
            //     if (k.search('on') === 0) {
            //         events.push(k.slice(2));
            //     }
            // }
            // console.log(events);
            for (var eventType of events) {
                var x = element.querySelectorAll('[' + prefix + eventType + ']');
                // console.log('xEventsBind: ', eventType, x);
                if (x.length) {
                    // console.debug('xEventsBind: ', prefix + eventType);
                    element.addEventListener(eventType, function (e) {
                        e.stopPropagation();
                        var event = e || window.event;
                        var target = (event.target || e.srcElement) as HTMLElement;
                        if (target.hasAttribute(prefix + event.type)) {
                            var methodName = target.getAttribute(prefix + event.type);
                            var method = context[methodName];
                            // console.debug('xEventsBind call: ', event.type, methodName, method);
                            if (method) {
                                method.call(context, target, event);
                            } else {
                                console.warn('xEventsBind method mising: ', methodName);
                            }
                        }
                        return false;
                    })
                }
            }
        }

        protected _element:HTMLElement;

        element():HTMLElement {
            if (!this._element) {
                this._element = this._render();
            }
            return this._element;
        }

        protected abstract _render():HTMLElement;

    }

}
