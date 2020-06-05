import { MarkdownTableContent, TableCellInfo, TableCell, TableRowBase, TablePositionDirections } from "../impls/MarkdownTableContent";
import { MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";
import { TablePosition } from "../interfaces/TablePosition";
import { ICommandContext } from "../interfaces/ICommandContext";
import { TableCommandBase } from "./TableCommandBase";
import { IFormatterContext } from "../interfaces/IFormatterContext";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { ISelection } from "../interfaces/ISelection";


class FormattableParameter implements IFormattableParameter
{
	private _focus: ISelection[] = [];
	private _formatted: boolean = false;

	public get focus(): ISelection[]
	{
		return this._focus;
	}

	public get isUpdated(): boolean
	{
		return !!this._focus || this._formatted;
	}

	public constructor(
		public readonly table: MarkdownTableContent,
		public readonly context: IFormatterContext)
	{

	}



	// #region IFormattableParameter の実装

	public setFocusedCellInfo(...focus: (ISelection | undefined)[]): void
	{
		this._focus = (focus || []).filter(_ => !!_);
	}

	public format(): void
	{
		this.context.formatter.format(this.table);
		this._formatted = true;
	}

	// #endregion IFormattableParameter の実装終わり



	public exec(): void
	{
		const table = this.table;
		const txt = this.context.renderer.toDataType(table);
		this.context.methods.replace(table.range, txt);

		if (this.focus.length)
		{
			this.context.methods.select(...this.focus);
		}
	}



}




/**
 * セル上で成り立つコマンドの基底クラスを表します。
 * move系、insert系などはセル上にカーソルがあることが前提で実行するコマンドです。
 * 逆に、フォーマット系などはセル上にある必要はありません。例えばfirstCell/lastCell上でも実行できるタイプのコマンドです。
 */
export abstract class TableCellCommandBase<T> extends TableCommandBase<T>
{


	public constructor(protected readonly commandContext: ICommandContext)
	{
		super(commandContext);
	}


	protected getCellInfo(): TableCellInfo | undefined
	{
		const pos = this.appContext.getCursor();
		const table = this.commandContext.getTable();
		if(table && pos)
		{
			return table.getCellInfo(pos);
		}
	}


	// final
	protected canExecuteGeneric(parameter: T | undefined): boolean
	{
		const cellInfo = this.getCellInfo();
		if(cellInfo)
		{
			if(this.checkIsRowOnly(cellInfo))
			{
				return this.canExecuteOverride(cellInfo, parameter);
			}
		}
		return false;
	}
	
	// final
	protected executeGeneric(parameter: T | undefined): void
	{
		const cellInfo = this.getCellInfo();
		if(cellInfo)
		{
			const formatContext = <IFormatterContext>this.commandContext.getFormatterContext();
			const focusParameter = new FormattableParameter(cellInfo.table, formatContext);
			this.executeOverride(cellInfo, parameter, focusParameter);
			focusParameter.exec();
		}
	}

	

	protected abstract canExecuteOverride(cellInfo: TableCellInfo, parameter: T | undefined): boolean;
	protected abstract executeOverride(cellInfo: TableCellInfo, parameter: T | undefined, focus: IFormattableParameter): void;


	
	

	/**
	 * この実行条件がヘッダを覗く行のみを対象とする場合にtrueを返します。
	 * 行の移動や追加などでtrueを返します。
	 */
	protected isRowOnly(): boolean
	{
		return false;
	}

	private checkIsRowOnly(cellInfo: TableCellInfo): boolean
	{
		return !this.isRowOnly() || cellInfo.isRow();
	}

	protected get defaultRenderMode(): MarkdownTableRenderMode
	{
		return MarkdownTableRenderMode.Beautiful;
	}



	protected getInsertColumnDirection(isBefore: boolean): TablePosition
	{
		return new TablePosition(0, isBefore ? 0 : 1);
	}

	protected getInsertRowDirection(isBefore: boolean): TablePosition
	{
		return new TablePosition(isBefore ? 0 : 1, 0);
	}

	protected getMoveColumnDirection(isBefore: boolean): TablePosition
	{
		return new TablePosition(0, isBefore ? -1 : 1);
	}

	protected getMoveRowDirection(isBefore: boolean): TablePosition
	{
		return new TablePosition(isBefore ? -1 : 1, 0);
	}

	protected getColumnCell(cellInfo: TableCellInfo, isBefore: boolean): TableCellInfo | undefined
	{
		return cellInfo.getCellFromRelative(this.getInsertColumnDirection(isBefore));
	}

	protected getRowCell(cellInfo: TableCellInfo, isBefore: boolean): TableCellInfo | undefined
	{
		return cellInfo.getCellFromRelative(this.getInsertRowDirection(isBefore));
	}

	protected getInsertLine(isBefore: boolean): number
	{
		return isBefore ? TablePositionDirections.before : TablePositionDirections.after;
	}


}




export class CellInfoHelper
{
	
	public static getColumn(cellInfo: TableCellInfo): { cellInfos: Array<TableCellInfo | undefined>, hasAll: boolean }
	{
		const table = cellInfo.table;
		const columnIndex = cellInfo.columnIndex;
		const infos: Array<TableCellInfo | undefined> = [];

		for(let i=0; i<table.rowLength; i++)
		{
			infos.push(TableCellInfo.createInstanceFromTablePosition(table, new TablePosition(i, columnIndex)));
		}

		return {
			cellInfos: infos,
			hasAll: infos.some(_ => _ === undefined),
		};
	}



	public static createRow<TCell extends TableCell, TRow extends TableRowBase<TCell>>(constructor: ITableRowConstructor<TCell, TRow>, length: number, cellFactory: () => TCell): TRow
	{
		const firstCell = new TableCell('');
		const lastCell = new TableCell('');
		const cells = 'a'.repeat(length).split('').map(_ => cellFactory());

		return new constructor(cells, firstCell, lastCell);
	}

	public static fillCells<TCell extends TableCell, TRow extends TableRowBase<TCell>>(row: TRow, pos: number, cellFactory: () => TCell)
	{
		while(row.cells.length < pos)
		{
			row.cells.push(cellFactory());
		}
	}

	public static insertCell<TCell extends TableCell, TRow extends TableRowBase<TCell>>(row: TRow, pos: number, cellFactory: () => TCell)
	{
		row.cells.splice(pos, 0, cellFactory());
	}
}

export interface ITableRowConstructor<TCell extends TableCell, TRow extends TableRowBase<TCell>>
{
	new (cells: Array<TCell>, firstCell: TableCell | undefined, lastCell: TableCell | undefined): TRow;
}

