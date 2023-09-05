# International Currency Input
This library provides a class that can mount to a text input and control that input to only
accept validly formatted currency strings. This library is based on the 
[Moneydew](https://github.com/konstantin-lukas/moneydew) formatting library for currencies. Please note that version
2.X.X has been completely overhauled. Try to avoid using version 1.X.X. To try the library, 
check out the following CodePen:

<font size="20" >[**Demo**](https://codepen.io/konstantin-lukas/pen/oNWzwOP)</font>
## Quickstart
First install the package:
```
npm i -P intl-currency-input
```
Then you can include the library inside your project. Please note that this library only has a default export.
If you're missing types somewhere you might have to import those from moneydew.
```typescript
import IntlCurrencyInput from "IntlCurrencyInput";
import {DisplayOrder} from "moneydew";

let elem = document.querySelector('input[type=text]');
let input = new IntlCurrencyInput(elem as HTMLInputElement, '1234567.89', {
    currencyName: 'EUR',
    currencySymbol: '€',
    displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
    groupSeparator: ' ',
    decimalSeparator: ','
});
```
When initializing the input you have to pass 1-3 parameters (the 2nd and 3rd are optional). The first parameter is the
HTMLInputElement to mount to. This input element should be of `type="text"`.

The second parameter determines the default value.
This value should follow the following format: `^-?(0|[1-9]\d*)(\.\d+)?$`. The amount of decimal places this initial value has
implicitly determines how many decimal places will be shown in the input field.

The third parameter determines how the input is formatted. For more details please refer to the 
[Moneydew documentation](https://github.com/konstantin-lukas/moneydew/tree/main/docs). Below you can find the type definition for formats from the moneydew documentation minus the properties that are not used by this library.
```typescript
export type FormatterInitializer = {
    currencySymbol?: string;
    symbolSeparator?: string;
    currencyName?: string;
    nameSeparator?: string;
    positiveSign?: string;
    negativeSign?: string;
    signSeparator?: string;
    displayOrder?: DisplayOrder;
    decimalSeparator?: string;
    groupSeparator?: string;
    groupSize?: number;
};
```
An input initialized like in the first example would display the following default value:
```
EUR 1 234 567,89€
```
For detailed information on functionality please refer to this repo's documentation.