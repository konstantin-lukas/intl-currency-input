import {IntlCurrencyInput} from "../src";
import {DisplayOrder} from "moneydew";

let elem = document.querySelector('#parent input');
let input: IntlCurrencyInput;
if (elem) {
    input = new IntlCurrencyInput(elem as HTMLInputElement, '1234567.89', {
        currencyName: 'EUR',
        currencySymbol: '€',
        displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
        groupSeparator: ' ',
        decimalSeparator: ','
    });

    elem = document.querySelector('#parentTwo input');
    if (elem) {
        input.remount(elem as HTMLInputElement);
        console.log('VALUE: ' + input.getFormattedValue());
        console.log('PARSED VALUE: ' + input.getValue());
        input.format({
            displayOrder: DisplayOrder.SYMBOL_SIGN_NUMBER_NAME,
            positiveSign: '',
            negativeSign: '-'
        });
        document.getElementById('clicky')?.addEventListener('click', () => {
            input.enableStrictMode();
        });
        document.getElementById('yeah')?.addEventListener('click', () => {
            input.disableStrictMode();
        });
    }
}