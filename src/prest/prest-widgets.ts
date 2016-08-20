module prest.widgets {

    export interface Widget {
        element():HTMLElement;
    }


    export function element(html:string):HTMLElement {
        var e:HTMLElement = document.createElement('div');
        e.innerHTML = html.trim();
        var f:DocumentFragment = document.createDocumentFragment();
        return <HTMLElement>f.appendChild(e.removeChild(e.firstChild));
    }

    export function empty(element:HTMLElement) {
        while (element.firstChild /*.hasChildNodes()*/) {
            element.removeChild(element.firstChild);
        }
    }

    export function xEventsBind(element:HTMLElement, context:Object, events:Array<string>=[]) {
        // var events = [];
        if (!events.length) {
            // for (var k in context) {
            //     var m = k.match(/^_([a-z]+)_.*/);
            //     if (m && events.indexOf(m[1]) == -1) {
            //         events.push(m[1]);
            //     }
            // }
            for (var k in element) {
                if (k.search('on') === 0) {
                    var event = k.slice(2);
                    var x = element.querySelectorAll('[x-' + event + ']');
                    // console.log('xEventsBind: ', event, x);
                    if (x.length) {
                        events.push(event);
                    }
                }
            }
        }
        // console.log(events);
        for (var event of events) {
            // console.debug('xEventsBind: ', 'x-' + event);
            element.addEventListener(event, function (e) {
                e.stopPropagation();
                var evt = e || window.event;
                var target = (evt.target || e.srcElement) as HTMLElement;
                if (target.hasAttribute('x-' + evt.type)) {
                    var methodName = target.getAttribute('x-' + evt.type);
                    var method = context[methodName];
                    // console.debug('xEventsBind call: ', evt.type, methodName, method);
                    if (method) {
                        method.call(context, target, evt);
                    } else {
                        console.warn('xEventsBind mising method: ', methodName);
                    }
                }
                return false;
            })
        }
    }

}
