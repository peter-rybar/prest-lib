import * as form from "../main/prest/form";

const stringValidator = (entry: form.Entry, locale: string) => {
    switch (locale) {
        case "sk":
            return entry.getValue() ? "" : "Prázdna hodnota";
        default:
            return entry.getValue() ? "" : "Empty value";
    }
};

const numberValidator = (entry: form.Entry, locale: string) => {
    switch (locale) {
        case "sk":
            return entry.getValue() ? "" : "Prázdna hodnota";
        default:
            return entry.getValue() ? "" : "Empty value";
    }
};

const fileValidator = (entry: form.FileEntry, locale: string) => {
    switch (locale) {
        case "sk":
            return entry.getFile() ? "" : "Prázdna hodnota";
        default:
            return entry.getFile() ? "" : "Empty value";
    }
};

const showChange = (entry: form.Entry) => {
    document.getElementById("change").innerHTML = entry.getValue();
};

new form.Form("form")
    .addEntry(
        new form.TextInputEntry("name")
            .setValue("Peter")
            .setValidator(stringValidator)
            .onChange(showChange))
    .addEntry(
        new form.NumberInputEntry("age")
            .setStep(0.1)
            .setDecimals(2)
            .setValue("20")
            .enableMouseWheel()
            .enableMouseDrag()
            .setValidator(numberValidator)
            .onChange(showChange))
    .addEntry(
        new form.SelectEntry("sex")
            .setValue("M")
            .setValidator(stringValidator)
            .onChange(showChange))
    .addEntry(
        new form.CheckboxEntry("agree")
            .setValue(true.toString())
            .setValidator(stringValidator)
            .onChange(showChange))
    .addEntry(
        new form.RadioEntry(["yes-no-y", "yes-no-n"])
            .setValue("n")
            .setValidator(stringValidator)
            .onChange(showChange))
    .addEntry(
        new form.FileEntry("file")
            .setValue("File")
            .setValidator(fileValidator)
            .onChange(showChange))
    .onSubmit((form: form.Form) => {
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
