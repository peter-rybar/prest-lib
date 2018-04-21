import { WidgetX } from "../main/prest/widgetx";
import { JsonMLs, JsonML } from "../main/prest/jsonml";

interface AppState {
    title: string;
    count: number;
}

class AppWidget extends WidgetX<AppState> {

    constructor(state: AppState) {
        super("AppWidget", state);
    }

    render(): JsonMLs {
        return [
            ["h2", this.state.title],
            ["p", this._state.count.toString()],
            button("-", this.dec),
            button("+", this.inc)
        ];
    }

    private dec = () => {
        this.events.emit("-", 2);
    }

    private inc = () => {
        this.events.emit("+", 2);
    }

}

function button(label: string, cb: (e: Event) => void): JsonML {
    return ["button", { click: cb }, label];
}

const app = new AppWidget({ title: "Counter", count: 77 })
    .mount(document.getElementById("app"));

// flux dispatcher
app.events
    .on("", (data, ctx, event) => {
        console.log("event:", data, event, ctx);
    })
    .on("+", (inc, aw) => {
        aw.events.emit("-", 1);
    })
    .on("+", (inc, aw) => {
        aw.state.count += inc;
        aw.update();
    })
    .on("-", (dec, aw) => {
        const s = aw.state;
        s.count -= dec;
        aw.state = s;
    });

(self as any).app = app;
