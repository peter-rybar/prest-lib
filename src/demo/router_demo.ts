import { Router } from "../main/router";

function print(...args: any[]) {
    console.log.apply(console, args);
    const out = document.getElementById("output");
    out.innerHTML += "<br>" + args.join(" ");
}

// #users/123
Router.route("users/:id", (id: string) => {
    print("users/:id |", id);
});
// #users/123/account/321
Router.route("users/:uid/account/:aid", (uid: string, aid: string) => {
    print("users/123/account/321 |", uid, aid);
});
// #users
Router.route("users", (path: string) => {
    print("users |", path);
});
// #users/foo/bar
Router.route("users/*", (path: string) => {
    print("users/* |", path);
});
// #all/paths
Router.route("*", (path: string) => {
    print("* |", path);
});

Router.start();

Router.navigate("users/987");
