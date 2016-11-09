function is_array(obj) {
    return Array.isArray ?
        Array.isArray(obj) :
        (obj == null || obj === undefined || "boolean|number|string|function|xml".indexOf(typeof obj) !== -1 ) ?
            false :
            (typeof obj.length === "number" && !(obj.propertyIsEnumerable("length")));
}

export function decodeUrlQuery(queryStr: string) {
    const query = {};
    if (queryStr) {
        const a = queryStr.substr(1).split("&");
        for (let i = 0; i < a.length; i++) {
            const b = a[i].split("=");
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
        }
    }
    return query;
}

export function encodeUrlQuery(query): string {
    const key_value_pairs = [];

    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            const value = query[key];
            if (typeof value === "object") {
                if (is_array(value)) {
                    for (let j = 0; j < value.length; j++) {
                        key_value_pairs.push(
                            [key, typeof value[j] === "object" ?
                                JSON.stringify(value[j]) : value[j]]);
                    }

                } else {
                    key_value_pairs.push([key, JSON.stringify(value)]);
                }
            } else {
                key_value_pairs.push([key, value]);
            }
        }
    }

    for (let j = 0, pair; pair = key_value_pairs[j++]; ) {
        key_value_pairs[j - 1] = "" +
            encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]);
    }

    return key_value_pairs.join("&");
}

export class HttpResponse {

    private _xmlHttpRequest: XMLHttpRequest;

    constructor(xmlHttpRequest: XMLHttpRequest) {
        this._xmlHttpRequest = xmlHttpRequest;
    }

    getHeaders(): string {
        return this._xmlHttpRequest.getAllResponseHeaders();
    }

    getHeader(header: string): string {
        return this._xmlHttpRequest.getResponseHeader(header);
    }

    getBody(): any {
        return this._xmlHttpRequest.response;
    }

    getType(): string {
        return this._xmlHttpRequest.responseType;
    }

    getContentType(): string {
        return this.getHeader("Content-Type");
    }

    getText(): string {
        return this._xmlHttpRequest.responseText;
    }

    getJson(): any {
        return JSON.parse(this._xmlHttpRequest.responseText);
    }

    getXml(): string {
        return this._xmlHttpRequest.responseXML;
    }

}

export interface HttpProgress {
    loaded: number;
    total: number;
}

export class HttpRequest {

    private _url: string;
    private _query: Object;
    private _method: string = "GET";
    private _headers: {[key: string]: string} = {};

    private _onProgress: (progress: HttpProgress) => void;
    private _onResponse: (response: HttpResponse) => void;
    private _onError: (e: Event) => void;

    private _async: boolean = true;
    private _noCache: boolean = false;

    constructor() {
    }

    get(url: string, query?: Object): this {
        this.method("GET");
        this.url(url, query);
        return this;
    }

    post(url: string, query?: Object): this {
        this.method("POST");
        this.url(url, query);
        return this;
    }

    put(url: string, query?: Object): this {
        this.method("PUT");
        this.url(url, query);
        return this;
    }

    del(url: string, query?: Object): this {
        this.method("DELETE");
        this.url(url, query);
        return this;
    }

    url(url: string, query?: Object): this {
        this._url = url;
        this._query = query;
        return this;
    }

    method(method: string): this {
        this._method = method;
        return this;
    }

    headers(headers: {[key: string]: string}): this {
        this._headers = headers;
        return this;
    }

    onProgress(onProgress: (progress: HttpProgress) => void): this {
        this._onProgress = onProgress;
        return this;
    }

    onResponse(onResponse: (response: HttpResponse) => void): this {
        this._onResponse = onResponse;
        return this;
    }

    onError(onError: (e: Event) => void): this {
        this._onError = onError;
        return this;
    }

    async(async: boolean): this {
        this._async = async;
        return this;
    }

    noCache(noCache: boolean = true): this {
        this._noCache = noCache;
        return this;
    }

    send(data?: any, contentType?: string): void {
        if (contentType) {
            this._headers["Content-Type"] = contentType;
        }
        this._send(this._onResponse, this._onError, data, this._headers);
    }

