import { MarkdownContentBase } from "../interfaces/MarkdownContentBase";
import { MarkdownRange } from "../interfaces/MarkdownRange";
import { MarkdownAlignments } from "../interfaces/MarkdownAlignments";
import { Direction } from "../interfaces/Direction";
import { IDocumentPosition } from "../interfaces/IDocumentPosition";
import { TablePosition } from "../interfaces/TablePosition";
import { StringCounter } from "../StringCounter";
import { ISelection } from "../interfaces/ISelection";
import { IStringCounter } from "../interfaces/IStringCounter";




export class TablePositionDirections
{
	public static readonly top: TablePosition = new TablePosition(-1, 0);
	public static readonly bottom: TablePosition =  new TablePosition(1, 0);
	public static readonly left: TablePosition = new TablePosition(0, -1);
	public static readonly right: TablePosition = new TablePosition(0, 1);

	public static readonly before: number = 0;
	public static readonly after: number = 1;

	public static getPositionFromDirection(direction: Direction): TablePosition
	{
		switch (direction)
		{
			case Direction.Top: return this.top;
			case Direction.Bottom: return this.bottom;
			case Direction.Right: return this.right;
			case Direction.Left: return this.left;
		}
	}

}





export interface ICellResult
{
	readonly row: MarkdownTableRows;
	readonly cell: TableCell;
}


export class MarkdownTableContent extends MarkdownContentBase
{

	public get columnLength(): number
	{
		return this.headers.cellLength;
	}

	public get rowLength(): number
	{
		return this.rows.length;
	}

	public get tableRowLength(): number
	{
		return this.rows.length + 2;
	}

	public *[Symbol.iterator]()
	{
		yield this.headers;
		yield this.alignments;
		yield* this.rows;
	}


	public constructor(
		public readonly headers: MarkdownTableRows,
		public readonly alignments: MarkdownTableAlignments,
		public readonly rows: Array<MarkdownTableRows>)
	{
		super();
	}


	/**
	 * ヘッダを含まない行であるかをチェックします。
	 * @param rowIndex 
	 */
	public isRow(rowIndex: number): boolean
	{
		return rowIndex >= 0 && this.isTableRow(rowIndex);
	}

	/**
	 * ヘッダ含む行であるかをチェックします。
	 * @param tableRowIndex -2からrowLength未満の値。
	 */
	public isTableRow(tableRowIndex: number): boolean
	{
		return new MarkdownRange(-2, this.rows.length).internal(tableRowIndex);
	}


	/**
	 * ヘッダを含む行番号に変換して取得します。
	 * ヘッダ行は-2, アライメント行は-1になります。
	 * 範囲を超える値も変換されるので使用する際は範囲のチェックが必要です。
	 * @param docIndex ドキュメント上の行番号
	 */
	public getTableRowIndex(docIndex: number): number
	{
		return super.contentIndexFromDocumentIndex(docIndex) - 2;
	}



	/**
	 * ドキュメントレベルのポジションをテーブルレベルのポジションに変換します。
	 * @param docPosition 
	 */
	public toTablePosition(docPosition: IDocumentPosition): TablePosition | undefined
	{
		const tableRowIndex = this.getTableRowIndex(docPosition.docIndex);
		const tableRow = this.getTableRow(tableRowIndex);
		
		if(tableRow)
		{
			const cellInfo = tableRow.getCellRangeFromCharacterIndex(docPosition.charIndex);
			if(cellInfo)
			{
				return new TablePosition(tableRowIndex, cellInfo.columnIndex);
			}
		}
	}

	public toDocumentPosition(tablePosition: TablePosition): IDocumentPosition | undefined
	{
		const row = this.getTableRow(tablePosition.rowIndex);
		if(row)
		{
			const cellInfo = row.getCellRangeFromColumnIndex(tablePosition.columnIndex);
			if(cellInfo)
			{
				return {
					docIndex: this.documentIndexFromContentIndex(tablePosition.rowIndex + 2),
					charIndex: cellInfo.range.begin
				};
			}
		}
	}






