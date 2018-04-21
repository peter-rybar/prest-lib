
import { WidgetXx } from "../main/prest/jsonml/widgetxx";
import { JsonMLs, JsonML } from "../main/prest/jsonml/jsonml";

interface AppState {
    title: string;
    count: number;
}

interface AppActions {
    inc(n: number): void;
    dec(n: number): void;
}

class AppWidget extends WidgetXx<AppState, AppActions> {

    constructor(state?: AppState) {
        super("AppWidget", state);
    }

    render(): JsonMLs {
        return [
            ["h2", this._state.title],
            ["p", this._state.count.toString()],
            button("-", this.dec),
            button("+", this.inc)
        ];
    }

    private dec = () => {
        this._actions.dec(2);
    }

    private inc = () => {
        this._actions.inc(2);
    }

}

function button(label: string, cb: (e: Event) => void): JsonML {
    return ["button", { click: cb }, label];
}

const app: AppWidget = new AppWidget()
    .setState({ title: "Counter", count: 77 })
    .setActions({
        inc: (n: number) => {
            console.log("inc", n);
            const s = app.getState();
            s.count += n;
            app.setState(s);
        },
        dec: (n: number) => {
            console.log("dec", n);
            app.getState().count -= n;
            app.update();
        }
    })
    .mount(document.getElementById("app"));

(self as any).app = app;
