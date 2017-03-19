import * as notifs from "./notifs";

const notifsWidget = new notifs.NotifsWidget()
    .mount(document.getElementById("notifs"));

document.getElementById("add").onclick = function () {
    notifsWidget.addNotif({
        type: notifs.TYPE_INFO,
        title: "title",
        text: "text text"
    });
};
document.getElementById("empty").onclick = function () {
    notifsWidget.empty();
};

notifsWidget.addNotif({
    type: notifs.TYPE_SUCCESS,
    title: "title",
    text: "text text"
});

setTimeout(function () {
    notifsWidget.addNotif({
        type: notifs.TYPE_INFO,
        title: "title",
        text: "text text"
    });
}, 1000);

setTimeout(function () {
    notifsWidget.addNotif({
        type: notifs.TYPE_WARNING,
        title: "title",
        text: "text text"
    });
}, 2000);

setTimeout(function () {
    notifsWidget.addNotif({
        type: notifs.TYPE_DANGER,
        title: "title",
        text: "text text"
    });
}, 3000);
