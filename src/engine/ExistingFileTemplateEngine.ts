import {TemplateEngine} from "./TemplateEngine";
import type ITemplateChoice from "../types/choices/ITemplateChoice";
import type {TFile} from "obsidian";
import QuickAdd from "../main";
import type {IChoiceExecutor} from "../IChoiceExecutor";

export class ExistingFileTemplateEngine extends TemplateEngine {
    private choice: ITemplateChoice;
    private readonly file: TFile;

    constructor(choice: ITemplateChoice, file: TFile, choiceExecutor: IChoiceExecutor) {
        super(QuickAdd.instance.app, QuickAdd.instance, choiceExecutor);

        this.choice = choice;
        this.file = file;
    }

    public async run(): Promise<void> {
        this.formatter.setValue(this.file.basename);
        await this.overwriteFileWithTemplate(this.file, this.choice.templatePath);
    }
}