	/**
	 * 行を安全に取得します。取得できない場合はundefinedが返ります。
	 * @param tableRowIndex
	 */
	public getTableRow(tableRowIndex: number): MarkdownTableRows | undefined
	{
		if (this.isTableRow(tableRowIndex))
		{
			return [...this][tableRowIndex + 2];
		}
	}

	

	/**
     * セル(及び行)を安全に取得します。
     * 厳密に見つからなければundefinedを返します。
     */
	public getCell(tableRowIndex: number, columnIndex: number): ICellResult | undefined
	{
		const tableRow = this.getTableRow(tableRowIndex);
		if (tableRow)
		{
			const cell = tableRow.getCell(columnIndex)
			if(cell)
			{
				return {
					row: tableRow,
					cell: cell
				};
			}
		}
	}

	/**
	 * セル(ヘッダも含む)からポジションを取得します。
	 * @param cell
	 */
	public getTablePosition(cell: TableCell): TablePosition | undefined
	{
		for (const [index, row] of [...this].entries())
		{
			const clmIndex = (<Array<TableCell>>row.cells).indexOf(cell);
			if (clmIndex !== -1)
			{
				return new TablePosition(index - 2, clmIndex);
			}
		}
	}




	public *getVerticalTableRows(columnIndex: number, all: boolean = true): IterableIterator<ICellResult | undefined>
	{
		if (new MarkdownRange(0, this.columnLength).internal(columnIndex))
		{
			for (const row of this.rows)
			{
				if (row.cellLength > columnIndex)
				{
					yield {
						row: row,
						cell: row.cells[columnIndex]
					};
				}
				else
				{
					if (all)
					{
						yield undefined;
					}
				}
			}
		}
	}


	public *getVerticalOnlyTableRows(column: number): IterableIterator<ICellResult>
	{
		yield* this.getVerticalTableRows(column, false) as IterableIterator<ICellResult>;
	}


	/**
	 * 安全にセル情報を取得します。
	 */
	public getCellInfo(docPosition: IDocumentPosition): TableCellInfo | undefined
	{
		return TableCellInfo.createInstance(this, docPosition);
	}


}


export class TableCellInfo
{

	public static cnt: number = 10;
	public static count(): void
	{
		this.cnt++;
	}

	public serial: number;

	
	public isRow(): boolean
	{
		return this.table.isRow(this.rowIndex);
	}

	public get docIndex(): number
	{
		return this.docPosition.docIndex;
	}

	public get charIndex(): number
	{
		return this.docPosition.charIndex;
	}

	public get rowIndex(): number
	{
		return this.tablePosition.rowIndex;
	}

	public get columnIndex(): number
	{
		return this.tablePosition.columnIndex;
	}

	public get cellRange(): MarkdownRange
	{
		return this.cellInfo.range;
	}

	public get cell(): TableCell
	{
		return this.cellInfo.cell;
	}


	/**
	 * 空白を含む文字列からの、トリミング文字列先頭位置。
	 * '   abc  ' = 3
	 */
	public get wordInnerPosition(): number
	{
		const word = this.cellInfo.cell.word;
		
		// TODO: strCount
		return word.indexOf(word.trim());
	}

	/**
	 * 空白を含む文字列先頭からの選択位置。
	 * '   ab|c' = 5
	 */
	public get cursorInnerPosition(): number
	{
		return this.docPosition.charIndex - this.cellRange.begin;
	}

	
	/**
	 * トリミング文字列先頭からの相対的な選択位置。
	 * 
	 * '   ab|c' = 2
	 */
	public get relativeCursorInnerPosition(): number
	{
		return this.cursorInnerPosition - this.wordInnerPosition;
	}

	/**
	 * 相対位置を元に文字列先頭からの位置を取得します。範囲を超えていた場合は調整されます。
	 * @param relativeCursorInnerPosition
	 */
	public getPosFromRelativeCursorPosition(relativeCursorInnerPosition: number): number
	{
		return new MarkdownRange(0, this.cellRange.length).adjust(relativeCursorInnerPosition + this.wordInnerPosition);
	}

