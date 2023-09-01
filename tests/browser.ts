import {IntlCurrencyInput} from "../src";
import {DisplayOrder} from "moneydew";

const elem = document.querySelector('#parent');
let input: IntlCurrencyInput;
if (elem !== null)
    input = new IntlCurrencyInput(<HTMLElement>elem, {
        currencyName: 'EUR',
        currencySymbol: '€',
        displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
        groupSeparator: ' ',
        decimalSeparator: ','
    }, '1234567.89');