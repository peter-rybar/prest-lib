import * as sidebar from "./sidebar";

const s = new sidebar.Sidebar()
    .setTitle("title")
    .setCancelOnClickOut()
    .setCancelOnEsc()
    .onSigOpen(() => {
        console.log("open");
    })
    .onSigClose(() => {
        console.log("close");
    })
    .onSigCancel(() => {
        console.log("cancel clicked");
    })
    .setContent(
        {
            element: function () {
                const e = document.createElement("p");
                e.innerHTML = "content text";
                return e;
            }
        }
    );

const sidebarElement = document.getElementById("sidebar") as HTMLDivElement;
sidebarElement.appendChild(s.element());


document.getElementById("btn").addEventListener("click", () => {
    s.open();
    // setTimeout(() => s.cancel(), 3000);
});

