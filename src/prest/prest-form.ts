module prest.form {

    export interface Entry {
        getName():string;
        getValue():string;
        setValue(value:string):Entry;
        validate(locale?:string):Object;
        setValidator(validator:(value:string, locale?:string)=>string):Entry;
        onChange(callback:(value)=>void):Entry;
    }


    export class InputEntry implements Entry {

        private _container:HTMLInputElement;
        private _validator:(value:string, locale:string)=>string;
        private _onChange:(value:string)=>void;

        constructor(container:HTMLInputElement|string) {
            if (typeof container === "string") {
                this._container = <HTMLInputElement>document.getElementById(container);
            } else {
                this._container = container;
            }
            var self = this;
            this._container.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._container.value);
                }
            });
        }

        getName():string {
            return this._container.name;
        }

        getValue():string {
            return this._container.value;
        }

        setValue(value:string):Entry {
            this._container.value = value;
            return this;
        }

        validate(locale?:string):Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return '';
        }

        setValidator(validator:(value:string, locale?:string)=>string):Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback:(value)=>void):Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class SelectEntry implements Entry {

        private _container:HTMLSelectElement;
        private _validator:(value:string, locale:string)=>string;
        private _onChange:(value:string)=>void;

        constructor(container:HTMLSelectElement|string) {
            if (typeof container === "string") {
                this._container = <HTMLSelectElement>document.getElementById(container);
            } else {
                this._container = container;
            }
            var self = this;
            this._container.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._container.value);
                }
            });
        }

        getName():string {
            return this._container.name;
        }

        getValue():string {
            var c = this._container;
            return c.value;
        }

        setValue(value:string):Entry {
            this._container.value = value;
            return this;
        }

        validate(locale?:string):Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return '';
        }

        setValidator(validator:(value:string, locale?:string)=>string):Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback:(value)=>void):Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class Form {

        private _container:HTMLFormElement;
        private _formEntries:Entry[] = [];
        private _onSubmit:()=>void;

        constructor(container:HTMLFormElement|string) {
            if (typeof container === "string") {
                this._container = <HTMLFormElement>document.getElementById(container);
            } else {
                this._container = container;
            }
            this._container.onsubmit = (e) => {
                e.preventDefault();
                if (this._onSubmit) {
                    this._onSubmit();
                }
                return false;
            };
        }

        addEntry(entry:Entry):Form {
            this._formEntries.push(entry);
            return this;
        }

        setEntries(entries:Entry[]):Form {
            this._formEntries = entries;
            return this;
        }

        getEntries():Entry[] {
            return this._formEntries;
        }

        validate(locale?:string):Object {
            var errors = {};
            for (var entry of this._formEntries) {
                errors[entry.getName()] = entry.validate(locale);
            }
            return errors
        }

        isValid(errors?:Object):boolean {
            if (!errors) {
                errors = this.validate();
            }
            for (var error in errors) {
                if (errors[error]) {
                    return false;
                }
            }
            return true;
        }

        getValues():Object {
            var values = {};
            for (var entry of this._formEntries) {
                values[entry.getName()] = entry.getValue();
            }
            return values;
        }

        submit():void {
            this._container.submit();
        }

        onSubmit(callback:()=>void):Form {
            this._onSubmit = callback;
            return this;
        }

    }

}
