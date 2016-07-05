module prest.signal {

    /**
     * pREST Signal-Slot pattern module
     */

    interface Slot<T> {
        id: number;
        callback: (data?:T) => void;
        object?: any;
    }

    /**
     * Signal slot pattern class with optional accumulator object.
     */
    export class Signal<T> {

        private _slots:Slot<T>[];
        private _slotId:number;
        private _emit:boolean;

        constructor() {
            this._slots = [];
            this._slotId = 0;
            this._emit = true;
        }

        // ES5
        //set slot(slot:(data?:T) => void) {
        //    this.connect(slot);
        //}

        connect(callback:(data?:T) => void):number;
        connect(callback:(data?:T) => void, object?:Object):number;
        connect(callback:(data?:any) => void, object?:Object):number {
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
         * Disconnects slot
         */
        //disconnect(): void;
        disconnect(slotId?:number):void {
            var slots:Slot<T>[] = this._slots;
            var slotsNew:Slot<T>[] = [];
            for (var i = 0; i < slots.length; i++) {
                var slot:Slot<T> = slots[i];
                if (slotId && slot.id !== slotId) {
                    slotsNew.push(slot);
                }
            }
            this._slots = slotsNew;
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
