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

}
