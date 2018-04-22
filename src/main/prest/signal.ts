
export type SlotCallback<T> = (data?: T) => void;

interface Slot<T> {
    callback: SlotCallback<T>;
    object?: any;
}

export interface Sig<T> {
    onConnect(onConnect: (connNo: number) => void): void;
    onDisconnect(onDisconnect: (connNo: number) => void): void;
    connNo(): number;
    connect(callback: SlotCallback<T>, object?: any): void;
    disconnect(callback: SlotCallback<T>, object?: any): void;
    disconnectAll(): void;
    freeze(): void;
    unfreeze(): void;
}

export class Signal<T> implements Sig<T> {

    private _slots: Slot<T>[] = [];
    private _emit: boolean = true;

    private _onConnect: (connNo: number) => void;
    private _onDisconnect: (connNo: number) => void;

    constructor() {
    }

    onConnect(onConnect: (connNo: number) => void): void {
        this._onConnect = onConnect;
    }

    onDisconnect(onDisconnect: (connNo: number) => void): void {
        this._onDisconnect = onDisconnect;
    }

    connNo(): number {
        return this._slots.length;
    }

    // ES5
    // set slot(slot:(data?:T) => void) {
    //     this.connect(slot);
    // }

    connect(callback: (data?: T) => void): void;
    connect(callback: (data?: T) => void, object?: Object): void;
    connect(callback: (data?: any) => void, object?: Object): void {
        if (typeof callback !== "function") return;
        if (object) {
            this._slots.push({ callback: callback, object: object });
        } else {
            this._slots.push({ callback: callback });
        }
        if (this._onConnect) {
            this._onConnect(this._slots.length);
        }
    }

    disconnect(callback: (data?: T) => void, object?: Object): void {
        if (typeof callback !== "function") return;
        this._slots = this._slots.filter(slot => {
            return (object === undefined) ?
                (slot.callback !== callback) :
            (slot.callback !== callback) && (slot.object !== object);
        });
        if (this._onDisconnect) {
            this._onDisconnect(this._slots.length);
        }
    }

    disconnectAll(): void {
        this._slots = [];
        if (this._onDisconnect) {
            this._onDisconnect(this._slots.length);
        }
    }

    freeze(): void {
        this._emit = false;
    }

    unfreeze(): void {
        this._emit = true;
    }

    emit(this: Signal<void>): any[];
    emit(this: Signal<T>, data?: T): any[];
    emit(this: Signal<any>, data?: any): any[] {
        if (this._emit && this._slots.length) {
            return this._slots.map(slot => {
                const object: Object = slot.object;
                if (object) {
                    return slot.callback.call(object, data);
                } else {
                    return slot.callback(data);
                }
            });
        }
        return [];
    }

    /*
    emitAsync(this: Signal<void>): void;
    emitAsync(this: Signal<T>, data?: T): void;
    emitAsync(this: Signal<any>, data?: any): void {
        if (this._emit && this._slots.length) {
            this._slots.forEach(slot => {
                const object: Object = slot.object;
                if (object) {
                    setTimeout(() => {
                        slot.callback.call(object, data);
                    });
                } else {
                    setTimeout(() => {
                        slot.callback(data);
                    });
                }
            });
        }
    }
    */

}
