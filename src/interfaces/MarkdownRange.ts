

/**
 * 単純なマイナスを含むint型の範囲を表します。
 */
export class MarkdownRange
{

	private static _empty:MarkdownRange = new MarkdownRange(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
	public readonly length: number;

	public static get empty():MarkdownRange
	{
		return this._empty;
	}

	public get isBack(): boolean
	{
		return this.begin > this.end;
	}

	public get isNext(): boolean
	{
		return this.end > this.begin;
	}

	public get isZero(): boolean
	{
		return this.length === 0;
	}

	public get isEmptyObject(): boolean
	{
		return MarkdownRange._empty === this;
	}


	public constructor(public readonly begin: number, public readonly end: number)
	{
		this.length = end - begin;
	}


	public static fromLength(begin: number, length: number): MarkdownRange
	{
		const end = begin + length;
		return new MarkdownRange(begin, end);
	}


	public internal(pos: number): boolean
	{
		return pos >= this.begin && pos < this.end;
	}

	public internalOrZero(pos: number): boolean
	{
		return pos >= this.begin && pos <= this.end;
	}

	public adjust(index: number): number
	{
		const min = Math.min(this.begin, this.end);
		const max = Math.max(this.begin, this.end);
		return Math.max(min, Math.min(max, index));
	}

	public toString()
	{
		return `(${this.begin}, ${this.end})`;
	}

}
