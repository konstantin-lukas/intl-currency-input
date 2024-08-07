# International Currency Input

<div align="center">

[![NPM Package](https://img.shields.io/npm/v/intl-currency-input?style=flat-square&logo=npm)](https://www.npmjs.com/package/intl-currency-input)
![NPM Downloads](https://img.shields.io/npm/dm/intl-currency-input?style=flat-square)
![Code Coverage](https://img.shields.io/coverallsCoverage/github/konstantin-lukas/intl-currency-input?style=flat-square)
[![MIT License](https://img.shields.io/github/license/konstantin-lukas/intl-currency-input?style=flat-square)](https://raw.githubusercontent.com/konstantin-lukas/intl-currency-input/main/LICENSE)
![Type Definitions](https://img.shields.io/npm/types/intl-currency-input?style=flat-square)
![Bundle Size](https://img.shields.io/bundlephobia/min/intl-currency-input?style=flat-square)
</div>

This library provides a class that can mount to a text input and control that input to only
accept validly formatted currency strings. This library is based on the 
[Moneydew](https://github.com/konstantin-lukas/moneydew) formatting library for currencies. Please note that version
2.X.X has been completely overhauled. Try to avoid using version 1.X.X. To try the library, 
check out this  [CodePen](https://codepen.io/konstantin-lukas/pen/oNWzwOP).
The [documentation](https://konstantin-lukas.github.io/intl-currency-input/) is easily accessible on GitHub Pages.

## Quickstart
Note: If you are using React, refer to the section at the bottom for a React-specific quickstart guide.

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

export default function CurrencyInput({value, setValue}: {
    value: string,
    setValue: (value: string) => void
}) {
    const currencyInputElement = useRef<HTMLInputElement | null>(null);
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);
    const [valueState, setValueState] = useState(value);

    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && !currencyInput) {
            const newInput = new IntlCurrencyInput(input, value, {
                currencyName: 'EUR',
                currencySymbol: '€',
                groupSeparator: ' ',
                decimalSeparator: ',',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            });
            newInput.enableStrictMode();
            newInput.validCallback(() => setValueState(newInput.getValue()));
            setCurrencyInput(newInput);
            return () => {
                newInput.unmount();
            }
        }

    }, []);
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && currencyInput)
            currencyInput.remount(input);
    }, [currencyInputElement]);
    useEffect(() => {
        setValue(valueState);
    }, [valueState]);
    useEffect(() => {
        if (currencyInput && valueState !== value) {
            currencyInput.setValue(value);
        }
    }, [value]);
    return (
        <input ref={currencyInputElement} name="amount"/>
    );
}
```