	/**
	 * 相対位置からのDocIndexを取得します。
	 * @param relativeCursorInnerPosition
	 */
	public getDocCharIndex(relativeCursorInnerPosition: number): number
	{
		const rp = this.getPosFromRelativeCursorPosition(relativeCursorInnerPosition);
		return this.cellRange.begin + rp;
	}



	/**
	 * 行のセル数を返します。table.columnLengthはヘッダのセル数であることに注意してください。
	 */
	public get rowCellsLength(): number
	{
		return this.row.cellLength;
	}

	private constructor(
		public readonly table: MarkdownTableContent,
		public readonly row: MarkdownTableRows,
		public readonly docPosition: IDocumentPosition,
		public readonly tablePosition: TablePosition,
		public readonly cellInfo: CellRangeInfo
	)
	{
		TableCellInfo.count();
		this.serial = TableCellInfo.cnt;
	}

	public static createInstance(table: MarkdownTableContent, docPosition: IDocumentPosition): TableCellInfo | undefined
	{
		const tableRowIndex = table.getTableRowIndex(docPosition.docIndex);
		const tableRow = table.getTableRow(tableRowIndex);
		
		if(tableRow)
		{
			const cellInfo = tableRow.getCellRangeFromCharacterIndex(docPosition.charIndex);
			if(cellInfo)
			{
				const tablePosition = new TablePosition(tableRowIndex, cellInfo.columnIndex);

				return new TableCellInfo(table, tableRow, docPosition, tablePosition, cellInfo);
			}
		}
	}

	/**
	 * tablePositionからTableCellInfoを作成しますが、カーソル位置は捨てられて０になります。
	 * 理由は、tablePositionをdocPositionに変換後、docPosition.charIndexにカーソル分を足してcreateInstance()を呼び出すと、tablePositionの範囲を超える(他のセルを取得してしまう)可能性があるからです。
	 * カーソル分が必要な場合はcreateInstanceFromTablePositionAndCursor()を使用してください。
	 * @param table
	 * @param tablePosition
	 */
	public static createInstanceFromTablePosition(table: MarkdownTableContent, tablePosition: TablePosition): TableCellInfo | undefined
	{
		const row = table.getTableRow(tablePosition.rowIndex);
		if(row)
		{
			const cellInfo = row.getCellRangeFromColumnIndex(tablePosition.columnIndex);
			if(cellInfo)
			{
				const docPosition: IDocumentPosition = {
					docIndex: table.documentIndexFromContentIndex(tablePosition.rowIndex + 2),
					charIndex: cellInfo.range.begin
				};

				return this.createInstance(table, docPosition);
			}
		}
	}

	/**
	 * relativeCursorPosition
	 * @param table
	 * @param tablePosition
	 * @param relativeCursorPosition
	 */
	public static createInstanceFromTablePositionAndCursor(table: MarkdownTableContent, tablePosition: TablePosition, relativeCursorPosition: number): TableCellInfo | undefined
	{
		const ci = this.createInstanceFromTablePosition(table, tablePosition);
		if (ci)
		{
			const rp = ci.getDocCharIndex(relativeCursorPosition);
			const docPos: IDocumentPosition = { docIndex: ci.docIndex, charIndex: rp };
			return new TableCellInfo(table, ci.row, docPos, ci.tablePosition, ci.cellInfo);
		}
	}


	/**
	 * 現在のセルのインスタンスから新たなセル情報を取得します。
	 * セルの状態が変更した時などに再取得します。
	 * @param newRelativeCursorPosition 相対カーソル位置を更新する場合は指定します。
	 */
	public newCellInfo(newRelativeCursorPosition: number = this.relativeCursorInnerPosition): TableCellInfo | undefined
	{
		const pos = this.table.getTablePosition(this.cell);
		if (pos)
		{
			return TableCellInfo.createInstanceFromTablePositionAndCursor(this.table, pos, newRelativeCursorPosition);
		}
	}

