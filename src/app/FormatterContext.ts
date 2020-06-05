import { MarkdownTableConverter, MarkdownTableRenderMode, MarkdownTableFormatter, IMarkdownTableFormatter } from "../impls/MarkdownTableConverter";
import { ITableConverter } from "../interfaces/ITableConverter";
import { IFormatterContext } from "../interfaces/IFormatterContext";
import { IFormatterMethods } from "../interfaces/IFormatterMethods";

export abstract class FormatterContext implements IFormatterContext
{
	public abstract readonly methods: IFormatterMethods;
	public readonly formatter: IMarkdownTableFormatter = MarkdownTableFormatter.createInstance();
	public readonly renderer: ITableConverter<string> = new MarkdownTableConverter(MarkdownTableRenderMode.Beautiful);
}
