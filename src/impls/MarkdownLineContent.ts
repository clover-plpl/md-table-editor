
import { MarkdownContentBase } from "../interfaces/MarkdownContentBase";

export class MarkdownLineContent extends MarkdownContentBase
{
	public constructor(public readonly text: string)
	{
		super();
	}


	public toString(): string
	{
		return this.text;
	}

}
