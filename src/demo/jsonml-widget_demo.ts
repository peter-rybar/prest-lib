import { Widget, JsonMLs, jsonml2html } from "../main/prest/jsonml";


class Hello extends Widget {

    public name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    render(): JsonMLs {
        return [
            ["input~i", { type: "text", value: this.name,
                input: (e: Event) => {
                    // const i = e.target as HTMLInputElement;
                    const i = this.refs["i"] as  HTMLInputElement;
                    this.name = i.value;
                    this.update();
                } }
            ],
            ["p", "Hello ", ["strong", this.name], " !"]
        ];
    }
}


class Timer extends Widget {

    private _interval: number;

    constructor() {
        super();
    }

    toggle(on?: boolean): void {
        if (on === true) {
            if (!this._interval) {
                this._interval = setInterval(() => this.update(), 1000);
            }
        } else if (on === false) {
            if (this._interval) {
                clearInterval(this._interval);
                this._interval = undefined;
            }
        } else {
            this.toggle(!this._interval);
        }
        this.update();
    }

    domAttach() {
        this.toggle(true);
    }

    domDetach() {
        this.toggle(false);
    }

    render(): JsonMLs {
        return [
            ["p", { style: this._interval ? "" : "color: lightgray;" },
                "Time: ", new Date().toLocaleTimeString(), " ",
                ["button",
                    { click: (e: Event) => this.toggle() },
                    this._interval ? "Stop" : "Start"
                ]
            ]
        ];
    }

}


class App extends Widget {

    public title: string;

    private _hello: Hello;
    private _timer: Timer;

    constructor(title: string) {
        super();
        this.title = title;
        this._hello = new Hello("peter");
        this._timer = new Timer();
    }

    render(): JsonMLs {
        return [
            ["h1", this.title],
            this._hello,
            ["hr"],
            this._timer
        ];
    }

}


const app = new App("MyApp").update(document.getElementById("app"));

// app html
const html = jsonml2html(app.renderJsonML(), true);
console.log(html);

// app data
// console.log(JSON.stringify(app, null, 4));
