import { Router } from "../main/router";

Router
    // #users/123
    .route("users/:id", (id: string) => {
        print("users/:id |", id);
    })
    // #users/123/account/321
    .route("users/:uid/account/:aid", (uid: string, aid: string) => {
        print("users/123/account/321 |", uid, aid);
    })
    // #users
    .route("users", (path: string) => {
        print("users |", path);
    })
    // #users/foo/bar
    .route("users/*", (path: string) => {
        print("users/* |", path);
    })
    // #all/paths
    .route("*", (path: string) => {
        print("* |", path);
    });

Router.start();

Router.navigate("users/987");

function print(...args: any[]) {
    console.log.apply(console, args);
    const out = document.getElementById("output");
    out.innerHTML += "<br>" + args.join(" ");
}
