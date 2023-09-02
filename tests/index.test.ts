import { fireEvent } from '@testing-library/dom';
import { IntlCurrencyInput } from "../src";
describe('CurrencyInput', () => {

    let container: HTMLElement;
    let input: IntlCurrencyInput;
    let inputElement: HTMLElement;
    beforeEach(() => {
        // Create a container div and append it to the document body
        document.body.innerHTML =
            '<!-- index.html -->\n' +
            '<!DOCTYPE html>\n' +
            '<html lang="en">\n' +
            '<head>\n' +
            '    <meta charset="UTF-8">\n' +
            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
            '    <title>Custom Input Test</title>\n' +
            '</head>\n' +
            '<body>\n' +
            '<div id="parent"></div>\n' +
            '</body>\n' +
            '</html>\n';
        container = document.querySelector('#parent') as HTMLElement;
        input = new IntlCurrencyInput(container, {});
        inputElement = container.querySelector('span') as HTMLElement;
    });

    afterEach(() => {
        // Clean up after each test by removing the container
        document.body.removeChild(container);
    });

    test('CurrencyInput should format and update the value', async () => {
        expect(inputElement.innerText).toBe('$0.00');
        const selection = window.getSelection() as Selection;
        const range = document.createRange();
        range.setStart(inputElement.firstChild as Node, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        inputElement.innerText = '$2.00';
        fireEvent.input(inputElement, {});
        expect(inputElement.innerText).toBe('$2.00');

        inputElement.innerText = '$2000.00';
        fireEvent.input(inputElement, {});
        expect(inputElement.innerText).toBe('$2,000.00');

        inputElement.innerText = '$200a0.00';
        fireEvent.input(inputElement, {});
        expect(inputElement.innerText).toBe('$2,000.00');

        inputElement.innerText = 'd$2,000.00';
        fireEvent.input(inputElement, {});
        expect(inputElement.innerText).toBe('$2,000.00');


    });
});
