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


    export class CheckboxEntry implements Entry {

        private _container:HTMLInputElement;
        private _validator:(value:string, locale:string)=>string;
        private _onChange:(value:boolean)=>void;

        constructor(container:HTMLInputElement|string) {
            if (typeof container === "string") {
                this._container = <HTMLInputElement>document.getElementById(container);
            } else {
                this._container = container;
            }
            var self = this;
            this._container.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._container.checked);
                }
            });
        }

        getName():string {
            return this._container.name;
        }

        getValue():string {
            return this._container.checked.toString();
        }

        setValue(value:string):Entry {
            this._container.checked = (value && value != 'false') ? true : false;
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


    export class RadioEntry implements Entry {

        private _containers:HTMLInputElement[] = [];
        private _validator:(value:string, locale:string)=>string;
        private _onChange:(value:string)=>void;

        constructor(containers:HTMLInputElement[]|string[]) {
            var self = this;
            (<any>containers).forEach((c) => {
                if (typeof c === "string") {
                    this._containers.push(
                        <HTMLInputElement>document.getElementById(c));
                } else {
                    this._containers.push(c);
                }
            });
            this._containers.forEach((c) => {
                c.addEventListener("change", (e) => {
                    if (self._onChange && c.checked) {
                        self._onChange(c.value);
                    }
                });
            });
        }

        getName():string {
            return this._containers[0].name;
        }

        getValue():string {
            for (var c of this._containers) {
                if (c.checked) {
                    return c.value;
                }
            }
            return null;
        }

        setValue(value:string):Entry {
            for (var c of this._containers) {
                if (c.value == value) {
                    c.checked = true;
                }
            }
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

        getEntry(name:string):Entry {
            for (var entry of this._formEntries) {
                if (entry.getName() == name) {
                    return entry;
                }
            }
            return null;
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
