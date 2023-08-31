import {IntlCurrencyInput} from "./index";
const elem = document.querySelector('#parent');
let input: IntlCurrencyInput;
if (elem)
    input = new IntlCurrencyInput(<HTMLElement>elem);