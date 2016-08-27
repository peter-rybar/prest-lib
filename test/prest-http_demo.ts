/// <reference path="../src/prest/prest-http.ts" />

window.onload = () => {

    new prest.http.HttpRequest()
        .url("https://maps.googleapis.com/maps/api/geocode/json",
            {sensor: false, address: "Bratislava I", xxx: ["yyy", "zzz"]})
        .method("GET")
        .onResponse((response: prest.http.HttpResponse) => {
            console.log("response: " + response.getContentType(), response.getJson());
        })
        .onError((error) => {
            console.log("response error: ", error);
        })
        .send();

    prest.http.GET(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {sensor: false, address: "Bratislava II", xxx: ["yyy", "zzz"]},
        (err, res) => {
            if (err) {
                console.log("response error: ", err);
            } else {
                console.log("response: " + res.getContentType(), res.getJson());
            }
        });
};
