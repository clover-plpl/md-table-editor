import { IMarkdownTableFormatter } from "../impls/MarkdownTableConverter";
import { ITableConverter } from "./ITableConverter";
import { IFormatterMethods } from "./IFormatterMethods";

export interface IFormatterContext
{
	readonly formatter: IMarkdownTableFormatter;
	readonly renderer: ITableConverter<string>;
	readonly methods: IFormatterMethods;
}

