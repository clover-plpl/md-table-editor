import { MarkdownRange } from "./MarkdownRange";
import { ISelection } from "./ISelection";

export interface IFormatterMethods
{
	select(...selections: ISelection[]): void;
	replace(range: MarkdownRange, txt: string): void;
}
