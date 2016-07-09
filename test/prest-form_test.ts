/// <reference path="../src/prest/prest-form.ts" />

window.onload = () => {
    var emptyValueValidator = (value:string, locale:string) => {
        switch (locale) {
            case 'sk':
                return value ? '' : 'Prázdna hodnota';
            default:
                return value ? '' : 'Empty value';
        }
    };
    var showChange = (value) => {
        document.getElementById('change').innerHTML = value;
    };

    var f = new prest.form.Form('form')
        .addEntry(new prest.form.InputEntry('name')
            .setValue('Peter')
            .setValidator(emptyValueValidator)
            .onChange(showChange))
        .addEntry(new prest.form.SelectEntry('sex')
            .setValue('M')
            .setValidator(emptyValueValidator)
            .onChange(showChange))
        .addEntry(new prest.form.CheckboxEntry('agree')
            .setValue(true.toString())
            .setValidator(emptyValueValidator)
            .onChange(showChange))
        .addEntry(new prest.form.RadioEntry(['yes-no-y', 'yes-no-n'])
            .setValue('n')
            .setValidator(emptyValueValidator)
            .onChange(showChange))
        .onSubmit(() => {
            var errors = f.validate('sk');
            for (var error in errors) {
                document.getElementById(error + '-err').innerHTML = errors[error];
            }
            if (f.isValid(errors)) {
                document.getElementById('values').innerHTML = JSON.stringify(f.getValues());
            } else {
                document.getElementById('values').innerHTML = '';
            }
        });
};
