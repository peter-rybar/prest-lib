module prest.load {

    export function loadScriptPrivate(url:string,
                                      namespace:string,
                                      callback?:(lib:any) => void):void {
        loadScript(url, () => {
            var lib = window[namespace];
            window[namespace] = {};
            delete window[namespace];
            callback(lib);
        });
    }

    export function loadScript(url:string, callback?:() => void):void {
        var script = <HTMLScriptElement> document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = url;

        if ((<any>script).readyState) { // IE
            (<any>script).onreadystatechange = () => {
                var loaded = (<any>script).readyState == 'loaded';
                var completed = (<any>script).readyState == 'complete';
                if (loaded || completed) {
                    (<any>script).onreadystatechange = null;
                    if (typeof callback == 'function') {
                        callback();
                    }
                }
            };
        } else { // Others
            script.onload = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            };
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    export function loadScripts(urls:string[], callback?:() => void):void {
        urls.reverse();
        var callbackTmp = callback;
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            callbackTmp = (function (url, callbackTmp) {
                return () => {
                    loadScript(url, () => {
                        callbackTmp();
                    });
                };
            })(url, callbackTmp);
        }
        callbackTmp();
    }

    export function loadImage(url:string, callback?:() => void):void {
        var img = new Image();
        img.src = url;

        if ((<any>img).readyState) {
            (<any>img).onreadystatechange = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            }
        } else {
            img.onload = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            };
        }
    }

    export function loadCss(url:string, callback?:() => void):void {
        var link = <HTMLLinkElement> document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;

        if ((<any>link).readyState) {
            (<any>link).onreadystatechange = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            }
        } else {
            link.onload = () => {
                if (typeof callback == 'function') {
                    callback();
                }
            };
        }
        document.getElementsByTagName("head")[0].appendChild(link);
    }

}
