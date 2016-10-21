import * as http from "../main/prest/http";

new http.HttpRequest()
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
        sensor: false,
        address: "Bratislava I",
        xxx: ["yyy", "zzz"]
    })
    .onResponse((response: http.HttpResponse) => {
        console.log("response: " + response.getContentType(), response.getJson());
    })
    .onError((error) => {
        console.log("response error: ", error);
    })
    .noCache()
    .send();

// new http.HttpRequest()
//     .get()
//     .url("bigfile.data")
//     .onProgress((progress) => {
//         console.log("progress: ", progress);
//     })
//     .onResponse((response: prest.http.HttpResponse) => {
//         console.log("response: " + response.getContentType(), response.getJson());
//     })
//     .onError((error) => {
//         console.log("response error: ", error);
//     })
//     .noCache()
//     .send();
