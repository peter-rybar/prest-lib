module prest.hash {

    export class Hash<T> {

        private _listenIntervalId:any;

        private _encoder = (data:T) => { return JSON.stringify(data); };
        private _decoder = (string:string) => { return JSON.parse(string); };

        /**
         * Listen on URL hash fragment changes
         */
        onChange(callback:(hashData:T) => void):Hash<T> {
            if ('onhashchange' in window) {
                window.onhashchange = () => {
                    callback(this.read());
                };
            } else {
                //prest.log.warning('browser "window.onhashchange" not implemented, running emulation');
                var prevHash = window.location.hash;
                if (this._listenIntervalId) {
                    window.clearInterval(this._listenIntervalId);
                }
                this._listenIntervalId = window.setInterval(() => {
                    if (window.location.hash != prevHash) {
                        prevHash = window.location.hash;
                        callback(this.read());
                    }
                }, 500);
            }
            return this;
        }

        setEncoder(encoder:(data:T) => string):Hash<T> {
            this._encoder = encoder;
            return this;
        }

        setDecoder(decoder:(string:string) => T):Hash<T> {
            this._decoder = decoder;
            return this;
        }

        /**
         * Returns decoded window.location.hash data
         */
        read():T {
            var str = window.location.hash.slice(1);
            return this._decoder(str);
        }

        /**
         * Encode data and sets window.location.hash fragment
         */
        write(hashData:T) {
            var str = this._encoder(hashData);
            window.location.hash = '#' + str;
        }

    }

}
