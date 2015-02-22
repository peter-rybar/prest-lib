/// <reference path="prest.ts" />

module prest.dom {

	export var signalWindowLoad: prest.Signal<void> = new prest.Signal<void>();

	(function () {
		if (typeof window !== 'undefined') {
			window.onload = function (e) {
					signalWindowLoad.emit();
				};
		}
	})();

}
