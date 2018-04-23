
// DATASET https://data.gov.sk/dataset


// http://www.posta.sk/sluzby/postove-smerovacie-cisla - xls

// zdroj: https://data.gov.sk/dataset/register-adries-register-obci/resource/15262453-4a0f-4cce-a9e4-7709e135e4b8

import { HttpRequest } from "../../../main/http";
import { html, select } from "../../../main/dom";

// "https://data.gov.sk/api/action/datastore_search?resource_id=15262453-4a0f-4cce-a9e4-7709e135e4b8&q=rajec"
// "https://data.gov.sk/api/action/datastore_search?resource_id=15262453-4a0f-4cce-a9e4-7709e135e4b8&limit=5"
// "https://data.gov.sk/api/action/datastore_search_sql?sql=SELECT%20*%20from%20%2215262453-4a0f-4cce-a9e4-7709e135e4b8%22%20WHERE%20title%20LIKE%20%27jones%27"

// ulice "https://data.gov.sk/api/action/datastore_search?resource_id=47f0e853-3a67-487e-b45f-3f5d099105cf&limit=5"


// new HttpRequest()
//     .get("https://data.gov.sk/api/action/datastore_search", {
//         resource_id: "15262453-4a0f-4cce-a9e4-7709e135e4b8",
//         q: "bratislava",
//         limit: 20
//     })
//     .onResponse(r => {
//         console.log(r.getJson().result.records.length);
//         r.getJson().result.records.forEach((i: any) => {
//             console.log(i.municipalityName);
//             console.log(i);
//         });
//         // console.log(r.getJson().result.records.municipalityName);
//     })
//     .onError(e => console.error(e))
//     .send();

const ol = html(`<ol></ol>`);
select("#obce").appendChild(ol);

new HttpRequest()
    .get("https://data.gov.sk/api/action/datastore_search", {
        resource_id: "15262453-4a0f-4cce-a9e4-7709e135e4b8", // obce
        limit: 5000
    })
    .onResponse(r => {
        console.log(r.getJson().result.records.length);
        r.getJson().result.records.forEach((i: any) => {
            // console.log(i.municipalityName, i.status, i.municipalityCode);
            // console.log(i);
            ol.appendChild(html(`
                <li>
                    ${i.objectId}
                    ${i.municipalityName}
                    ${i.status}
                    ${i.municipalityCode}
                </li>`));
        });
    })
    .onError(e => console.error(e))
    .send();


new HttpRequest()
    .get("https://data.gov.sk/api/action/datastore_search", {
        resource_id: "47f0e853-3a67-487e-b45f-3f5d099105cf", // ulice
        // q: "29.augusta",
        q: "*:3004", // stare mesto
        limit: 100
    })
    .onResponse(r => {
        console.log(r.getJson().result.records.length);
        r.getJson().result.records.forEach((i: any) => {
            console.log(i.municipalityIdentifiers, i.streetName);
            // console.log(i);
        });
    })
    .onError(e => console.error(e))
    .send();
