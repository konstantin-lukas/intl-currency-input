import {FormatterInitializer, Money, MoneyCalculator, MoneyFormatter} from "moneydew";

/**
 * @desc Escapes a string for regex construction.
 */
const esc = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class IntlCurrencyInput {
    private _input: HTMLInputElement;
    private _money: Money;
    private _inputValue!: string;
    private _formatter!: MoneyFormatter;
    private _eventListener: (e: InputEvent) => void;
    private _validCallback: null | (() => void) = null;
    private _invalidCallback: null | (() => void) = null;
    private _strictMode: boolean = false;
    private _allowNegativeValues: boolean = true;

    private handleInput(e: InputEvent) {
        if (this._inputValue === this._input.value) return;
        // TODO: negative numbers / signed values +/-
        // TODO: delete last digit --> convert to zero

        let inputRejected: boolean = false;
        const prefix = this._formatter.prefix(this._money.isNegative);
        const suffix = this._formatter.suffix(this._money.isNegative);
        const prefixPattern: RegExp = new RegExp('^' + esc(prefix));
        const suffixPattern: RegExp = new RegExp(esc(suffix) + '$');


        if (prefixPattern.test(this._input.value) && suffixPattern.test(this._input.value)) {

            let numberRegexPattern: string = '^';
            if (this._money.floatingPointPrecision > 0 && this._formatter.decimalSeparator !== '') {
                if (this._strictMode) {
                    /* istanbul ignore next */
                    const start = this._input.selectionStart === null ? 0 : this._input.selectionStart;
                    /* istanbul ignore next */
                    const end = this._input.selectionEnd === null ? 0 : this._input.selectionEnd;
                    const decimalSepPos = this._input.value.indexOf(this._formatter.decimalSeparator);

                    if (start === end && start > decimalSepPos) {
                        let inputString = this._input.value;
                        if (e.inputType === 'insertText') {
                            inputString = inputString.slice(0, start).concat(inputString.slice(start + 1));

                            const suffixPos = this._input.value.search(suffixPattern);
                            const caretPos = start > suffixPos - 1 ? suffixPos - 1 : start;

                            this._input.value = inputString;
                            if (decimalSepPos === -1) {
                                this._input.setSelectionRange(start - 1, start - 1);
                            } else {
                                this._input.setSelectionRange(caretPos, caretPos);
                            }
                        } else if (e.inputType === 'deleteContentBackward' && start > decimalSepPos) {
                            inputString = inputString.slice(0, start).concat('0').concat(inputString.slice(start));
                            this._input.value = inputString;
                            this._input.setSelectionRange(start, start);
                        }
                    }
                    numberRegexPattern += '(0|[1-9]\\d*)' + esc(this._formatter.decimalSeparator);
                    numberRegexPattern += '\\d{' + this._money.floatingPointPrecision + ',' + this._money.floatingPointPrecision + '}';
                } else {
                    numberRegexPattern += '(0|';
                    numberRegexPattern += '0' + esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '}|';
                    numberRegexPattern += '[1-9]\\d*|';
                    numberRegexPattern += '[1-9]\\d*' + esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '})';
                }
            } else {
                numberRegexPattern += '[1-9]\\d*';
            }
            numberRegexPattern += '$';

            const valuePattern = new RegExp(numberRegexPattern);

            const value = this._input.value.replace(prefixPattern,'').replace(suffixPattern,'');
            let rawValue = value.replace(RegExp(this._formatter.groupSeparator, 'g'), '');

            if (new RegExp(`^${esc(this._formatter.decimalSeparator)}\\d*$`).test(rawValue)) {
                rawValue = '0' + rawValue;
            } else if (rawValue === '') {
                rawValue = '0';
            }

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
                this._inputValue = result;
            } else {
                inputRejected = true;
            }
        } else {
            inputRejected = true;
        }

        /* istanbul ignore next */
        let caretPos = this._input.selectionStart === null ? 0 : this._input.selectionStart;
        const oldCaretPos = caretPos;
        const oldLength = this._input.value.length;
        const newLength = this._inputValue.length;

        this._input.value = this._inputValue;

        if (newLength < oldLength)
            caretPos -= (oldLength - newLength);
        else if (newLength > oldLength)
            caretPos += (newLength - oldLength);

        if (inputRejected && e.inputType === 'deleteContentForward')
            caretPos--;
        else if (!inputRejected && e.inputType === 'deleteContentForward' && oldCaretPos >= prefix.length && caretPos < prefix.length)
            caretPos += this._formatter.groupSeparator.length;

        try {
            this._input.setSelectionRange(caretPos, caretPos);
        } catch (e) {
            /* istanbul ignore next */
            this._input.setSelectionRange(0, 0);
        }

        if (inputRejected) {
            if (this._invalidCallback)
                this._invalidCallback();
        } else {
            this._money.value = this.getValue();
            if (this._validCallback)
                this._validCallback();
        }
    } // private handleInput(e: Event)

    /**
     * @param inputElement - An HTML element inside which to place the currency input
     * @param initializer - A Moneydew MoneyFormatter initializer. Refer to Moneydew documentation. This controls the
     * formatting of the input. When omitted defaults to settings of default constructor for MoneyFormatter.
     * @param initialValue - The default value to display. This also controls the amount of digits after the decimal separator.
     * When omitted defaults to 0.00 (value 0 with two values after separator).
     */
    constructor(inputElement : HTMLInputElement, initialValue?: string, initializer?: FormatterInitializer) {
        this._money = new Money(typeof initialValue !== 'undefined' ? initialValue : '0.00');
        this._input = inputElement;
        this.format(typeof initializer === 'undefined' ? {} : initializer);
        this._eventListener = this.handleInput.bind(this);
        this._input.addEventListener('input', this._eventListener as EventListener);
    } // constructor(containerElement : HTMLElement, defaultValue?: string, initializer?: FormatterInitializer)

    /**
     * @desc Detaches the input from the current input, and attaches to new one.
     * Does nothing if old container is same as new one.
     * @param inputElement The new element to mount to
     */
    public remount(inputElement: HTMLInputElement) {
        if (this._input.isSameNode(inputElement))
            return;
        this._input.removeEventListener('input', this._eventListener as EventListener);
        this._input = inputElement;
        this._input.value = this._inputValue;
        this._eventListener = this.handleInput.bind(this);
        this._input.addEventListener('input', this._eventListener as EventListener);
    } // public remount(containerElement: HTMLElement)

    /**
     * @desc Unmounts the currency input. Trying to use member functions other than {@link remount} after unmounting will
     * result in undefined behaviour until {@link remount} is called or the variable has been overwritten by a new
     * instance of IntlCurrencyInput. Note that you don't have to call this function before {@link remount}. This function
     * is useful if you want to stop input restrictions on the input element. It is recommended to unmount before the
     * currency input gets destroyed by the garbage collector. Otherwise, you end up with a rogue event listener on your
     * input element.
     */
    unmount() {
        this._input.removeEventListener('input', this._eventListener as EventListener);
    } // unmount()

    /**
     * @desc Replaces the Moneydew formatter currently in use with a new one and automatically adjusts displayed value.
     * It is not recommended to change this formatter afterward as the currency will not automatically register those
     * changes.
     * @param f The new formatter - refer to Moneydew documentation for details
     */
    public format(f: FormatterInitializer) {

        const  haveCommonCharacters = (str1: string, str2: string): boolean => {
            if (str1 === str2) return true;
            const charSet1 = new Set(str1);
            const charSet2 = new Set(str2);
            for (const char of charSet1) {
                if (charSet2.has(char)) {
                    return true;
                }
            }
            return false;
        }

        if (typeof f.digitCharacters !== 'undefined') {
            f.digitCharacters = undefined;
            console.warn('The digitCharacters option is not supported in this version. Value will be ignored');
        }

        if (typeof f.myriadMode !== 'undefined') {
            f.myriadMode = undefined;
            console.warn('The myriadMode option is not supported in this version. Value will be ignored');
        }

        if (typeof f.myriadCharacters !== 'undefined') {
            f.myriadCharacters = undefined;
            console.warn('The digitCharacters option is not supported in this version. Value will be ignored');
        }

        if (typeof f.decimalSeparator !== 'undefined' && f.decimalSeparator === '')
            throw new Error('Decimal separator cannot be empty.');

        if ((typeof f.groupSeparator !== 'undefined' &&
                typeof f.decimalSeparator !== 'undefined' &&
                haveCommonCharacters(f.groupSeparator, f.decimalSeparator)) ||
            (typeof f.groupSeparator !== 'undefined' &&
                typeof f.decimalSeparator === 'undefined' &&
                haveCommonCharacters(f.groupSeparator, '.')) ||
            (typeof f.groupSeparator === 'undefined' &&
                typeof f.decimalSeparator !== 'undefined' &&
                haveCommonCharacters(',', f.decimalSeparator)))
            throw new Error('Decimal and group separated may not have any characters in common.');

        if ((typeof f.positiveSign !== 'undefined' &&
                typeof f.negativeSign !== 'undefined' &&
                f.positiveSign === f.negativeSign) ||
            (typeof f.positiveSign !== 'undefined' &&
                typeof f.negativeSign === 'undefined' &&
                f.positiveSign === '-') )
            throw new Error('The positive and negative sign may not be the same.');

        this._formatter = new MoneyFormatter(f);
        this._input.value = this._inputValue = this._formatter.format(this._money);
    }

    /**
     * @desc Add a value to the current input
     */
    public add(value: Money | string) {
        if (typeof value === 'string') {
            MoneyCalculator.add(this._money, new Money(value));
        } else {
            MoneyCalculator.add(this._money, value);
        }
        this._input.value = this._inputValue = this._formatter.format(this._money);
    }

    /**
     * @desc Subtract a value from the current input
     */
    public subtract(value: Money | string) {
        if (typeof value === 'string') {
            MoneyCalculator.subtract(this._money, new Money(value));
        } else {
            MoneyCalculator.subtract(this._money, value);
        }
        this._input.value = this._inputValue = this._formatter.format(this._money);
    }

    /**
     * @desc Sets the current value held by the input. This implicitly determines the amount of decimal places displayed.
     */
    public setValue(value: string) {
        this._money = new Money(value);
        this._input.value = this._inputValue = this._formatter.format(this._money);
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
        } else if (decimalPointIndex === -1 && this._money.floatingPointPrecision > 0) {
            rawValue += '.'
            for (let i = 0; i < this._money.floatingPointPrecision; i++) {
                rawValue += '0';
            }
        }
        if (this._money.isNegative)
            rawValue = '-' + rawValue;
        return rawValue;
    }

    /**
     * @returns the current value of the input that is displayed. Missing decimal places are filled with zeroes.
     */
    public getFormattedValue() {
        return this._formatter.format(this._money);
    }

    /**
     * @desc Disables the input element.
     */
    public disable() {
        this._input.disabled = true;
    }

    /**
     * @desc Enables the input element.
     */
    public enable() {
        this._input.disabled = false;
    }

    /**
     * @returns whether the input is disabled
     */
    public isDisabled() {
        return this._input.disabled;
    }

    /**
     * @desc Enables strict mode. In strict mode the decimal separator cannot be removed and typing with the caret touching
     * the digits right of the decimal separator will overwrite the digit to the right of the caret. This implicitly means
     * that the value held by the currency input is always valid. Keep in my that {@link getFormattedValue} and
     * {@link getValue} always return a valid value. Strict mode only controls the displayed value and user interaction.
     */
    public enableStrictMode() {
        this._strictMode = true;
        this._input.value = this._inputValue = this.getFormattedValue();
    }

    /**
     * @desc Disables strict mode after {@link enableStrictMode} was called. When strict mode is disabled, the decimal
     * separator can be deleted and so can the numbers to the right of the decimal separator. This allows for more flexibility
     * when the user is typing but may require extra validation. Keep in my that {@link getFormattedValue} and
     * {@link getValue} always return a valid value. Strict mode only controls the displayed value and user interaction.
     */
    public disableStrictMode() {
        this._strictMode = false;
    }

    /**
     * @desc Allows specifying a callback function that is called after the user makes a valid input. If a callback
     * (for valid input) has already been specified, the old one will be overwritten by the new one.
     * @param callback A parameterless function returning void
     */
    public validCallback(callback: (() => void)) {
        this._validCallback = callback;
    }

    /**
     * @desc Allows specifying a callback function that is called after the user makes an invalid input. If a callback
     * (for invalid input) has already been specified, the old one will be overwritten by the new one.
     * @param callback A parameterless function returning void
     */
    public invalidCallback(callback: (() => void)) {
        this._invalidCallback = callback;
    }

    /**
     * @desc Sets whether the user can enter negative values into the input. If the input is currently hold a negative
     * value the negative sign will be dropped.
     */
    public allowNegativeValues(allow: boolean) {

    }

}

