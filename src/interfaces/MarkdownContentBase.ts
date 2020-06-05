import { IMarkdownContent } from "./IMarkdownContent";
import { MarkdownRange } from "./MarkdownRange";

export class MarkdownContentBase implements IMarkdownContent
{
	private _range: MarkdownRange = MarkdownRange.empty;

	public get range(): MarkdownRange
	{
		return this._range;
	}

	public get lineLength(): number
	{
		return this._range.length;
	}

	public decision(range: MarkdownRange): void
	{
		this._range = range;
	}

	public documentIndexFromContentIndex(contentIndex: number): number
	{
		return contentIndex + this._range.begin;
	}

	public contentIndexFromDocumentIndex(documentIndex: number): number
	{
		return documentIndex - this._range.begin;
	}

	public isContentIndex(contentIndex: number): boolean
	{
		return new MarkdownRange(0, this.lineLength).internal(contentIndex);
	}


}