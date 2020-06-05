import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { ICommandParameter } from "./ICommandParameter";

export interface ITableCommandParameter extends ICommandParameter
{
	table: MarkdownTableContent;
	docIndex: number;
	charIndex: number;
}
