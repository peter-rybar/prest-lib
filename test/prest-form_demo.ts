/// <reference path="../src/prest/prest-form.ts" />

window.onload = () => {
    const stringValidator = (entry: prest.form.Entry, locale: string) => {
        switch (locale) {
            case "sk":
                return entry.getValue() ? "" : "Prázdna hodnota";
            default:
                return entry.getValue() ? "" : "Empty value";
        }
    };

    const fileValidator = (entry: prest.form.FileEntry, locale: string) => {
        switch (locale) {
            case "sk":
                return entry.getFile() ? "" : "Prázdna hodnota";
            default:
                return entry.getFile() ? "" : "Empty value";
        }
    };

    const showChange = (entry: prest.form.Entry) => {
        document.getElementById("change").innerHTML = entry.getValue();
    };

    new prest.form.Form("form")
        .addEntry(new prest.form.InputEntry("name")
            .setValue("Peter")
            .setValidator(stringValidator)
            .onChange(showChange))
        .addEntry(new prest.form.SelectEntry("sex")
            .setValue("M")
            .setValidator(stringValidator)
            .onChange(showChange))
        .addEntry(new prest.form.CheckboxEntry("agree")
            .setValue(true.toString())
            .setValidator(stringValidator)
            .onChange(showChange))
        .addEntry(new prest.form.RadioEntry(["yes-no-y", "yes-no-n"])
            .setValue("n")
            .setValidator(stringValidator)
            .onChange(showChange))
        .addEntry(new prest.form.FileEntry("file")
            .setValue("File")
            .setValidator(fileValidator)
            .onChange(showChange))
        .onSubmit((form: prest.form.Form) => {
            const errors = form.validate("sk");
            for (const error in errors) {
                if (errors.hasOwnProperty(error)) {
                    document.getElementById(error + "-err").innerHTML = errors[error];
                }
            }
            if (form.isValid(errors)) {
                document.getElementById("values").innerHTML = JSON.stringify(form.getValues());
            } else {
                document.getElementById("values").innerHTML = "";
            }
        });
};
