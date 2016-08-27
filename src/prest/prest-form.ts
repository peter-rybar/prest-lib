namespace prest.form {

    export interface Entry {
        getName(): string;
        getValue(): string;
        setValue(value: string): Entry;
        validate(locale?: string): Object;
        setValidator(validator: (value: string, locale?: string) => string): Entry;
        onChange(callback: (value) => void): Entry;
    }


    export class InputEntry implements Entry {

        private _element: HTMLInputElement;
        private _validator: (value: string, locale: string) => string;
        private _onChange: (value: string) => void;

        constructor(element: HTMLInputElement|string) {
            if (typeof element === "string") {
                this._element = <HTMLInputElement>document.getElementById(element);
            } else {
                this._element = element;
            }
            const self = this;
            this._element.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._element.value);
                }
            });
        }

        getName(): string {
            return this._element.name;
        }

        getValue(): string {
            return this._element.value;
        }

        setValue(value: string): Entry {
            this._element.value = value;
            return this;
        }

        validate(locale?: string): Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return "";
        }

        setValidator(validator: (value: string, locale?: string) => string): Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback: (value) => void): Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class CheckboxEntry implements Entry {

        private _element: HTMLInputElement;
        private _validator: (value: string, locale: string) => string;
        private _onChange: (value: boolean) => void;

        constructor(element: HTMLInputElement|string) {
            if (typeof element === "string") {
                this._element = <HTMLInputElement>document.getElementById(element);
            } else {
                this._element = element;
            }
            const self = this;
            this._element.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._element.checked);
                }
            });
        }

        getName(): string {
            return this._element.name;
        }

        getValue(): string {
            return this._element.checked.toString();
        }

        setValue(value: string): Entry {
            this._element.checked = (value && value !== "false") ? true : false;
            return this;
        }

        validate(locale?: string): Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return "";
        }

        setValidator(validator: (value: string, locale?: string) => string): Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback: (value) => void): Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class SelectEntry implements Entry {

        private _element: HTMLSelectElement;
        private _validator: (value: string, locale: string) => string;
        private _onChange: (value: string) => void;

        constructor(element: HTMLSelectElement|string) {
            if (typeof element === "string") {
                this._element = <HTMLSelectElement>document.getElementById(element);
            } else {
                this._element = element;
            }
            const self = this;
            this._element.addEventListener("change", (e) => {
                if (self._onChange) {
                    self._onChange(self._element.value);
                }
            });
        }

        getName(): string {
            return this._element.name;
        }

        getValue(): string {
            return this._element.value;
        }

        setValue(value: string): Entry {
            this._element.value = value;
            return this;
        }

        validate(locale?: string): Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return "";
        }

        setValidator(validator: (value: string, locale?: string) => string): Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback: (value) => void): Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class RadioEntry implements Entry {

        private _elements: HTMLInputElement[] = [];
        private _validator: (value: string, locale: string) => string;
        private _onChange: (value: string) => void;

        constructor(elements: HTMLInputElement[]|string[]) {
            const self = this;
            (<any>elements).forEach((c) => {
                if (typeof c === "string") {
                    this._elements.push(
                        <HTMLInputElement>document.getElementById(c));
                } else {
                    this._elements.push(c);
                }
            });
            this._elements.forEach((c) => {
                c.addEventListener("change", (e) => {
                    if (self._onChange && c.checked) {
                        self._onChange(c.value);
                    }
                });
            });
        }

        getName(): string {
            return this._elements[0].name;
        }

        getValue(): string {
            for (let c of this._elements) {
                if (c.checked) {
                    return c.value;
                }
            }
            return null;
        }

        setValue(value: string): Entry {
            for (let c of this._elements) {
                if (c.value === value) {
                    c.checked = true;
                }
            }
            return this;
        }

        validate(locale?: string): Object {
            if (this._validator) {
                return this._validator(this.getValue(), locale);
            }
            return "";
        }

        setValidator(validator: (value: string, locale?: string) => string): Entry {
            this._validator = validator;
            return this;
        }

        onChange(callback: (value) => void): Entry {
            this._onChange = callback;
            return this;
        }

    }


    export class Form {

        private _element: HTMLFormElement;
        private _formEntries: Entry[] = [];
        private _onSubmit: () => void;

        constructor(element: HTMLFormElement|string) {
            if (typeof element === "string") {
                this._element = <HTMLFormElement>document.getElementById(element);
            } else {
                this._element = element;
            }
            this._element.onsubmit = (e) => {
                e.preventDefault();
                if (this._onSubmit) {
                    this._onSubmit();
                }
                return false;
            };
        }

        addEntry(entry: Entry): Form {
            this._formEntries.push(entry);
            return this;
        }

        setEntries(entries: Entry[]): Form {
            this._formEntries = entries;
            return this;
        }

        getEntries(): Entry[] {
            return this._formEntries;
        }

        getEntry(name: string): Entry {
            for (let entry of this._formEntries) {
                if (entry.getName() === name) {
                    return entry;
                }
            }
            return null;
        }

        validate(locale?: string): Object {
            const errors = {};
            for (let entry of this._formEntries) {
                errors[entry.getName()] = entry.validate(locale);
            }
            return errors;
        }

        isValid(errors?: Object): boolean {
            if (!errors) {
                errors = this.validate();
            }
            for (let error in errors) {
                if (errors.hasOwnProperty(error) && errors[error]) {
                    return false;
                }
            }
            return true;
        }

        getValues(): Object {
            const values = {};
            for (let entry of this._formEntries) {
                values[entry.getName()] = entry.getValue();
            }
            return values;
        }

        submit(): void {
            this._element.submit();
        }

        onSubmit(callback: () => void): Form {
            this._onSubmit = callback;
            return this;
        }

    }

}
