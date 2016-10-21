export class History<T> {

    back(distance?: any) {
        window.history.back(distance);
    }

    forward(distance?: any) {
        window.history.forward(distance);
    }

    go(delta?: any) {
        window.history.go(delta);
    }

    length(): number {
        return window.history.length;
    }

    state(): any {
        return window.history.state;
    }

    pushState(state: T, title: string, url?: string) {
        window.history.pushState(state, title, url);
    }

    replaceState(state, title: string, url?: string) {
        window.history.replaceState(state, title, url);
    }

    onChange(callback: (state: T) => void) {
        window.addEventListener("popstate", function (e: PopStateEvent) {
            callback(e.state);
        });
    }

}
