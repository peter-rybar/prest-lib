/// <reference path="prest.ts" />

module prest.hash {

	export class Hash<T> {

		/**
		 * Signal is emitted whenever window.location.hash is changed,
		 * you can connect on signal with slot in form of: slot(hashData).
		 */
		public signalChange: Signal<T>;

		constructor() {
			this.signalChange = new Signal<T>();
		}

		/**
		 * Listen on URL hash fragment changes and emit signalChange
		 */
		public emitChanges() {
			if ('onhashchange' in window) {
				window.onhashchange = () => {
					this.signalChange.emit(this.getHash());
				};
			} else {
				//prest.log.warning('browser "window.onhashchange" not implemented, running emulation');
				var prevHash = window.location.hash;
				window.setInterval(() => {
					if (window.location.hash != prevHash) {
						prevHash = window.location.hash;
						this.signalChange.emit(this.getHash());
					}
				}, 500);
			}
		}

		/**
		 * Returns decoded window.location.hash data
		 */
		public getHash(): T {
			var str = window.location.hash.slice(1);
			return this._deserialize(str);
		}

		/**
		 * Encode data and sets window.location.hash fragment
		 */
		public putHash(hashData: T) {
			var str = this._serialize(hashData);
			window.location.hash = '#' + str;
		}

		private _serialize(data: T, prefix = ''): string {
			var str;
			if (typeof data != 'object') {
				str = data;
			} else {
				var params = [];
				var size = 0;
				for (var key in data) {
					var value = data[key];
					if (!(value instanceof Array)) {
						value = [value];
					}
					var valueLength = value.length;
					for (var i = 0; i < valueLength; i++) {
						var val = value[i];
						if ((typeof val == 'object') && (val != null)) {
							params[size++] = arguments.callee(val, prefix + key + '.');
						} else { // list
							params[size] = encodeURIComponent(prefix + key);
							if (val != null) {
								params[size] += '=' + encodeURIComponent(val);
							}
							size++;
						}
					}
				}
				str = params.join('&');
			}
			return str;
		}

		private _deserialize(str: string): T {
			var data: T = <T>{};
			if (str) {
				var params = str.split('&');
				var paramsLength = params.length;
				for (var j = 0; j < paramsLength; j++) {
					var parameter = params[j].split('=');
					var key = decodeURIComponent(parameter[0]);
					if (parameter.length > 1) {
						var value = decodeURIComponent(parameter[1]);
						var obj = data;
						var path = key.split('.');
						var size = path.length;
						for (var i = 0; i < size; i++) {
							var property = path[i];
							var o = obj[property];
							if (i == (size - 1)) { // list
								if (!o) {
									obj[property] = value;
								} else if (o instanceof Array) {
									obj[property].push(value);
								} else { // create array
									obj[property] = [o];
									obj[property][1] = value;
								}
							} else {
								if (!o) {
									obj[property] = {};
								}
								obj = obj[property];
							}
						}
					} else {
						data[key] = null;
					}
				}
			}
			return data;
		}

	}

}
