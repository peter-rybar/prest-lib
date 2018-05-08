export class Hash<T> {

    private _cb: (data: T) => void;
    private _iId: any;

    private _encoder = (data: T) => encodeURIComponent(JSON.stringify(data));
    private _decoder = (data: string) => data ? JSON.parse(decodeURIComponent(data)) : undefined;

    onChange(callback: (data: T) => void): this {
        this._cb = callback;
        if ("onhashchange" in window) {
            onhashchange = () => {
                callback(this.read());
            };
        } else {
            // prest.log.warning('browser "window.onhashchange" not implemented, running emulation');
            let prevHash = location.hash;
            if (this._iId) {
                clearInterval(this._iId);
            }
            this._iId = setInterval(() => {
                if (location.hash !== prevHash) {
                    prevHash = location.hash;
                    callback(this.read());
                }
            }, 500);
        }
        return this;
    }

    coders(encoder: (data: T) => string, decoder: (data: string) => T): this {
        this._encoder = encoder;
        this._decoder = decoder;
        return this;
    }

    start(): this {
        this._cb(this.read());
        return this;
    }

    read(): T {
        const str = location.hash.slice(1);
        return this._decoder(str);
    }

    write(hashData: T): this {
        const str = this._encoder(hashData);
        location.hash = "#" + str;
        return this;
    }

}
