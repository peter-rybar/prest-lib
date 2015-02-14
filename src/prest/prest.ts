module prest {

	/**
	 * pREST Signal-Slot pattern module
	 */

	interface Slot<T> {
		id: number;
		callback: (data?: T) => void;
		object?: any;
	}

	/**
	 * Signal slot pattern class with optional accumulator object.
	 */
	export class Signal<T> {

		private _slots: Slot<T>[];
		private _slotId;

		constructor() {
			this._slots = [];
			this._slotId = 0;
		}

		// ES5
//		set slot(slot: (data?: T) => void) {
//			this.connect(slot);
//		}

		public connect(callback: (data?: T) => void): number;

		public connect(callback: (data?: T) => void, object?: Object): number;

		public connect(callback: (data?: any) => void, object?: Object): number {
			var slotId = this._slotId++;

			if (object) {
				this._slots.push({
					id: slotId,
					callback: callback,
					object: object
				});
			} else {
				this._slots.push({
					id: slotId,
					callback: callback
				});
			}

			return slotId;
		}

		/**
		 * Disconnects signal
		 */
//		public disconnect(): void;
		public disconnect(slotId?: number): void {
			var slots: Slot<T>[] = this._slots;
			var slotsNew: Slot<T>[] = [];
			for (var i = 0; i < slots.length; i++) {
				var slot: Slot<T> = slots[i];
				if (slotId && slot.id !== slotId) {
					slotsNew.push(slot);
				}
			}
			this._slots = slotsNew;
		}

		/**
		 * Emits signal, you can start it in the way:
		 * signal.emit({any number of parameters}),
		 * emit returns accumulator.value().
		 */
		public emit(): void;

		public emit(data?: T): void;

		public emit(data?: any): void {
			var slots: Slot<T>[] = this._slots;
			for (var i = 0; i < slots.length; i++) {
				var slot: Slot<T> = slots[i];
				var object: Object = slot.object;
				if (object) {
					var cb: Function = slot.callback;
					cb.call(object, data);
//					cb.apply(object, data);
//					slot.callback(data);
				} else {
					slot.callback(data);
				}
			}
		}

	}


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

//module prest.dom {
//
//	export var signal_window_load: prest.signal.Signal<void> = new prest.signal.Signal<void>();
//
//	(function () {
//		if (typeof window !== 'undefined') {
//			window.onload = function (e) {
//					signal_window_load.emit();
//				};
//		}
//	})();
//
//}

/*
 export class HttpRequest {

 private _url;
 private _method = "get";
 private _async = true;

 private _interruptible = false;

 // allow multiple values in request by default, i.e. ?a=1&a=2&a=3
 // in case of false encode array parameters with JSON
 private _m_val = true;

 private _override_mime_type;

 private _parameters;
 private _files;
 private _request;

 private _callinprogress = false;

 private _verbose = false;

 public signal_open = new prest.signal.Signal<any>();
 public signal_progress = new prest.signal.Signal<any>();
 public signal_load = new prest.signal.Signal<any>();
 public signal_error = new prest.signal.Signal<any>();
 public signal_abort = new prest.signal.Signal<any>();

 constructor(url) {
 this._url = url || "";
 this._create_request();
 }

 set_override_mime_type(mime_type_string) {
 if (this._callinprogress) {
 throw "you can not set override_mime_type during call";
 } else {
 if (window.XMLHttpRequest) {
 this._override_mime_type = mime_type_string;
 this._create_request();
 return true;
 }
 }

 return false;
 }

 set_interruptible(choice) {
 this._interruptible = choice ? true : false;
 }

 set_verbose(choice) {
 this._verbose = choice ? true : false;
 }

 _uem(signal_name, e) {
 console.error("while emiting signal_" + signal_name + " in HttpRequest\nwith default url \"" + this._url + "\"\nerror occurs:\n\n" + lib.util._exception_to_text(e));
 }

 _emit_signal_open()                                                { try { this.signal_open.emit();                                                } catch (e) { this._uem("open", e); } }
 _emit_signal_progress(current_response_text, final_content_length) { try { this.signal_progress.emit(current_response_text, final_content_length); } catch (e) { this._uem("progress", e); } }
 _emit_signal_load(data, status)                                    { try { this.signal_load.emit(data, status);                                    } catch (e) { this._uem("load", e); } }
 _emit_signal_error(status, status_text)                            { try { this.signal_error.emit(status, status_text);                            } catch (e) { this._uem("error", e); } }
 _emit_signal_abort(message)                                        { try { this.signal_abort.emit(message);                                        } catch (e) { this._uem("abort", e); } }

 _create_request() {
 if (window.XMLHttpRequest) {
 this._request = new XMLHttpRequest();
 // override mime type
 if (this._override_mime_type)
 this._request.overrideMimeType(this._override_mime_type);
 } else {
 var codes = ["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"];

 for (var i = 0; i < codes.length; i++) {
 try {
 this._request = new ActiveXObject(codes[i]);
 break;
 } catch(e) {}
 }

 if (!(this._request)) {
 this._request = undefined;
 var msg = "XMLHttpRequest cannot be created, you are using unsupported browser";
 lib_log.fatal(msg);
 throw msg;
 }
 }
 }

 _handle_response() {
 var verbose = this._verbose;
 var request = this._request;

 if (this._callinprogress) {
 this._callinprogress = false;

 var overriden_mime_type = this._override_mime_type,
 content_type = overriden_mime_type ?
 overriden_mime_type
 :
 request.getResponseHeader("Content-Type")
 ,
 data = request.responseText,
 status = request.status;

 if (verbose)
 console.log("HttpRequest gets response \n" + "status: " + status);

 if (
 (status >= 200 && status < 300) ||
 status == 0 // for schemes which do not use HTTP result codes (file, ftp)
 ) {

 if (verbose)
 console.log("content type: " + content_type + "\ndata: " + data);

 if (/\/json/.test(content_type)) {
 try {
 data = json_decode(data);
 } catch (e) {
 this._emit_signal_error(status, "decode JSON error: " + e, data);

 data = undefined;
 }
 if (data !== undefined)
 this._emit_signal_load(data, status);

 // IE is wrong when it does not set
 // request.responseXML to null when payload is not xml
 // but solution bellow is also more right
 } else if (/xml/.test(content_type)) {
 this._emit_signal_load(request.responseXML, status);
 } else {
 this._emit_signal_load(data, status);
 }

 } else { // skurveny M$ IE
 if (verbose)
 console.log("HttpRequest emits error \nstatus text: " + request.statusText);

 this._emit_signal_error(status, request.statusText);
 }
 // request died when this was not done
 // probably this shoud be considered in future
 request.abort(); // skurveny M$ IE
 }
 }

 _onreadystatechange() {
 var verbose = this._verbose;
 var request = this._request;

 if (verbose)
 console.log("HttpRequest is processing request object change \n" + "ready state: " + request.readyState);

 try {
 switch (request.readyState) {
 case 0:
 // unsent
 break;
 case 1:
 // opened
 break;
 case 2:
 // headers_received
 try {
 if (request.status != 0) { // not local file
 if (request.status < 200 || request.status > 299) {
 this._callinprogress = false;
 request.abort();

 if (verbose)
 console.log("HttpRequest is abording request \nstatus: " + request.status + "\nstatus text: " + request.statusText);

 this._emit_signal_error(request.status, request.statusText);
 }
 }
 } catch (e) {
 // skurveny M$ IE
 }
 break;
 case 3:
 // loading
 try {
 var content_length = undefined;
 try {
 content_length = request.getResponseHeader("Content-Length");
 } catch (e) { }

 this._emit_signal_progress(request.responseText, content_length);

 } catch (e) {
 // skurveny M$ IE
 }
 break;
 case 4:
 // done
 this._handle_response();
 break;
 }
 } catch (e) {
 this._callinprogress = false;
 request.abort();

 if (verbose)
 console.error("HttpRequest catches exception while processing request object change, request was aborded \nexception: " + e);
 }
 }

 open(method, url, parameters, async) {

 if (this._callinprogress) {
 if (this._interruptible) {
 this._callinprogress = false;
 this._request.onreadystatechange = function () {};
 this._request.abort();
 this._emit_signal_abort("abort due to call in progress");
 this._create_request();
 } else {
 method = method || this._method;
 url = url || this._url;
 throw "HttpRequest call in progress: "
 + "method='" + method + "' "
 + "url='" + url + "'";
 }
 }

 this._callinprogress = true;

 this._method = method || this._method;
 url = url || this._url;
 this._parameters = parameters;
 this._async = (async == undefined ) ? true : (async ? true : false);

 var request_url;

 if (this._method == "get" && this._parameters != undefined) {
 request_url = url + "?" + this._url_encode(this._parameters);
 } else {
 request_url = url;
 }

 if (this._verbose)
 console.log("HttpRequest is opening connection \nmethod: " + this._method + "\nrequest url: " + request_url + "\nasync: " + this._async);

 this._emit_signal_open();
 this._request.open(this._method, request_url, this._async);

 this._request.onreadystatechange = function() { HttpRequest._onreadystatechange(this); };

 return this;
 }

 send(headers, content) {
 var verbose = this._verbose;
 var request = this._request;

 if (verbose)
 console.log("HttpRequest is sending request");

 try {
 if (headers != undefined) {
 for (var header in headers) {
 if (verbose)
 console.log("header " + header + ": " + headers[header]);
 request.setRequestHeader(header, headers[header]);
 }
 }

 var payload = undefined;
 if (this._method != "get" && this._parameters != undefined && content == undefined) {
 if (this._files == undefined) {
 payload = this._url_encode(this._parameters);

 if (verbose)
 console.log("header Content-Type: application/x-www-form-urlencoded; charset=UTF-8");

 request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

 } else {
 var boundary = "---mime-boundary-" + encodeURIComponent(new Date()) + "---";
 payload = this._mime_encode(boundary, this._parameters, this._files);
 this._files = undefined;
 request.setRequestHeader('Content-type', 'multipart/form-data; boundary="' + boundary + '"; charset=UTF-8');
 request.setRequestHeader('Connection', 'close');
 request.setRequestHeader('Content-length', payload.length);
 }
 } else {
 payload = content;
 }

 if (verbose)
 console.log("payload:\n" + payload);

 request.send(payload);

 if (this._async == false)
 this._handle_response();

 } catch (e) {
 this._callinprogress = false;
 request.abort();

 if (verbose)
 console.error("HttpRequest catches exception while sending data, request was aborded \nexception: " + e);
 }

 return request;
 }

 abort() {
 this._callinprogress = false;
 if (this._request)
 this._request.abort();
 this._emit_signal_abort("abort");

 return this;
 }

 files(files) {
 this._files = files;
 return this;
 }

 allow_multiple_values(choice) {
 this._m_val = choice ? true : false;
 }

 _url_encode(params)	{
 var str,
 verbose = this._verbose,
 allow_multiple_values = this._m_val,
 param,
 p = [], key_value_pairs = [];

 for (var i in params) {
 param = params[i];

 if (typeof param == "object") {
 if (allow_multiple_values && lib.util.is_array(param)) {

 for (var j = 0; j < param.length; j++)
 key_value_pairs.push( [ i, typeof param[j] == "object" ? json_encode(param[j]) : param[j] ] );

 } else {
 key_value_pairs.push([i, json_encode(param)]);
 }
 } else {
 key_value_pairs.push([i, param]);
 }
 }

 var i: number = 0;
 for (var pair; pair = key_value_pairs[i++]; ) {
 if (verbose)
 p.push(pair[0] + "=" + pair[1]);

 key_value_pairs[i - 1] = "" + encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
 }

 str = key_value_pairs.join("&");

 if (verbose)
 console.log("request parameters:\n" + p.join("\n"));

 return str;
 }

 _mime_encode(boundary: string, parameters, files) {
 var boundary = "--" + boundary;
 var payload = [];

 payload.push(boundary);

 for (var parameter in parameters) {
 payload.push('Content-Disposition: form-data; name="' + parameter + '"');
 payload.push('');
 payload.push(parameters[parameter]);
 payload.push(boundary);
 }
 for (var file in files) {
 payload.push('Content-Disposition: file; name="' + file[file].name + '"; filename="' + files[file].filename + '"');
 payload.push('Content-Type: application/octet-stream');
 payload.push('');
 payload.push(files[file].data);//todo
 //payload.push(HttpRequest.get_file_content(files[file]));//todo
 payload.push(boundary);
 }

 return payload.join("\r\n") + "--";
 }

 get(parameters, rri, async) {
 var url = this._url + (rri || "");
 return this.open("get", url , parameters, async).send();
 }

 post(parameters, rri, async) {
 var url = this._url + (rri || "");
 return this.open("post", url, parameters, async).send();
 }

 put(parameters, rri, async) {
 var url = this._url + (rri || "");
 return this.open("put", url, parameters, async).send();
 }

 delete(parameters, rri, async) {
 var url = this._url + (rri || "");
 return this.open("delete", url, parameters, async).send();
 }
 */

//private load(url:string) {
//	var request:XMLHttpRequest = new XMLHttpRequest();
//
//	request.addEventListener("load", (e:Event) => {
//		var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//
//		console.log(request.responseType);
//
//		var xml:Document = request.responseXML;
//		var txt:string = request.responseText;
//	});
//
//	request.onload = (e:Event) => {
//		var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//
//		console.log(request.responseType);
//
//		var xml:Document = request.responseXML;
//		var txt:string = request.responseText;
//	};
//
//	request.onerror = (e:Event) => {
//		var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//		console.log(e);
//		request.statusText;
//	};

//			request.open("GET", url);
//			request.setRequestHeader("Content-Type", "text/json");
//			request.send(null);
//		}

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
