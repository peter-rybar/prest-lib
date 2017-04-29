import { Widget, JsonMLW } from "../main/prest/jsonmlidom";


class Hello extends Widget {

    public name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    render(): JsonMLW {
        return [
            ["input", { id: this.id + "-input", type: "text", value: this.name,
                oninput: (e: Event) => {
                    const i = e.target as HTMLInputElement;
                    this.name = i.value;
                    this.update();
                } }
            ],
            ["p", "Hello ", ["strong", this.name], " !"]
        ];
    }
}


class Timer extends Widget {

    private interval: number;

    constructor() {
        super();
        this.toggle();
    }

    toggle(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        } else {
            this.interval = setInterval(() => this.update(), 1000);
        }
        this.update();
    }

    render(): JsonMLW {
        return [
            ["p", { style: this.interval ? "" : "color: lightgray;" },
                "Time: ", new Date().toLocaleTimeString(), " ",
                ["button",
                    { onclick: (e: Event) => this.toggle() },
                    this.interval ? "Stop" : "Start"
                ]
            ]
        ];
    }

}


class App extends Widget {

    public title: string;

    private hello: Hello;
    private timer: Timer;

    constructor(title: string) {
        super();
        this.title = title;
        this.hello = new Hello("peter");
        this.timer = new Timer();
    }

    render(): JsonMLW {
        return [
            ["h1", this.title],
            this.hello,
            ["hr"],
            this.timer
        ];
    }

}


new App("MyApp").update("app");
// new App("MyApp").update(document.body);
