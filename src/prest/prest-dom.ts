/// <reference path="prest-signal.ts" />

module prest.dom {

    import Signal = prest.signal.Signal;

    export var signalWindowLoad:Signal<void> = new Signal<void>();

    (function () {
        if (typeof window !== 'undefined') {
            window.onload = function (e) {
                signalWindowLoad.emit();
            };
        }
    })();

}
