import { IMarkdownContentParser } from "../interfaces/IMarkdownContentParser";
import { MarkdownTableContent, MarkdownTableRows, MarkdownTableAlignments } from "./MarkdownTableContent";
import { TextReader } from "../interfaces/TextReader";

export class MarkdownTableParser implements IMarkdownContentParser<MarkdownTableContent>
{
	public parse(textReader: TextReader): MarkdownTableContent | undefined
	{
		if (textReader.moveNext())
		{
			const header = MarkdownTableRows.createInstance(textReader.current);

			if (header && textReader.moveNext())
			{
				const alignment = MarkdownTableAlignments.createInstance(textReader.current);


				if (alignment && (header.cells.length <= alignment.cells.length))
				{
					const rows = [...this.getRow(textReader, header.cells.length)];

					return new MarkdownTableContent(header, alignment, rows);

				}

			}
		}

	}

	public adjust(textReader: TextReader): void
	{
		textReader.moveBack();
	}





	private *getRow(textReader: TextReader, limit: number): IterableIterator<MarkdownTableRows>
	{
		while (textReader.moveNext())
		{
			const row = MarkdownTableRows.createInstance(textReader.current, limit);
			if (!row)
			{
				break;
			}
			yield row;

		}
	}

}



