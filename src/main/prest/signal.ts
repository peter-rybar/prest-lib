/**
 * pREST Signal-Slot pattern module
 */

/**
 * Slot interface
 */
interface Slot<T> {
    callback: (data?: T) => void;
    object?: any;
}

/**
 * Signal slot pattern class with optional accumulator object.
 *
 * <T> signal data type
 */
export class Signal<T> {

    private _slots: Slot<T>[];
    private _emit: boolean;

    constructor() {
        this._slots = [];
        this._emit = true;
    }

    // ES5
    // set slot(slot:(data?:T) => void) {
    //     this.connect(slot);
    // }

    /**
     * Connects slot
     */
    connect(callback: (data?: T) => void): void;
    connect(callback: (data?: T) => void, object?: Object): void;
    connect(callback: (data?: any) => void, object?: Object): void {
        if (object) {
            this._slots.push({callback: callback, object: object});
        } else {
            this._slots.push({callback: callback});
        }
    }

    /**
     * Disconnects slot
     */
    disconnect(callback: (data?: T) => void, object?: Object): void {
        this._slots = this._slots.filter((slot) => {
            return (object === undefined) ?
                (slot.callback !== callback) :
                (slot.callback !== callback) && (slot.object !== object);
        });
    }

    /**
     * Disconnects all slots
     */
    disconnectAll(): void {
        this._slots = [];
    }

    /**
     * Freeze signal propagation
     */
    freeze(): void {
        this._emit = false;
    }

    /**
     * Unfreeze signal propagation
     */
    unfreeze(): void {
        this._emit = true;
    }

    /**
     * Emits signal, you can start it in the way:
     * signal.emit({any number of parameters}),
     * emit returns accumulator.value().
     */
    emit(): any[];
    emit(data?: T): any[];
    emit(data?: any): any[] {
        if (this._emit) {
            return this._slots.map((slot) => {
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
    emitAsync(): void;
    emitAsync(data?: T): void;
    emitAsync(data?: any): void {
        if (this._emit) {
            this._slots.forEach((slot) => {
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
