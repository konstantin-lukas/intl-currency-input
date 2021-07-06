# intl-currency-input
This is a dependency-free easy-to-use vanilla JavaScript addon allowing you to create HTML currency inputs with various different currencies and formats. It doesn't require any additional markup or stylesheets.
## Usage
Download the intl-currency-input.min.js file and include it on your html page.
```html
<script src="path-to-file/intl-currency-input.min.js"></script>
```
To create a new currency input, first create a simple HTML text input.
```html
<input type="text" name="currency" placeholder="Insert mad bucks">
```
Create a new object from the `CurrencyInput` class. Make sure you do this *after* your HTML and intl-currency-input.min.js have loaded.
When creating a currency input you need to pass in your input element as the first parameter. It can be a direct reference to the element or a CSS query. As a second parameter you can pass in an optional `options` object.
```javascript
const input = 'input';
const options = {
    currency: 'EUR',
    locale: 'de'
    //Options can be partially or completely omitted.
}
const cinput = new CurrencyInput(input, options);
```
## Options
Options get passed in as an object. Each option is a property of the `options` object. Below you can find all of the options.
### `currency`
This is an ISO 4217 currency code `string`. It determines the currency symbol and name as well as how many decimal places to allow. By default this value is set to USD.
```javascript
currency: 'EUR' //This will give us euros instead of dollars.
```
### `locale`
This is a two character language locale `string` which can optionally be followed by a region separated with a hyphen. This automatically determines most of the formatting. The default value is 'en-US'. Sometimes adding a region can make a difference. For instance, 'zh-HK' returns 日圓 for the name of Japanese Yen whereas 'zh-CN' or just 'zh' would return 日元.
```javascript
locale: 'fr' //This will give us fancy French formatting and names: '1 000,99 yen japonais'.
```
### `currencyDisplay`
This `string` value determines how to display the currency. Possible values are 'symbol' (this is default), 'name', 'code', and 'none'. The position of the currency symbol or code is determined by the locale. The name is always display afterwards.
```javascript
currencyDisplay: 'name' //This will give us 'Euro' instead of '€'.
```
### `currencyDisplayFallback`
This works essentially the same way as currencyDisplay, but it is only used when currencyDisplay is set to 'symbol', but a symbol couldn't be found. Possible values are 'name', 'code', or 'none'.
```javascript
currencyDisplayFallback: 'name' //For 'DKK' there is no symbol, so we get: '99 Danish Krone'.
```
### `min`
This `number` represents the lowest value a user is allowed to enter. If you want to prevent input of negative number, set this value to 0. There is a hard limit here: -999999999999999 for 0 decimal place currencies, -9999999999999,99 for two decimal place currencies and -999999999999,999 for three decimal currencies. Avoid numbers smaller than that.
```javascript
min: -10 //-10 is still a valid value. Anything below that and further input would be prevented.
```
### `max`
This `number` represents the highest value a user is allowed to enter. This value has to be higher or equal to min. There is a hard limit here: 999999999999999 for 0 decimal place currencies, 9999999999999,99 for two decimal place currencies and 999999999999,999 for three decimal currencies. Avoid numbers bigger than that.
```javascript
max: 10 //10 is still a valid value. Anything beyond that and further input would be prevented.
```
### `defaultValue`
This is the `number` value to have inside the input by default. Make sure this value is within your min and max boundaries. If omitted the input will just stay empty on initialization.
```javascript
defaultValue: 0 //This would put 0 inside the input instead of showing the input placeholder.
```
### `separationCharacter`
This `string` is the character to be used for grouping larger numbers. The default for this value is determined by the locale. Use this property if you want to overwrite the default value. If you don't want to group larger numbers, use '' (an empty string) as value.
```javascript
separationCharacter: ' ' //This will turn 1,000,000 into 1 000 000.
```
### `decimalCharacter`
This character separates the decimal places. The default for this value is determined by the locale. Use this property if you want to overwrite the default value. For currencies like the Korean Won this value is redundant as there are no decimal numbers i.e. no minor units. Make sure you pick a symbol that is different from the separation character.
```javascript
decimalCharacter: ',' //This will turn 99.99 into 99,99.
```
### `disableCents`
This is a `boolean` value which is set to false by default. If set to true it will prevent the user from inputting decimal numbers.
You don't need to explicitly set this value for languages like Japanese Yen which don't have minor units. The amount of decimal places is automatically determined.
```javascript
disableCents: true //This will prevent the user from inputting 99,99 put allow 99.
```
### `preventInputFromIME`
This is a `boolean` value which is set to true by default. This prevents input method editors (e.g. for the Japanese language) to make any potentially bad input. If you don't know what this is, better leave it as default.
```javascript
preventInputFromIME: false //This will allow all kinds of crazy input like 'お金大好き♡'.
```

### `validCallback`
This is a `function` to call when the user makes a correct input.
```javascript
validCallback: function () { //This will execute whenever the user makes a correct input.
    console.log('That\'s a valid input.');
}
```

### `invalidCallback`
This is a `function` to call when the user makes an incorrect input.
```javascript
invalidCallback: function () { //This will execute for instance when trying to enter a letter.
    console.log('That\'s not a valid input.');
}
```
## Methods
### `getValueAsString()`
This method will get you whatever is currently visible inside the input.
```javascript
cinput.getValueAsString(); // returns a string value like '$99.99'
```
### `getValueAsFloat()`
This method will parse the current input value and give you a float.
```javascript
cinput.getValueAsFloat(); // returns a number value like 99.99
```
### `getValueAsInt()`
This method will parse the current input value into the minor unit (i.e. cents) and return an integer. This is very useful if you are doing calculations with this value.
```javascript
cinput.getValueAsInt(); // returns an integer value like 9999
```
### `reinit(options)`
Use this function if you need to change any of the settings. This takes an `options` object as an optional parameter just like the constructor method. If you omit the `options`, everything will be set to default. In case you need to change the html target element, just create a new instance of `CurrencyInput`.
```javascript
cinput.reinit({ //This would display '10,000 日本円' by default.
    currency: 'JPY',
    locale: 'ja',
    currencyDisplay: 'name',
    defaultValue: 10000
});
```
