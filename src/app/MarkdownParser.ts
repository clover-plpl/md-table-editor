import { IMarkdownContent } from "../interfaces/IMarkdownContent";
import { IMarkdownContentParser } from "../interfaces/IMarkdownContentParser";
import { TextReader } from "../interfaces/TextReader";
import { MarkdownLineParser } from "../impls/MarkdownLineParser";
import { MarkdownTableParser } from "../impls/MarkdownTableParser";
import { ITextSource } from "../interfaces/ITextSource";
import { MarkdownRange } from "../interfaces/MarkdownRange";

export class MarkdownParser
{
	public readonly parsers: ReadonlyArray<IMarkdownContentParser<IMarkdownContent>>;

	private readonly defaultLineParser: MarkdownLineParser;


	public constructor()
	{
		this.parsers = this.createParsers();
		this.defaultLineParser = this.createDefaultLineParser();
	}

	protected createParsers(): Array<IMarkdownContentParser<IMarkdownContent>>
	{
		return [
			new MarkdownTableParser()
		];
	}


	protected createDefaultLineParser(): MarkdownLineParser
	{
		return new MarkdownLineParser();
	}


	protected createTextReader(textSource: ITextSource): TextReader
	{
		return new TextReader(textSource);
	}


	public *parse(textSource: ITextSource): IterableIterator<IMarkdownContent>
	{
		let result: IMarkdownContent | undefined;
		const textReader = this.createTextReader(textSource);

		while (result = this.nextParse(textReader))
		{
			yield result;
		}
	}

	private nextParse(textReader: TextReader): IMarkdownContent | undefined
	{

		for (let reader of [...this.parsers, this.defaultLineParser])
		{
			const rb = textReader.createRollbackable();
			const rf = TextReaderHelper.createRangeFactory(textReader);
			

			// 解析
			const result = reader.parse(textReader);

			if (result)
			{
				reader.adjust(textReader);
				const range = rf.create(1);


				if (range.isNext)
				{
					result.decision(range);
					return result;
				}
			}

			rb.rollback();
		}
		
	}


	public findContent(textSource: ITextSource, line: number): IMarkdownContent | null
	{
		for (let content of this.parse(textSource))
		{
			if (content.range.internal(line))
			{
				return content;
			}
		}

		return null;
	}


	public *findContents(textSource: ITextSource, lines: Array<number>): IterableIterator<IMarkdownContent>
	{
		for (let content of this.parse(textSource))
		{
			if (lines.findIndex(t => content.range.internal(t)) !== -1)
			{
				yield content;
			}
		}
	}



}
export interface IRangeFactory
{
	create(s?: number): MarkdownRange;
}

export class TextReaderHelper
{

	public static createRangeFactory(textReader: TextReader): IRangeFactory
	{

		const beginPosition = textReader.position;

		return {
			create(s: number = 0)
			{
				return new MarkdownRange(beginPosition + s, textReader.position + s);
			}
		};
	}
}
