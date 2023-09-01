import {FormatterInitializer, Money, MoneyFormatter} from "moneydew";


export class IntlCurrencyInput {
    private _container: HTMLElement;
    private _input: HTMLElement;
    private _money: Money;
    private _formattedValue: string;
    private _formatter: MoneyFormatter;

    private getCaretPosition() {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        if (typeof range === 'undefined')
            throw new Error('Can\'t get selection.');
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(this._input);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }

    /**
     * @param containerElement - An HTML element inside which to place the currency input
     * @param initializer - A Moneydew MoneyFormatter initializer. Refer to Moneydew documentation. This controls the
     * formatting of the input. Pass an empty object for default config.
     * @param defaultValue - The default value to display. This also controls the amount of digits after the decimal separator.
     * When omitted defaults to 0.00 (value 0 with two values after separator).
     */
    constructor(containerElement : HTMLElement, initializer: FormatterInitializer, defaultValue?: string) {
        this._money = new Money(typeof defaultValue !== 'undefined' ? defaultValue : '0.00');
        this._formatter = new MoneyFormatter(initializer);
        this._formattedValue = this._formatter.format(this._money);

        this._container = containerElement;

        this._input = document.createElement('span');
        this._input.classList.add('ici-input');
        this._input.innerText = this._formatter.format(this._money);
        this._input.contentEditable = 'true';
        this._input.style.outline = 'none';
        this._input.setAttribute('spellcheck', 'false');

        /**
         * @desc Escapes a string for regex construction.
         */
        const esc = (string: string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }


        this._input.addEventListener('input', (e: Event) => {
            let inputRejected: boolean = false;
            if (!(e instanceof InputEvent) ||  e.type !== 'input') return;
            if (this._formattedValue === this._input.innerText) return;

            const prefix = this._formatter.prefix(this._money.isNegative);
            const suffix = this._formatter.suffix(this._money.isNegative);
            const prefixPattern: RegExp = new RegExp('^' + esc(prefix));
            const suffixPattern: RegExp = new RegExp(esc(suffix) + '$');


            if (prefixPattern.test(this._input.innerText) && suffixPattern.test(this._input.innerText)) {

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

                const value = this._input.innerText.replace(prefixPattern,'').replace(suffixPattern,'');
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

            const oldCaretPos = this.getCaretPosition();
            const oldLength = this._input.innerText.length;
            const newLength = this._formattedValue.length;

            this._input.innerText = this._formattedValue;
            const newRange = document.createRange();
            if (typeof newRange !== 'undefined') {
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
                    newRange.setStart(<Node>this._input.firstChild, newCaretPos);
                    newRange.setEnd(<Node>this._input.firstChild, newCaretPos);
                } catch (e) {
                    newRange.setStart(<Node>this._input.firstChild, 0);
                    newRange.setEnd(<Node>this._input.firstChild, 0);
                }


                const selection = window.getSelection();
                selection?.removeAllRanges();
                selection?.addRange(newRange);

            }

        });

        this._container.appendChild(this._input);
    }


}
