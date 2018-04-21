import { Widget } from "./widget";


export abstract class WidgetXx<S, A> extends Widget {

    protected _state: S;
    protected _actions: A;

    constructor(type: string = "", state?: S, actions?: A) {
        super(type);
        this._state = state;
        this._actions = actions;
    }

    setState(state: S): this {
        this._state = state;
        this.update();
        return this;
    }

    getState(): S {
        return this._state;
    }

    setActions(actions: A): this {
        this._actions = actions;
        this.update();
        return this;
    }

    getActions(): A {
        return this._actions;
    }

}
