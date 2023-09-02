import {IntlCurrencyInput} from "../src";
import {DisplayOrder} from "moneydew";

let elem = document.querySelector('#parent');
let input: IntlCurrencyInput;
if (elem) {
    input = new IntlCurrencyInput(<HTMLElement>elem, {
        currencyName: 'EUR',
        currencySymbol: '€',
        displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
        groupSeparator: ' ',
        decimalSeparator: ','
    }, '1234567.89');

    elem = document.querySelector('#parentTwo');
    if (elem) {
        input.remount(elem as HTMLElement);
        console.log('VALUE: ' + input.getValue());
        console.log('PARSED VALUE: ' + input.parse());
        input.format({
            currencySymbol: '$',
            currencyName: 'USD',
            displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            signSeparator: '',
            negativeSign: '-',
            positiveSign: '+'
        });
    }
}