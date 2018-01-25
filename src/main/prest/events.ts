
export type Handler = (data: any, event?: string) => void;

export class Events {

    private _handlers: { [event: string]: Handler[] };
    private _handler: Handler[];

    constructor() {
        this._handlers = {};
    }

    on(event: string, handler: Handler): this {
        if (!event) {
            if (!this._handler) {
                this._handler = [];
            }
            this._handler.push(handler);
        }
        if (!(event in this._handlers)) {
            this._handlers[event] = [];
        }
        if (this._handlers[event].indexOf(handler) === -1) {
            this._handlers[event].push(handler);
        }
        return this;
    }

    once(event: string, handler: Handler): this {
        const wrap = (d: any, e?: string) => {
            this.off(event, wrap);
            handler(d, e);
        };
        this.on(event, wrap);
        return this;
    }

    off(event: string, handler?: Handler): this {
        if (!event) {
            if (handler) {
                this._handler.splice(this._handlers[event].indexOf(handler), 1);
            } else {
                this._handler.length = 0;
                delete this._handler;
            }
        }
        if (event in this._handlers) {
            if (handler) {
                this._handlers[event].splice(this._handlers[event].indexOf(handler), 1);
            } else {
                this._handlers[event].length = 0;
                delete this._handlers[event];
            }
        }
        return this;
    }

    emit(event: string, data?: any): this {
        if (this._handler) {
            for (let i = 0, l = this._handler.length; i < l; i++) {
                this._handler[i](data, event);
            }
        }
        if (event in this._handlers) {
            for (let i = 0, l = this._handlers[event].length; i < l; i++) {
                this._handlers[event][i](data, event);
            }
        }
        return this;
    }

}

// const e = new Events();

// e.on(undefined, (data, e) => console.log("on all:", data, e));

// e.emit("e", "eee1");
// e.on("e", (data, e) => console.log(data, e));
// e.emit("e", "eee2");
// e.off("e");
// e.emit("e", "eee3");

// e.off(undefined);

// e.once(undefined, (data, e) => console.log("once all:", data, e));

// e.emit("o", "ooo1");
// e.once("o", (data, e) => console.log(data, e));
// e.emit("o", "ooo2");
// e.emit("o", "ooo3");
