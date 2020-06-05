
import { IMarkdownContentParser } from "../interfaces/IMarkdownContentParser";
import { MarkdownLineContent } from "./MarkdownLineContent";
import { TextReader } from "../interfaces/TextReader";

export class MarkdownLineParser implements IMarkdownContentParser<MarkdownLineContent>
{

	parse(textReader: TextReader): MarkdownLineContent | undefined
	{
		if (textReader.moveNext())
		{
			return new MarkdownLineContent(textReader.current);
		}
		
	}

	adjust(textReader: TextReader): void
	{

	}
	
}
