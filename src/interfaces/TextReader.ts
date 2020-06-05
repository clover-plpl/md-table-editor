import { IRollbackable } from "./IRollbackable";
import { ITextSource } from "./ITextSource";


export class TextReader
{
	
	private _textSource: ITextSource;
	private _position: number = -1;

	public get position(): number
	{
		return this._position;
	}

	public get current(): string
	{
		return this._textSource.lineAt(this._position);
	}

	public constructor(textSource: ITextSource)
	{
		this._textSource = textSource;
	}


	/**
	 * positionをインクリメントします。
	 * ただし、終点を超えることはない点に注意してください。
	 */
	public moveNext(): boolean
	{

		// 外側は、_textSourceからlengthが取得できないための処置。
		if (this._textSource.hasLine(this._position) || this.position === -1)
		{
			this._position++;
			return this._textSource.hasLine(this._position);
		}
		
		return false;
	}


	/**
	 * positionをデクリメントします。
	 * ただし、始点(-1)未満には移動しない点に注意してください。
	 */
	public moveBack(): boolean
	{
		this._position = Math.max(-1, this._position - 1);
		return this._textSource.hasLine(this._position);
	}


	public copy(): TextReader
	{
		const tr = new TextReader(this._textSource);
		tr._position = this._position;
		return tr;
	}

	public copyBackMode(): TextReader
	{
		const tr = this.copy();
		tr.moveNext();
		return tr;
	}

	public copyNextMode(): TextReader
	{
		const tr = this.copy();
		tr.moveBack();
		return tr;
	}


	/**
	 * positionを指定した位置までまで移動します。
	 * 移動先が終点でない有効範囲内であればtrueを返します。
	 * falseが返る状況にない場合でもpositionはリセットされません。
	 * saveSeek(position)かITrackbackableからリセットしてください。
	 */
	public seek(position: number): boolean
	{
		// positionに到達するまで、moveNext()が真であり続ける限りmoveNext()する。(終点を超えてのmoveNext()は無効になるため)
		while (this._position < position && this.moveNext());

		while (this._position > position && this.moveBack());

		return position === this._position && this.hasCurrent();
	}


	public safeSeek(position: number): boolean
	{
		const tr = this.createRollbackable();
		if (this.seek(position))
		{
			return true;
		}
		tr.rollback();
		return false;
	}

	public freeSeek(position: number) : TextReader
	{
		this.seek(position);
		return this;
	}

	public atPosition(position: number): boolean
	{
		return position === this._position && this.hasCurrent();
	}


	public hasCurrent(): boolean
	{
		return this._textSource.hasLine(this._position);
	}


	/**
	 * moveNext()された後のcurrentをコールバックから取得します。
	 */
	public static lx<TResult>(textReader: TextReader, callback: (line: string) => TResult)
		: TResult | null
	{
		if (textReader.moveNext())
		{
			let line = textReader.current;
			return callback(line);
		}
		return null;
	}



	public createRollbackable(): IRollbackable
	{
		let position = this._position;

		return {
			rollback: () =>
			{
				this._position = position;
			}
		};
	}

	public getText(begin: number, end: number): Array<string>
	{
		const arr: Array<string> = [];
		const tr = this.copy().freeSeek(begin).copyNextMode();
		while (tr.moveNext() && tr.position < end)
		{
			arr.push(tr.current);
		}
		return arr;
	}
}