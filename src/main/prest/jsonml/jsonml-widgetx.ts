import { Widget } from "./jsonml-widget";
import { Events } from "../events";


export abstract class WidgetX<S> extends Widget {

    protected _state: S;

    readonly events: Events = new Events();

    constructor(type: string = "") {
        super(type);
    }

    set state(state: S) {
        this._state = state;
        this.update();
    }

    get state(): S {
        return this._state;
    }

}
