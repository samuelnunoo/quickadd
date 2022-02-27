import type IChoice from "./types/choices/IChoice";
import type {partialChoice} from "./choiceExecutor";

export interface IChoiceExecutor {
    execute(choice: IChoice,override?:partialChoice): Promise<void>;
    variables: Map<string, string>;
}