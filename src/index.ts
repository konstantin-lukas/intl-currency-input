import {FormatterInitializer, Money, MoneyFormatter} from "moneydew";

/**
 * @desc Escapes a string for regex construction.
 */
const esc = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class IntlCurrencyInput {
    private _input: HTMLInputElement;
    private _money: Money;
    private _formattedValue: string;
    private _formatter: MoneyFormatter;

    private handleInput(e: Event) {
        if (!(e instanceof InputEvent) ||  e.type !== 'input') return;
        if (this._formattedValue === this._input.value) return;
        // TODO: negative numbers / signed values +/-

        let inputRejected: boolean = false;
        const prefix = this._formatter.prefix(this._money.isNegative);
        const suffix = this._formatter.suffix(this._money.isNegative);
        const prefixPattern: RegExp = new RegExp('^' + esc(prefix));
        const suffixPattern: RegExp = new RegExp(esc(suffix) + '$');


        if (prefixPattern.test(this._input.value) && suffixPattern.test(this._input.value)) {

            let numberRegexPattern: string = '^';
            if (this._money.floatingPointPrecision > 0 && this._formatter.decimalSeparator !== '') {
                numberRegexPattern += '(0|';
                numberRegexPattern += '0'+ esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '}|';
                numberRegexPattern += '[1-9]\\d*|';
                numberRegexPattern += '[1-9]\\d*' + esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '})';
            } else {
                numberRegexPattern += '[1-9]\\d*';
            }
            numberRegexPattern += '$';
            const valuePattern = new RegExp(numberRegexPattern);

            const value = this._input.value.replace(prefixPattern,'').replace(suffixPattern,'');
            const rawValue = value.replace(RegExp(this._formatter.groupSeparator, 'g'), '');

            if (valuePattern.test(rawValue)) {
                const groupSize = this._formatter.groupSize;
                const separator = this._formatter.groupSeparator;
                let result = '';
                if (groupSize > 0 && separator !== '') {
                    let periodIndex = rawValue.indexOf(this._formatter.decimalSeparator);

                    let counter: number;
                    if (periodIndex === -1) {
                        periodIndex = rawValue.length - 1;
                        counter = 1;
                    } else {
                        for (let i = rawValue.length - 1; i > periodIndex; i--) {
                            result = rawValue[i] + result;
                        }
                        counter = 0;
                    }

                    for (let i = periodIndex; i >= 0; i--) {
                        result = rawValue[i] + result;
                        if (counter % groupSize === 0 && counter > 0 && i > 0) {
                            result = separator + result;
                        }
                        counter++;
                    }
                } else {
                    result = rawValue;
                }
                result = prefix + result + suffix;
                this._formattedValue = result;
            } else {
                inputRejected = true;
            }
        } else {
            inputRejected = true;
        }

        const oldCaretPos = this._input.selectionStart === null ? -1 : this._input.selectionStart;
        const oldLength = this._input.value.length;
        const newLength = this._formattedValue.length;


        this._input.value = this._formattedValue;
        let newCaretPos = oldCaretPos;
        if (inputRejected)
            newCaretPos--;
        else if (newLength - oldLength === 1)
            newCaretPos++;
        else if (newLength - oldLength === -1)
            newCaretPos--;
        if (newCaretPos < 0)
            newCaretPos = 0;
        else if (newCaretPos > newLength) {
            newCaretPos = newLength
        }

        try {
            this._input.setSelectionRange(newCaretPos, newCaretPos);
        } catch (e) {
            this._input.setSelectionRange(0, 0);
        }
        if (!inputRejected)
            this._money.value = this.getValue();

        console.log(this.getValue())
        console.log(this.getFormattedValue())
    } // private handleInput(e: Event)

    /**
     * @param inputElement - An HTML element inside which to place the currency input
     * @param initializer - A Moneydew MoneyFormatter initializer. Refer to Moneydew documentation. This controls the
     * formatting of the input. When omitted defaults to settings of default constructor for MoneyFormatter.
     * @param defaultValue - The default value to display. This also controls the amount of digits after the decimal separator.
     * When omitted defaults to 0.00 (value 0 with two values after separator).
     */
    constructor(inputElement : HTMLInputElement, defaultValue?: string, initializer?: FormatterInitializer) {
        this._money = new Money(typeof defaultValue !== 'undefined' ? defaultValue : '0.00');
        this._formatter = new MoneyFormatter(typeof initializer === 'undefined' ? {} : initializer);
        this._formattedValue = this._formatter.format(this._money);
        this._input = inputElement;
        this._input.value = this._formattedValue;
        this._input.addEventListener('input', this.handleInput.bind(this));
    } // constructor(containerElement : HTMLElement, initializer: FormatterInitializer, defaultValue?: string)

    /**
     * @desc Detaches the input from the current input, and attaches to new one.
     * Does nothing if old container is same as new one.
     * @param inputElement The new element to mount to
     */
    public remount(inputElement: HTMLInputElement) {
        if (this._input.isSameNode(inputElement))
            return;
        this._input.removeEventListener('input', this.handleInput.bind(this));
        this._input = inputElement;
        this._input.value = this._formattedValue;
        this._input.addEventListener('input', this.handleInput.bind(this));
    } // public remount(containerElement: HTMLElement)

    /**
     * @desc Replaces the Moneydew formatter currently in use with a new one and automatically adjusts displayed value.
     * It is not recommended to change this formatter afterward as the currency will not automatically register those
     * changes.
     * @param formatter The new formatter - refer to Moneydew documentation for details
     */
    public format(formatter: FormatterInitializer) {
        this._formatter = new MoneyFormatter(formatter);
        this._input.value = this._formattedValue = this._formatter.format(this._money);
    }

    /**
     * @desc Add a value to the current input
     */
    public add(value: Money) {

    }

    /**
     * @desc Subtract a value from the current input
     */
    public subtract(value: Money) {

    }

    /**
     * @desc Sets the current value held by the input. This implicitly determines the amount of decimal places displayed.
     */
    public setValue(value: Money) {

    }

    /**
     * @returns a string representing the currently held value matching the following pattern: ^(0|[1-9]\d*)\\.\d{x,x}$
     * where x is the amount of current decimal places. Missing decimal places are filled with zeroes. This string
     * can be easily converted to a number but be careful as it may be larger than the largest integer.
     */
    public getValue() {
        const prefix = this._formatter.prefix(this._money.isNegative);
        const suffix = this._formatter.suffix(this._money.isNegative);
        const prefixPattern: RegExp = new RegExp('^' + esc(prefix));
        const suffixPattern: RegExp = new RegExp(esc(suffix) + '$');
        let rawValue = this._input.value.replace(prefixPattern,'')
            .replace(suffixPattern,'')
            .replace(RegExp(this._formatter.groupSeparator, 'g'), '')
            .replace(this._formatter.decimalSeparator, '.');

        const decimalPointIndex = rawValue.indexOf('.');
        if (decimalPointIndex >= 0) {
            const missingZeroes = (this._money.floatingPointPrecision - ((rawValue.length - 1) - decimalPointIndex));
            for (let i = 0; i < missingZeroes; i++) {
                rawValue += '0';
            }
        } else if (decimalPointIndex === -1) {
            rawValue += '.'
            for (let i = 0; i < this._money.floatingPointPrecision; i++) {
                rawValue += '0';
            }
        }
        return rawValue;
    }

    /**
     * @returns the current value of the input that is displayed. Missing decimal places are filled with zeroes.
     */
    public getFormattedValue() {
        return this._formatter.format(new Money(this.getValue()));
    }

    /**
     * @desc Prevents further user input and adds the .ici-disabled class to the input for user-defined styling.
     */
    public disable() {

    }

    /**
     * @desc Allows user input again after {@link disable} was called and removes .ici-disabled class.
     */
    public enable() {

    }

    /**
     * @returns whether the input is disabled
     */
    public isDisabled(): boolean {
        return true;
    }

    /**
     * @desc Enables strict mode. In strict mode the decimal separator cannot be removed and typing with the caret touching
     * the digits right of the decimal separator will overwrite the digit to the right of the caret. This implicitly means
     * that the value held by the currency input is always valid.
     */
    public enableStrictMode() {

    }

    /**
     * @desc Disables strict mode after {@link enableStrictMode} was called. When strict mode is disabled, the decimal
     * separator can be deleted and so can the numbers to the right of the decimal separator. This allows for more flexibility
     * when the user is typing but may require extra validation.
     */
    public disableStrictMode() {

    }

    /**
     * @desc Allows specifying a callback function that is called after the user makes a valid input. If a callback
     * (for valid input) has already been specified, the old one will be overwritten by the new one.
     * @param callback A parameterless function returning void
     */
    public validCallback(callback: (() => void)) {

    }

    /**
     * @desc Allows specifying a callback function that is called after the user makes an invalid input. If a callback
     * (for invalid input) has already been specified, the old one will be overwritten by the new one.
     * @param callback A parameterless function returning void
     */
    public invalidCallback(callback: (() => void)) {

    }

    /**
     * @desc Sets whether the user can enter negative values into the input. If the input is currently hold a negative
     * value the negative sign will be dropped.
     */
    public allowNegativeValues(allow: boolean) {

    }

}