	/**
	 * セル情報は取得した時点でのもので、テーブルに変更が加わった場合情報が古くなる場合があります。
	 * 例えば現在のセルの位置が変わると、tablePositionは嘘の情報になります。
	 * その元のポジションには別のセル、あるいは何もない可能性があり、このメソッドでは元のポジションにあるセルから新たなセル情報(後釜)を取得します。
	 * もしセルが同じであれば相対カーソル情報を保持したまま(newCellInfo())を返します。
	 * @param cellInfo
	 */
	public befCellInfo(): TableCellInfo | undefined
	{
		const pos = this.tablePosition;
		if (pos)
		{
			const posCell = this.table.getCell(pos.rowIndex, pos.columnIndex);

			// 元のポジションのセルと現在のセルが同じなら相対カーソル位置を保持したまま返す。
			if (posCell && this.cell === posCell.cell)
			{
				return this.newCellInfo();
			}
			else
			{
				return TableCellInfo.createInstanceFromTablePosition(this.table, pos);
			}
		}
	}


	/**
	 * 現在のセル情報から相対的な位置にあるセル情報を取得します
	 * @param nextPosition TablePositionDirectionsで上下左右を指定することも出来ます。
	 */
	public getCellFromRelative(nextPosition: TablePosition): TableCellInfo | undefined
	{
		return TableCellInfo.createInstanceFromTablePosition(
			this.table,
			this.tablePosition.add(nextPosition)
		);
	}

	/**
	 * 現在のセル情報のテーブルを元に、絶対的な位置にあるセル情報を取得します。
	 * @param tablePosition 
	 */
	public getCellFromAbsolute(tablePosition: TablePosition): TableCellInfo | undefined
	{
		return TableCellInfo.createInstanceFromTablePosition(this.table, tablePosition);
	}


	/**
	 * セルから、指定した方角にある一番最初に見つかるセル情報を取得します。
	 */
	public getCellFromDirection(direction: Direction): TableCellInfo | undefined
	{
		const dirPos: TablePosition = TablePositionDirections.getPositionFromDirection(direction);
		let nextPos: TablePosition = this.tablePosition;

		while (this.isTableArea(nextPos = nextPos.add(dirPos)))
		{
			const nextCellInfo = this.getCellFromAbsolute(nextPos);

			if (nextCellInfo)
			{
				return nextCellInfo;
			}
		}
	}

	/**
	 * FillFormat後の通常テーブルの範囲内かどうかをチェックします。
	 * のこぎり型でも、通常テーブル内としてみなしたうえでチェックします。
	 * @param tablePosition
	 */
	public isTableArea(tablePosition: TablePosition): boolean
	{
		const r = this.table.rowLength;
		const c = this.table.columnLength;

		return new MarkdownRange(-2, r).internal(tablePosition.rowIndex) && new MarkdownRange(0, c).internal(tablePosition.columnIndex);
	}

	public getForcus(): ISelection
	{
		return {
			sPos: this.docPosition
		};
	}

	public getWordSelection(): ISelection
	{
		return {
			sPos: {
				charIndex: this.cellRange.begin + this.wordInnerPosition,
				docIndex: this.docIndex
			},
			ePos: {
				charIndex: this.cellRange.begin + this.wordInnerPosition + this.cell.word.trim().length,
				docIndex: this.docIndex
			}
		};
	}
}






export class TableCell
{
	private _word: string;

	public get empty(): boolean
	{
		return this._word.trim() === '';
	}

	public get word(): string
	{
		return this._word;
	}

	public set word(value: string)
	{
		this._word = value;
	}

	public constructor(word: string)
	{
		this._word = word;
	}
	

}


export class TableAlignmentCell extends TableCell
{

	private _align: MarkdownAlignments = MarkdownAlignments.Left;
	private _alignWord: AlignWord = '---';


	public get align(): MarkdownAlignments
	{
		return this._align;
	}

	public get alignWord(): AlignWord
	{
		return this._alignWord;
	}
	

	public updateProperties(word: string): boolean
	{
		const alignWord = TableAlignmentCell.convertAlignWord(word);

		if (alignWord)
		{
			super.word = word;
			this._align = TableAlignmentCell.toAlignments(alignWord);
			this._alignWord = alignWord;
			return true;
		}

		return false;
	}

	public updateAlign(align: MarkdownAlignments): void
	{
		const alignWord = TableAlignmentCell.toAlignWord(align);
		this.updateProperties(alignWord);
	}




