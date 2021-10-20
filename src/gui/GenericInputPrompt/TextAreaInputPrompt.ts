import {App, TextAreaComponent} from "obsidian";
import GenericInputPrompt from "./GenericInputPrompt";

export class TextAreaInputPrompt extends GenericInputPrompt<TextAreaComponent> {
    static Prompt(app: App, header: string, placeholder: string | undefined, value: string | undefined): Promise<string> {
        const modal = new TextAreaInputPrompt(app, header, placeholder, value);
        return modal.waitForClose;
    }

    protected createInputField(container: HTMLElement, placeholder: string | undefined, value: string | undefined): TextAreaComponent {
        const textComponent = new TextAreaComponent(container);

        this.setupInputComponent(textComponent, placeholder, value);
        textComponent.inputEl.style.height = "30rem";

        return textComponent;
    }

    protected submitKeyPressed(evt: KeyboardEvent): boolean {
        return evt.ctrlKey && evt.key === "Enter";
    }

    protected customizeModal(modal: HTMLElement) {
        modal.style.width = "100%"
    }
}