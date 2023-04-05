export class IntlCurrencyInput {
    private _parentElement : HTMLElement;
    private _containerElement : HTMLElement;
    private _precedingElement : HTMLElement;
    private _inputElement : HTMLElement;
    private _succeedingElement : HTMLElement;
    constructor(parentElement : HTMLElement) {

        this._parentElement = parentElement;

        this._containerElement = document.createElement('div');

        this._precedingElement = document.createElement('span');
        this._precedingElement.innerText = '$';

        this._inputElement = document.createElement('span');
        this._inputElement.contentEditable = 'true';
        this._inputElement.style.outline = '0px solid transparent';
        this._inputElement.addEventListener('keydown', this.sanitizeInput.bind(this));
        this._inputElement.addEventListener('cut', this.sanitizeInput.bind(this));
        this._inputElement.addEventListener('paste', this.sanitizeInput.bind(this));
        this._inputElement.addEventListener('compositionend', this.sanitizeInput.bind(this));
        this._inputElement.addEventListener('drop', this.sanitizeInput.bind(this));

        this._succeedingElement = document.createElement('span');
        this._succeedingElement.innerText = ' USD';

        this._containerElement.appendChild(this._precedingElement);
        this._containerElement.appendChild(this._inputElement);
        this._containerElement.appendChild(this._succeedingElement);
        this._parentElement.appendChild(this._containerElement);

        this._inputElement.innerText = '0.00';
    }
    private sanitizeInput(event : Event) : void {
        event.preventDefault();
        if (!(event.target instanceof HTMLSpanElement) || event.target.contentEditable !== 'true') return;
        const selection = window.getSelection();
        const selectionStart = selection?.getRangeAt(0).startOffset;
        const selectionEnd = selection?.getRangeAt(0).endOffset;
        if (event instanceof KeyboardEvent) {
            if (event.type === 'keydown') {
                if (selection?.anchorNode?.parentNode === event.target) {
                    this._inputElement.innerText =
                        event.target.innerText.slice(0,selectionStart) +
                        event.key +
                        event.target.innerText.slice(selectionEnd,event.target.innerText.length);

                    const range = document.createRange();
                    if (event.target.firstChild !== null &&
                        event.target.lastChild !== null &&
                        selectionStart !== undefined &&
                        selectionEnd !== undefined) {
                        range.setStart(event.target.firstChild, selectionStart + 1);
                        range.setEnd(event.target.lastChild, selectionStart + 1);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        }
    }
}
