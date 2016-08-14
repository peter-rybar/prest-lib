module prest.signal {

    /**
     * pREST Signal-Slot pattern module
     */

    /**
     * Slot interface
     */
    interface Slot<T> {
        callback: (data?:T) => void;
        object?: any;
    }

    /**
     * Signal slot pattern class with optional accumulator object.
     *
     * <T> signal data type
     */
    export class Signal<T> {

        private _slots:Slot<T>[];
        private _emit:boolean;

        constructor() {
            this._slots = [];
            this._emit = true;
        }

        // ES5
        //set slot(slot:(data?:T) => void) {
        //    this.connect(slot);
        //}

        /**
         * Connects slot
         */
        connect(callback:(data?:T) => void):void;
        connect(callback:(data?:T) => void, object?:Object):void;
        connect(callback:(data?:any) => void, object?:Object):void {
            if (object) {
                this._slots.push({callback: callback, object: object});
            } else {
                this._slots.push({callback: callback});
            }
        }

        /**
         * Disconnects slot
         */
        disconnect(callback:(data?:T) => void, object?:Object):void {
            var slots:Slot<T>[] = this._slots;
            this._slots = slots.filter((slot) => {
                return (slot.callback !== callback) && (slot.object !== object);
            });
        }

        /**
         * Disconnects all slots
         */
        disconnectAll():void {
            this._slots = [];
        }

        freeze():void {
            this._emit = false;
        }

        unfreeze():void {
            this._emit = true;
        }

        /**
         * Emits signal, you can start it in the way:
         * signal.emit({any number of parameters}),
         * emit returns accumulator.value().
         */
        emit():void;
        emit(data?:T):void;
        emit(data?:any):void {
            if (this._emit) {
                var slots:Slot<T>[] = this._slots;
                for (var i = 0; i < slots.length; i++) {
                    var slot:Slot<T> = slots[i];
                    var object:Object = slot.object;
                    if (object) {
                        var cb:Function = slot.callback;
                        cb.call(object, data);
                        //cb.apply(object, data);
                        //slot.callback(data);
                    } else {
                        slot.callback(data);
                    }
                }
            }
        }

    }

}
