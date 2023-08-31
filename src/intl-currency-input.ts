import {Money} from "moneydew/dist/money";
import {MoneyFormatter} from "moneydew/dist/money_formatter";

export class IntlCurrencyInput {
    private _container: HTMLElement;
    private _input: HTMLElement;
    private _money: Money;
    private _previousValue: string;
    private _formatter: MoneyFormatter;

    constructor(containerElement : HTMLElement) {
        this._money = new Money('0.00');
        this._formatter = new MoneyFormatter({
            currencyName: 'USD'
        });
        this._previousValue = this._formatter.format(this._money);

        this._container = containerElement;

        this._input = document.createElement('span');
        this._input.classList.add('ici-input');
        this._input.innerText = this._formatter.format(this._money);
        this._input.contentEditable = 'true';
        this._input.style.outline = 'none';
        this._input.setAttribute('spellcheck', 'false');

        const esc = (string: string) => {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

        this._input.addEventListener('input', (e: Event) => {
            if (!(e instanceof InputEvent) ||  e.type !== 'input') return;
            let string: string = '^';
            string += esc(this._formatter.prefix(this._money.isNegative));
            string += '(0|';
            string += '0'+ esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '}|';
            string += '[1-9]\\d*|';
            string += '[1-9]\\d*' + esc(this._formatter.decimalSeparator) + '\\d{0,' + this._money.floatingPointPrecision + '})';
            string += esc(this._formatter.suffix(this._money.isNegative));
            string += '$';
            const regex = new RegExp(string);
            if (regex.test(this._input.innerText))
                this._previousValue = this._input.innerText;
            else {
                const oldRange = window.getSelection()?.getRangeAt(0);
                const caretPos = typeof oldRange === 'undefined' ? 0 : oldRange.startOffset - 1;

                this._input.innerText = this._previousValue;
                const newRange = document.createRange();
                if (typeof newRange !== 'undefined' && e.inputType !== 'deleteContentBackward') {
                    newRange.setStart(<Node>this._input.firstChild, caretPos);
                    newRange.setEnd(<Node>this._input.firstChild, caretPos);
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(newRange);
                }
            }

        })

        this._container.appendChild(this._input);
    }


}
