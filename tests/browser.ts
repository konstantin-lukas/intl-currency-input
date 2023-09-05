import IntlCurrencyInput from "../src";
import {DisplayOrder} from "moneydew";

let elem = document.querySelector('#parent input');
let input = new IntlCurrencyInput(elem as HTMLInputElement, '1234567.89', {
    currencyName: 'EUR',
    currencySymbol: '€',
    displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
    groupSeparator: ' ',
    decimalSeparator: ','
});