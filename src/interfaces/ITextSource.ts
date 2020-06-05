

export interface ITextSource
{
	lineAt(index: number): string;
	hasLine(index: number): boolean;
}

