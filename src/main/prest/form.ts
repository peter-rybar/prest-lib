export interface Entry {
    getName(): string;
    getValue(): string;
    setValue(value: string): this;
    validate(locale?: string): Object;
    setValidator(validator: (entry: Entry, locale?: string) => string): this;
    onChange(callback: (entry: Entry) => void): this;
}


export class InputEntry implements Entry {

    private _element: HTMLInputElement;
    private _validator: (entry: Entry, locale: string) => string;
    private _onChange: (entry: Entry) => void;

    constructor(element: HTMLInputElement|string) {
        if (typeof element === "string") {
            this._element = document.getElementById(element) as HTMLInputElement;
        } else {
            this._element = element;
        }
        this._element.addEventListener("change", (e) => {
            if (this._onChange) {
                this._onChange(this);
            }
        });
    }

    getName(): string {
        return this._element.name;
    }

    getValue(): string {
        return this._element.value;
    }

    setValue(value: string): this {
        this._element.value = value;
        return this;
    }

    validate(locale?: string): Object {
        if (this._validator) {
            return this._validator(this, locale);
        }
        return "";
    }

    setValidator(validator: (entry: Entry, locale?: string) => string): this {
        this._validator = validator;
        return this;
    }

    onChange(callback: (entry: Entry) => void): this {
        this._onChange = callback;
        return this;
    }

}


export class CheckboxEntry implements Entry {

    private _element: HTMLInputElement;
    private _validator: (entry: Entry, locale: string) => string;
    private _onChange: (entry: Entry) => void;

    constructor(element: HTMLInputElement | string) {
        if (typeof element === "string") {
            this._element = document.getElementById(element) as HTMLInputElement;
        } else {
            this._element = element;
        }
        this._element.addEventListener("change", (e) => {
            if (this._onChange) {
                this._onChange(this);
            }
        });
    }

    getName(): string {
        return this._element.name;
    }

    getValue(): string {
        return this._element.checked.toString();
    }

    setValue(value: string): this {
        this._element.checked = (value && value !== "false") ? true : false;
        return this;
    }

    validate(locale?: string): Object {
        if (this._validator) {
            return this._validator(this, locale);
        }
        return "";
    }

    setValidator(validator: (entry: Entry, locale?: string) => string): this {
        this._validator = validator;
        return this;
    }

    onChange(callback: (entry: Entry) => void): this {
        this._onChange = callback;
        return this;
    }

}


export class SelectEntry implements Entry {

    private _element: HTMLSelectElement;
    private _validator: (entry: Entry, locale: string) => string;
    private _onChange: (entry: Entry) => void;

    constructor(element: HTMLSelectElement | string) {
        if (typeof element === "string") {
            this._element = document.getElementById(element) as HTMLSelectElement;
        } else {
            this._element = element;
        }
        this._element.addEventListener("change", (e) => {
            if (this._onChange) {
                this._onChange(this);
            }
        });
    }

    getName(): string {
        return this._element.name;
    }

    getValue(): string {
        return this._element.value;
    }

    setValue(value: string): this {
        this._element.value = value;
        return this;
    }

    validate(locale?: string): Object {
        if (this._validator) {
            return this._validator(this, locale);
        }
        return "";
    }

    setValidator(validator: (entry: Entry, locale?: string) => string): this {
        this._validator = validator;
        return this;
    }

    onChange(callback: (entry: Entry) => void): this {
        this._onChange = callback;
        return this;
    }

}


export class RadioEntry implements Entry {

    private _elements: HTMLInputElement[] = [];
    private _validator: (entry: Entry, locale: string) => string;
    private _onChange: (entry: Entry) => void;

    constructor(elements: HTMLInputElement[] | string[]) {
        (elements as any).forEach((c) => {
            if (typeof c === "string") {
                this._elements.push(document.getElementById(c)  as HTMLInputElement);
            } else {
                this._elements.push(c);
            }
        });
        this._elements.forEach((c) => {
            c.addEventListener("change", (e) => {
                if (this._onChange && c.checked) {
                    this._onChange(this);
                }
            });
        });
    }

    getName(): string {
        return this._elements[0].name;
    }

    getValue(): string {
        for (let e of this._elements) {
            if (e.checked) {
                return e.value;
            }
        }
        return null;
    }

    setValue(value: string): this {
        for (let e of this._elements) {
            if (e.value === value) {
                e.checked = true;
            }
        }
        return this;
    }

    validate(locale?: string): Object {
        if (this._validator) {
            return this._validator(this, locale);
        }
        return "";
    }

    setValidator(validator: (entry: Entry, locale?: string) => string): this {
        this._validator = validator;
        return this;
    }

    onChange(callback: (entry: Entry) => void): this {
        this._onChange = callback;
        return this;
    }

}


/*
 var fileInput = document.getElementById('fileInput');
 var fileDisplayArea = document.getElementById('fileDisplayArea');

 fileInput.addEventListener('change', function(e) {
 var file = fileInput.files[0];
 var textType = /text.*!/;

 if (file.type.match(textType)) {
 var reader = new FileReader();
 reader.onload = function (e) {
 fileDisplayArea.innerText = reader.result;
 }
 reader.readAsText(file);
 } else {
 fileDisplayArea.innerText = "File not supported!"
 }
 });
 */
export class FileEntry implements Entry {

    private _element: HTMLInputElement;
    private _validator: (entry: Entry, locale: string) => string;
    private _onChange: (entry: Entry) => void;

    constructor(element: HTMLInputElement|string) {
        if (typeof element === "string") {
            this._element = document.getElementById(element) as HTMLInputElement;
        } else {
            this._element = element;
        }
        this._element.addEventListener("change", (e) => {
            if (this._onChange) {
                this._onChange(this);
            }
        });
    }

    getName(): string {
        return this._element.name;
    }

    getValue(): string {
        return this._element.files.length ?
        this._element.files[0].name + " (" +
        this._element.files[0].type + ", " +
        this._element.files[0].size + ")"
            :
            "";
    }

    getFile(): File {
        return this._element.files.length ? this._element.files[0] : null;
    }

    setValue(value: string): this {
        // this._element.files..value = value;
        return this;
    }

    validate(locale?: string): Object {
        if (this._validator) {
            return this._validator(this, locale);
        }
        return "";
    }

    setValidator(validator: (entry: Entry, locale?: string) => string): this {
        this._validator = validator;
        return this;
    }

    onChange(callback: (entry: Entry) => void): this {
        this._onChange = callback;
        return this;
    }

}


export class Form {

    private _element: HTMLFormElement;
    private _formEntries: Entry[] = [];
    private _onSubmit: (form: Form) => void;

    constructor(element: HTMLFormElement | string) {
        if (typeof element === "string") {
            this._element = document.getElementById(element) as HTMLFormElement;
        } else {
            this._element = element;
        }
        this._element.onsubmit = (e) => {
            e.preventDefault();
            if (this._onSubmit) {
                this._onSubmit(this);
            }
            return false;
        };
    }

    addEntry(entry: Entry): this {
        this._formEntries.push(entry);
        return this;
    }

    setEntries(entries: Entry[]): this {
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

    onSubmit(callback: (form: Form) => void): this {
        this._onSubmit = callback;
        return this;
    }

}
