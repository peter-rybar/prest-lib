import { WidgetE } from "../main/widgete";
import { JsonMLs, JsonML } from "../main/jsonml";

interface AppState {
    title: string;
    count: number;
}

class AppWidget extends WidgetE<AppState> {

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
        this.events.emit("dec", 2);
    }

    private inc = () => {
        this.events.emit("inc", 2);
    }

}

function button(label: string, cb: (e: Event) => void): JsonML {
    return ["button", { click: cb }, label];
}

const app: AppWidget = new AppWidget({ title: "Counter", count: 77 })
    .mount(document.getElementById("app"));

// flux dispatcher
app.events
    .on("", (data, widget, event) => {
        console.log("event:", data, event, widget);
    })
    .on("inc", (num, widget) => {
        widget.events.emit("dec", 1);
    })
    .on("inc", (num, widget) => {
        widget.state.count += num;
        widget.update();
    })
    .on("dec", (num, widget) => {
        const s = widget.state;
        s.count -= num;
        widget.state = s;
    });

(self as any).app = app;
