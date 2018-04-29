import { Widget } from "./widget";
import { Events } from "./events";


export abstract class WidgetE<S> extends Widget {

    protected _state: S;

    readonly events: Events<this>;

    constructor(type: string = "", state?: S, events?: Events<any>) {
        super(type);
        this._state = state;
        this.events = events ? events : new Events<this>(this);
    }

    setState(state: S): this {
        this._state = state;
        this.update();
        return this;
    }

    getState(): S {
        return this._state;
    }

}