    private _send(onResponse: (response: HttpResponse) => void,
                  onError: (err: Event) => void,
                  data?: any,
                  headers?: {[key: string]: string}): void {
        const httpRequest = new XMLHttpRequest();

        let url = this._url;
        if (this._query) {
            const query = encodeUrlQuery(this._query);
            url = query ? (url + "?" + query) : url;
        }
        if (this._noCache) {
            url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
        }
        // console.debug("HttpRequest: " + this._method + " " + url, data);

        if ("onprogress" in httpRequest) {
            if (this._onProgress) {
                const onprogress = (e) => {
                    if (e.lengthComputable) {
                        this._onProgress({loaded: e.loaded, total: e.total});
                    }
                };
                httpRequest.upload.onprogress = onprogress;
                httpRequest.onprogress = onprogress;
            }
        }

        httpRequest.open(this._method, url, this._async);

        for (const header in headers) {
            if (headers.hasOwnProperty(header)) {
                httpRequest.setRequestHeader(header, headers[header]);
            }
        }

        if (this._async) {
            httpRequest.onreadystatechange = (e: Event) => {
                switch (httpRequest.readyState) {
                    // case 3: // loading
                    //    if (this._onProgress) {
                    //        this._onProgress(new HttpResponse(httpRequest));
                    //    }
                    //    break;
                    case 4: // done
                        if (
                            (httpRequest.status >= 200 && httpRequest.status < 300) ||
                            httpRequest.status === 0 // schemes other than http (file, ftp)
                        ) {
                            if (onResponse) {
                                onResponse(new HttpResponse(httpRequest));
                            }
                        } else {
                            if (onError) {
                                onError(e);
                            }
                        }
                        break;
                }
            };

            if (data !== undefined) {
                if ((typeof data === "string") || (data instanceof FormData)) {
                    httpRequest.send(data);
                } else {
                    httpRequest.send(JSON.stringify(data));
                }
            } else {
                httpRequest.send();
            }
        } else {
            httpRequest.onerror = (e: ErrorEvent) => {
                onError(e);
            };
            if (data) {
                const payload = (typeof data === "string") ? data : JSON.stringify(data);
                httpRequest.send(payload);
            } else {
                httpRequest.send();
            }
            return JSON.parse(httpRequest.responseText);
        }
    }

}

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

    signal_open = new prest.signal.Signal<any>();
    signal_progress = new prest.signal.Signal<any>();
    signal_load = new prest.signal.Signal<any>();
    signal_error = new prest.signal.Signal<any>();
    signal_abort = new prest.signal.Signal<any>();

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
            payload.push(files[file].data);
            //payload.push(HttpRequest.get_file_content(files[file]));
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

// private load(url:string) {
//    var request:XMLHttpRequest = new XMLHttpRequest();
//
//    request.addEventListener("load", (e:Event) => {
//        var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//
//        console.log(request.responseType);
//
//        var xml:Document = request.responseXML;
//        var txt:string = request.responseText;
//    });
//
//    request.onload = (e:Event) => {
//        var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//
//        console.log(request.responseType);
//
//        var xml:Document = request.responseXML;
//        var txt:string = request.responseText;
//    };
//
//    request.onerror = (e:Event) => {
//        var request:XMLHttpRequest = (<XMLHttpRequest> e.target);
//        console.log(e);
//        request.statusText;
//    };

//            request.open("GET", url);
//            request.setRequestHeader("Content-Type", "text/json");
//            request.send(null);
//        }

/*
 HttpRequest httpRequest = new HttpRequest();
 httpRequest.setUrl(url);
 //                httpRequest.setUrlParam("start", Integer.toString(range.getStart()));
 //                httpRequest.setUrlParam("limit", Integer.toString(range.getLength()));
 httpRequest.setUrlParams(urlParams);
 httpRequest.setCallback(selectPersonsCallback);
 httpRequest.get();

 HttpRequest.get(url, urlParams, selectPersonsCallback);
 */
