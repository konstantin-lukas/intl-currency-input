# International Currency Input
This library provides a class that can mount to a text input and control that input to only
accept validly formatted currency strings. This library is based on the 
[Moneydew](https://github.com/konstantin-lukas/moneydew) formatting library for currencies. Please note that version
2.X.X has been completely overhauled. Try to avoid using version 1.X.X. To try the library, 
check out the following CodePen:

<font size="20" >[**Demo**](https://codepen.io/konstantin-lukas/pen/oNWzwOP)</font>

<span style="color: red">If you are using React, please read the section at the bottom about using this library with React first.</span>
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

## Using This Library With React
When you are developing in React's strict mode you might encounter some unexpected behaviour, specifically when using
the input's strict mode (which has nothing to do with React's strict mode; they are just named the same). This happens
when you mount multiple `IntlCurrencyInputs` to the same `HTMLInputElement`. In React's strict mode, all effects get called
twice to help you find bugs. This is just a reminder that you need to `unmount` the old currency input first or use
`remout`. Below is an example of how to use this Library in React. Feel free to just copy the below code if you are using
React.

```tsx
import React, {useEffect, useRef, useState} from "react";
import IntlCurrencyInput from "intl-currency-input";
import {DisplayOrder} from "moneydew";

export default function CurrencyInput() {
    /**
     * @description This is a reference we pass to our component for mounting
     */
    const currencyInputElement = useRef<HTMLInputElement | null>(null);

    /**
     * @description This state contains our IntlCurrencyInput
     */
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);


    let mounted = false; // See footnote
    
    // Create new currency input
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && !currencyInput && !mounted) {
            mounted = true;
            const newInput = new IntlCurrencyInput(input, '0.00', {
                currencyName: 'EUR',
                currencySymbol: '€',
                groupSeparator: ' ',
                decimalSeparator: ',',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            });
            setCurrencyInput(newInput);
        }
    }, []);
    
    // Remount if the currency element changes
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && currencyInput)
            currencyInput.remount(input);
    }, [currencyInputElement]);
    
    return <Input ref={currencyInputElement} name="amount"/>;
}
```
Footnote: In React's strict mode `useEffect` gets called twice and because React's state updates are asynchronous,
it would create two IntlCurrencyInputs mounted to the same element. The reason for that is that both times `useEffect`
gets called while `currencyInput` is still `null` as there is no guarantee that `setCurrencyInput` is executed
immediately. Updating the `mounted` variable however happens immediately and helps us tell useEffect has been called already.
I would recommend keeping the `mounted` variable even in production if you decide to do it this way because it's only
a single boolean and surely won't hurt performance.