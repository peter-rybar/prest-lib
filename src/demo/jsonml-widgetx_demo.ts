
import { WidgetX } from "../main/prest/jsonml/jsonml-widgetx";
import { JsonMLs } from "../main/prest/jsonml/jsonml";


class AppWidget extends WidgetX<number> {

    constructor(counter: number) {
        super("AppWidget", counter);
    }

    render(): JsonMLs {
        return [
            ["p", this._state.toString()],
            ["button", { click: () => this.events.emit("-", 2)}, "-"],
            ["button", { click: () => this.events.emit("+", 2)}, "+"],
        ];
    }
}


const app = new AppWidget(77)
    .mount(document.getElementById("app"));

// flux dispatcher
app.events
    .on(undefined, (data, ctx, event) => console.log("event:", data, event, ctx))
    .on("+", (inc, aw) => aw.events.emit("-", 1))
    .on("+", (inc, aw) => aw.state += inc)
    .on("-", (dec, aw) => aw.state -= dec);

(self as any).app = app;
