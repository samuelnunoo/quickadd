import {App, TextComponent} from "obsidian";
import GenericInputPrompt from "./GenericInputPrompt";

export class TextInputPrompt extends GenericInputPrompt<TextComponent> {
    static Prompt(app: App, header: string, placeholder?: string, value?: string): Promise<string> {
        const newPromptModal = new TextInputPrompt(app, header, placeholder, value);
        return newPromptModal.waitForClose;
    }

    protected createInputField(container: HTMLElement, placeholder?: string, value?: string): TextComponent {
        const textComponent = new TextComponent(container);

        this.setupInputComponent(textComponent, placeholder, value);

        return textComponent;
    }

    protected submitKeyPressed(evt: KeyboardEvent): boolean {
        return evt.key === "Enter";
    }

    protected customizeModal(modal: HTMLElement) {}
}