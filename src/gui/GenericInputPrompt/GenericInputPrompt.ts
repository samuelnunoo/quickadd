import {App, ButtonComponent, Modal, TextAreaComponent, TextComponent,} from "obsidian";
import {SilentFileAndTagSuggester} from "../silentFileAndTagSuggester";

export default abstract class GenericInputPrompt<InputComponent extends (TextComponent | TextAreaComponent)> extends Modal {
    public waitForClose: Promise<string>;

    protected input: string;
    protected inputComponent: InputComponent;

    private resolvePromise: (input: string) => void;
    private rejectPromise: (reason?: any) => void;
    private didSubmit: boolean = false;
    private readonly placeholder: string;
    private suggester: SilentFileAndTagSuggester;

    protected constructor(app: App, private header: string, placeholder?: string, value?: string) {
        super(app);
        this.placeholder = placeholder;
        this.input = value;

        this.waitForClose = new Promise<string>(
            (resolve, reject) => {
                this.resolvePromise = resolve;
                this.rejectPromise = reject;
            }
        );

        this.display();
        this.open();

        this.suggester = new SilentFileAndTagSuggester(app, this.inputComponent.inputEl);
    }

    private display() {
        this.contentEl.empty();
        this.customizeModal(this.modalEl);
        this.titleEl.textContent = this.header;

        const mainContentContainer: HTMLDivElement = this.contentEl.createDiv();
        this.inputComponent = this.createInputField(mainContentContainer, this.placeholder, this.input);
        this.createButtonBar(mainContentContainer);
    }

    protected abstract createInputField(container: HTMLElement, placeholder?: string, value?: string): InputComponent;

    protected abstract submitKeyPressed(evt: KeyboardEvent);

    protected abstract customizeModal(modal: HTMLElement);

    protected submitEnterCallback(evt: KeyboardEvent) {
        if (this.submitKeyPressed(evt)) {
            evt.preventDefault();
            this.submit();
        }
    }

    protected submitClickCallback = (evt: MouseEvent) => this.submit();
    protected cancelClickCallback = (evt: MouseEvent) => this.cancel();

    protected submit() {
        this.didSubmit = true;

        this.close();
    }

    protected cancel() {
        this.close();
    }

    protected setupInputComponent(textComponent: InputComponent, placeholder: string, value: string) {
        textComponent.inputEl.style.width = "100%";
        textComponent.setPlaceholder(placeholder ?? "")
            .setValue(value ?? "")
            .onChange(value => this.input = value)
            .inputEl.addEventListener('keydown', this.submitEnterCallback.bind(this));
    }

    private createButton(container: HTMLElement, text: string, callback: (evt: MouseEvent) => any) {
        const btn = new ButtonComponent(container);
        btn.setButtonText(text)
            .onClick(callback);

        return btn;
    }

    private createButtonBar(mainContentContainer: HTMLDivElement) {
        const buttonBarContainer: HTMLDivElement = mainContentContainer.createDiv();
        this.createButton(buttonBarContainer, "Ok", this.submitClickCallback)
            .setCta().buttonEl.style.marginRight = '0';
        this.createButton(buttonBarContainer, "Cancel", this.cancelClickCallback);

        buttonBarContainer.style.display = 'flex';
        buttonBarContainer.style.flexDirection = 'row-reverse';
        buttonBarContainer.style.justifyContent = 'flex-start';
        buttonBarContainer.style.marginTop = '1rem';
    }

    private resolveInput() {
        if(!this.didSubmit) this.rejectPromise("No input given.");
        else this.resolvePromise(this.input);
    }

    private removeInputListener() {
        this.inputComponent.inputEl.removeEventListener('keydown', this.submitEnterCallback)
    }

    onOpen() {
        super.onOpen();

        this.inputComponent.inputEl.focus();
        this.inputComponent.inputEl.select();
    }

    onClose() {
        super.onClose();
        this.resolveInput();
        this.removeInputListener();
    }
}

