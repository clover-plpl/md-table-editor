import { TableCellCommandBase } from "./TableCellCommandBase";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { IInsertCellWord } from "../interfaces/IInsertCellWord";
import { MarkdownTableContent, TableCell, TableCellInfo } from "../impls/MarkdownTableContent";


// fillCells()のパラメータを取得するよう変更。


export class FillCellsCommand extends TableCellCommandBase<void>
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		FillCellsCommand.fillCells(cellInfo.table);
		focus.setFocusedCellInfo(cellInfo?.getForcus());
		focus.format();
	}

	/**
	 * 穴あき状態のセルを埋めます。
	 * @param insertCellWords
	 * @param 
	 */
	public static fillCells(table: MarkdownTableContent, insertCellWords: IInsertCellWord = (r, c) => ''): void
	{
		const width = table.columnLength;


		for (const [idx, row] of table.rows.entries())
		{
			while (row.cells.length < width)
			{
				row.cells.push(new TableCell(insertCellWords(idx, row.cells.length)));
			}
		}
	}


}

