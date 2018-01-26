
import { WidgetX } from "../main/prest/jsonml/jsonml-widgetx";
import { JsonMLs } from "../main/prest/jsonml/jsonml";


class AppWidget extends WidgetX<number> {

    constructor(counter: number) {
        super("AppWidget");
        this._state = counter;
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
    .on(undefined, (data, event) => console.log("event:", event, data))
    .on("+", inc => app.events.emit("-", 1))
    .on("+", inc => app.state += inc)
    .on("-", dec => app.state -= dec);

(self as any).app = app;
