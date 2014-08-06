/**
 * pREST Signal-Slot pattern module
 */
module prest.signal {

	interface Slot<T> {
		id: number;
		callback: (data:T) => void;
		object?: any;
	}

	/**
	 * Signal slot pattern class with optional accumulator object.
	 */
	export class Signal<T> {

		private _slots:Slot<T>[];
		private _slot_id;
		number;

		constructor() {
			this._slots = [];
			this._slot_id = 0;
		}

		// ES5
//		set slot(slot: (data: T) => void) {
//			this.connect(slot);
//		}

		public connect(callback:(data:T) => void):number;

		public connect(callback:(data:T) => void, object?:Object):number;

		public connect(callback:(data:any) => void, object?:Object):number {
			var slot_id = this._slot_id++;

			if (object) {
				this._slots.push({
					id: slot_id,
					callback: callback,
					object: object
				});
			} else {
				this._slots.push({
					id: slot_id,
					callback: callback
				});
			}

			return slot_id;
		}

		/**
		 * Disconnects signal
		 */
//		public disconnect(): void;
		public disconnect(slot_id?:number):void {
			var slots:Slot<T>[] = this._slots;
			var slots_new:Slot<T>[] = [];
			for (var i = 0; i < slots.length; i++) {
				var slot:Slot<T> = slots[i];
				if (slot_id && slot.id !== slot_id) {
					slots_new.push(slot);
				}
			}
			this._slots = slots_new;
		}

		/**
		 * Emits signal, you can start it in the way:
		 * signal.emit({any number of parameters}),
		 * emit returns accumulator.value().
		 */
		public emit():void;

		public emit(data?:T):void;

		public emit(data?:any):void {
			var slots:Slot<T>[] = this._slots;
			for (var i = 0; i < slots.length; i++) {
				var slot:Slot<T> = slots[i];
				var object:Object = slot.object;
				if (object) {
					var cb:Function = slot.callback;
					cb.call(object, data);
//					cb.apply(object, data);
//					slot.callback(data);
				} else {
					slot.callback(data);
				}
			}
		}

	}

}


module prest.ajax {

	export class HttpRequest {

		private load(url:string) {
			var request:XMLHttpRequest = new XMLHttpRequest();

			request.addEventListener("load", (e:Event) => {
				var request:XMLHttpRequest = (<XMLHttpRequest> e.target);

				console.log(request.responseType);

				var xml:Document = request.responseXML;
				var txt:string = request.responseText;
			});

			request.onload = (e:Event) => {
				var request:XMLHttpRequest = (<XMLHttpRequest> e.target);

				console.log(request.responseType);

				var xml:Document = request.responseXML;
				var txt:string = request.responseText;
			};

			request.onerror = (e:Event) => {
				var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
				console.log(e);
				request.statusText;
			};

//			request.open("GET", url);
//			request.setRequestHeader("Content-Type", "text/json");
//			request.send(null);
		}

		/*
		 HttpRequest httpRequest = new HttpRequest();
		 httpRequest.setUrl(url);
		 //				httpRequest.setUrlParam("start", Integer.toString(range.getStart()));
		 //				httpRequest.setUrlParam("limit", Integer.toString(range.getLength()));
		 httpRequest.setUrlParams(urlParams);
		 httpRequest.setCallback(selectPersonsCallback);
		 httpRequest.get();

		 HttpRequest.get(url, urlParams, selectPersonsCallback);
		 */
	}

}


module prest.dom {

//	export var signal_window_load: prest.signal.Signal<void> = new prest.signal.Signal<void>();
//
//	(function () {
//		if (typeof window !== 'undefined') {
//			window.onload = function (e) {
//					signal_window_load.emit();
//				};
//		}
//	})();

}

module prest.hash {

	export class Hash<T> {

		/**
		 * Signal is emitted whenever window.location.hash is changed,
		 * you can connect on signal with slot in form of: slot(hash_data).
		 */
		public signal_change:prest.signal.Signal<T>;

		constructor() {
			this.signal_change = new prest.signal.Signal<T>();
		}

		/**
		 * Listen on URL hash fragment changes and emit signal_change
		 */
		public emit_changes() {
			if ('onhashchange' in window) {
				window.onhashchange = () => {
					this.signal_change.emit(this.get_hash());
				};
			} else {
				//prest.log.warning('browser "window.onhashchange" not implemented, running emulation');
				var prevHash = window.location.hash;
				window.setInterval(() => {
					if (window.location.hash != prevHash) {
						prevHash = window.location.hash;
						this.signal_change.emit(this.get_hash());
					}
				}, 500);
			}
		}

		/**
		 * Returns decoded window.location.hash data
		 */
		public get_hash():T {
			var str = window.location.hash.slice(1);
			return this._deserialize(str);
		}

		/**
		 * Encode data and sets window.location.hash fragment
		 */
		public put_hash(hash_data:T) {
			var str = this._serialize(hash_data);
			window.location.hash = '#' + str;
		}

		private _serialize(data:T, prefix = ''):string {
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
					var value_length = value.length;
					for (var i = 0; i < value_length; i++) {
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

		private _deserialize(str:string):T {
			var data:T = <T>{};
			if (str) {
				var params = str.split('&');
				var params_length = params.length;
				for (var j = 0; j < params_length; j++) {
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
