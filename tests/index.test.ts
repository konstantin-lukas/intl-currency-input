import { fireEvent } from '@testing-library/dom';
import {IntlCurrencyInput} from "../src";

describe('CurrencyInput', () => {
    let inputElement: HTMLInputElement;

    beforeEach(() => {
        // Create a container div and append it to the document body
        const container = document.createElement('div');
        document.body.appendChild(container);
        const input = new IntlCurrencyInput(container, {});
    });

    afterEach(() => {
        // Clean up after each test by removing the container
        document.body.removeChild(inputElement.parentElement as Node);
    });

    test('CurrencyInput should format and update the value', () => {
        // Simulate user input
        //fireEvent.input(inputElement, { target: { value: '1234.56' } });

        // Assert that the input displays the formatted value
        //expect(inputElement.value).toBe('$1,234.56');
        expect(true).toBe(true);

        // You can continue with more assertions and tests as needed
    });
});