	private constructor(word: string = '---')
	{
		super(word);

		if (!this.updateProperties(word))
		{
			throw new Error('インスタンスの初期化に失敗しました。');
		}
	}

	public static createInstance(word: string): TableAlignmentCell | undefined
	{
		const instance = new TableAlignmentCell();

		if (instance.updateProperties(word))
		{
			return instance;
		}
	}
	
	public static createCellFromAlignments(align: MarkdownAlignments): TableAlignmentCell
	{
		const instance = new TableAlignmentCell();
		instance.updateAlign(align);
		return instance;
	}

	public static createCellFromWAlignWord(alignWord: AlignWord): TableAlignmentCell
	{
		return new TableAlignmentCell(alignWord);
	}


	
	public static toAlignCell(cell: TableCell): TableAlignmentCell | undefined
	{
		return this.createInstance(cell.word);
	}



	public static convertAlignWord(word: string): AlignWord | undefined
	{
		word = word.trim();

		if (word.match(/^:-{2,}$/))
		{
			return ':--';
		}

		if (word.match(/^-{3,}$/))
		{
			return '---';
		}

		if (word.match(/^-{2,}:$/))
		{
			return '--:';
		}

		if (word.match(/^:-{1,}:$/))
		{
			return ':-:'
		}
		
	}

	public static toAlignments(alignWord: AlignWord): MarkdownAlignments
	{
		switch (alignWord)
		{
			case '---': return MarkdownAlignments.Left;
			case ':--': return MarkdownAlignments.Left;
			case '--:': return MarkdownAlignments.Right;
			case ':-:': return MarkdownAlignments.Center;
		}
	}

	public static toAlignWord(align: MarkdownAlignments): AlignWord
	{
		switch (align)
		{
			case MarkdownAlignments.Right: return '--:';
			case MarkdownAlignments.Center: return ':-:';
			default: return '---';
		}
	}
	
	

}


export type AlignWord = ':--' | '---' | '--:' | ':-:';


















export class CellRangeInfo
{
	/**
	 * firstCell/lastCellの場合、或いはすでに行からセルが無い場合は-1が返ります。
	 */
	public get columnIndex(): number
	{
		return this.row.cells.indexOf(this.cell);
	}

	public constructor(
		private readonly row: MarkdownTableRows,
		public readonly cell: TableCell,
		public readonly range: MarkdownRange
	){

	}
}



export abstract class TableRowBase<TCell extends TableCell>
{

	public *[Symbol.iterator]()
	{
		if (this.firstCell)
		{
			yield this.firstCell;
		}

		yield* this.cells;

		if (this.lastCell)
		{
			yield this.lastCell;
		}

	}

	public get hasFirstSpritter(): boolean
	{
		return !!this.firstCell;
	}

	public get hasLastSplitter(): boolean
	{
		return !!this.lastCell;
	}

	public get cellLength(): number
	{
		return this.cells.length;
	}

	public constructor(
		public readonly cells: Array<TCell>,
		public readonly firstCell: TableCell | undefined,
		public readonly lastCell: TableCell | undefined
	)
	{
		
	}


	/**
	 * セルを安全に取得します。
	 * @param columnIndex
	 */
	public getCell(columnIndex: number): TCell | undefined
	{
		if (this.hasCell(columnIndex))
		{
			return this.cells[columnIndex];
		}
	}

	public hasCell(columnIndex: number): boolean
	{
		return new MarkdownRange(0, this.cellLength).internal(columnIndex);
	}


	public getCellRangeFromCell(cell: TableCell, strCounter?: IStringCounter): MarkdownRange | null
	{
		for (const r of this.getCellRanges(strCounter))
		{
			if (cell === r.cell)
			{
				return r.range;
			}
		}

		return null;
	}

	/**
	 * charIndexにあるセル及びその範囲を取得します。
	 * セルはfirstCell/lastCellを含みます。
	 * カラム番号はrows.indexOf()から取得してください。
	 * @param charIndex 
	 * @param strCount 
	 */
	public getCellRangeFromCharacterIndex(charIndex: number, strCounter?: IStringCounter): CellRangeInfo | undefined
	{
		for (const r of this.getCellRanges(strCounter))
		{
			if (r.range.internalOrZero(charIndex))
			{
				return r;
			}
		}	
	}

