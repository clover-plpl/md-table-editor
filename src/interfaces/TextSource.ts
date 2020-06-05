import { ITextSource } from "./ITextSource";

export class TextSource implements ITextSource
{

	private _lines: ReadonlyArray<string>;

	public constructor(str: string)
	{
		this._lines = str.split(/\r\n|\n|\r/);
	}

	public lineAt(index: number): string
	{
		return this._lines[index];
	}

	public hasLine(index: number): boolean
	{
		return index >= 0 && index < this._lines.length;
	}

}