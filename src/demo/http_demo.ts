import {HttpRequest, HttpResponse, HttpProgress} from "../main/prest/http";

new HttpRequest()
    .get("https://maps.googleapis.com/maps/api/geocode/json", {
        sensor: false,
        address: "Bratislava I",
        xxx: ["yyy", "zzz"]
    })
    .onProgress((progress: HttpProgress) => {
        console.log("response progress: ", progress);
    })
    .onResponse((response: HttpResponse) => {
        console.log("response: " + response.getContentType(), response.getJson());
    })
    .onError((error) => {
        console.log("response error: ", error);
    })
    .noCache()
    // .headers({"Content-Type": "application/json"})
    // .send(data, "application/json");
    .send();

// new HttpRequest()
//     .get("bigfile.data")
//     .onProgress((progress) => {
//         console.log("progress: ", progress);
//     })
//     .onResponse((response: HttpResponse) => {
//         console.log("response: " + response.getContentType(), response);
//     })
//     .onError((error) => {
//         console.log("response error: ", error);
//     })
//     .noCache()
//     .send();