	public getCellRangeFromColumnIndex(columnIndex: number, strCounter?: IStringCounter): CellRangeInfo | undefined
	{
		for(const r of this.getCellRanges(strCounter))
		{
			const ci = r.columnIndex;
			if(ci !== -1 && ci === columnIndex)
			{
				return r;
			}
		}
	}

	public *getCellRanges(strCounter: IStringCounter = str => str.length): IterableIterator<CellRangeInfo>
	{
		let cp = 0;

		for (const cell of this)
		{
			let len = strCounter(cell.word);

			yield new CellRangeInfo(this, cell,  MarkdownRange.fromLength(cp, len));
			cp++;
			cp += len;
		}
	}

	public isFirstOrLast(cell: TableCell): boolean
	{
		return cell === this.firstCell || cell === this.lastCell;
	}



	//#region internal methods

	/**
	 * TODO: 単純なsplitではエスケープ等が分割できない。
	 */
	public static split(line: string, splitter: string = '|'): Array<TableCell>
	{
		return this.jpSplit(line).map<TableCell>(_ => new TableCell(_));
	
	}

	private static jpSplit(str: string): Array<string>
	{
		//return str.split(/(?<=[^\\]|[^\\]\\\\)\|/).map(_ => _.replace(/\\/g, "\\"));
		return `@${str}`.split(/(?<=[^\\]|[^\\](?:\\\\)+)\|/g).map(_ => _.replace(/\\/g, "\\")).map((_, idx) => idx === 0 ? _.substr(1) : _);
	}


	/**
	 * TODO: 複雑すぎるためリファクタ必須。
	 * @param items
	 * @param limit
	 */
	public static adjust(items: Array<TableCell>, limit: number = Number.MAX_SAFE_INTEGER): MarkdownTableRows | undefined
	{
		// 分割されてない
		if (items.length === 1)
		{
			return;
		}

		// "  |  " の状態で成立しない。
		if (items.length == 2)
		{
			if (items[0].empty && items[1].empty)
			{
				return;
			}
		}


		// "|...|...|" 左側にスプリッタが存在する場合は抜き取る
		const first = items[0].empty ? items.shift() : undefined;

		// 最後のセルをいったん取り出す。
		let plast = items.pop();


		// 最後のセルが空なら暫定的な最終セルが決定、空でなければ元に戻す(itemsの最後は空では無いことが確定)
		if (plast && !plast.empty)
		{
			items.push(plast);
			plast = undefined;
		}

		// 安全な非空アイテムから、limit個のセルと残りのアイテム(lastCell)に分割する。
		const cells = items.splice(0, limit);

		
		//plastが存在すればitemsに統合
		if (plast)
		{
			items.push(plast);
		}

		// 最後は一つに結合される。
		const last = this.joinTableCells(items);


		return new MarkdownTableRows(cells, first, last);

	}

	// 範囲を残した状態で結合します。
	private static joinTableCells(cells: Array<TableCell>): TableCell | undefined
	{
		if (cells.length > 0)
		{
			const txt = cells.map(p => p.word).join('|');
			return new TableCell(txt);
		}
	}

	//#endregion
	


}


export class MarkdownTableRows extends TableRowBase<TableCell>
{

	public static createInstance(line: string, limit: number = Number.MAX_SAFE_INTEGER): MarkdownTableRows | undefined
	{
		const lines = this.split(line);
		return this.adjust(lines, limit);
	}

}



export class MarkdownTableAlignments extends TableRowBase<TableAlignmentCell>
{

	public static createInstance(line: string): MarkdownTableAlignments | undefined
	{
		const row = MarkdownTableRows.createInstance(line);

		if (row)
		{
			const cells = row.cells.map(_ => TableAlignmentCell.toAlignCell(_));

			// TODO: この手のチェックが効かない
			if (!cells.some(_ => _ === undefined))
			{
				return new MarkdownTableAlignments(
					cells as TableAlignmentCell[],
					row.firstCell,
					row.lastCell
				);
			}
		}
	}


}







