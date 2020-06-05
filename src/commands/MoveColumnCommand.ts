import { CellInfoHelper } from "./TableCellCommandBase";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo, TableCell } from "../impls/MarkdownTableContent";
import { MovableArray } from "../interfaces/ICollectionMovable";
import { MoveCommandBase } from "./CommandBaseClasses";



export class MoveColumnCommand extends MoveCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean
	{
		return !!this.getTargetHeaderCell(cellInfo);
	}
	
	/**
	 * |A|B|C|   .1
	 * |A|B|     .2
	 * |A|       .3
	 * 
	 * index 1を左右に移動した場合のパターン。
	 * 
	 * .2   left 1         〇                 |A|B|   -> |B|A|
	 * .2   right 1        addCell(2) -> 〇   |A|B| | -> |A| |B|
	 * .1   left 1         addCell(1) -> 〇   |A| |   -> | |A|
	 * .1   right 1        ×
	 * 
	 * addCell(セルを埋める位置)でセル埋めし、そのうえで移動を実行する。
	 * 
	 * @param cellInfo 
	 * @param parameter 
	 */
	protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void
	{
		const targetHeaderPos = this.getTargetHeaderCell(cellInfo) as TableCellInfo;
		
		const itemColumnIndex = cellInfo.columnIndex;
		const targetColumnIndex = targetHeaderPos.columnIndex;

		for(const row of cellInfo.table)
		{
			const itemCell = row.getCell(itemColumnIndex);
			const targetCell = row.getCell(targetColumnIndex);
			
			// 対象位置までセルを埋める。
			if(!(itemCell || targetCell))
			{
				const fillIndex = Math.max(itemColumnIndex, targetColumnIndex);
				CellInfoHelper.fillCells(row, fillIndex, () => new TableCell(''));
			}

			// 移動させます。
			const ba = this.getInsertLine(this.isBefore);
			const movable = new MovableArray<TableCell>(row.cells);
			movable.move(targetColumnIndex, [itemColumnIndex], ba);
			
		}

		focus.setFocusedCellInfo(cellInfo.newCellInfo()?.getForcus());
		
	}

	

	private getTargetHeaderCell(cellInfo: TableCellInfo): TableCellInfo | undefined
	{
		const cellPos = cellInfo.tablePosition;
		const targetHeaderPos = cellPos.add(this.getMoveColumnDirection(this.isBefore)).setRowIndex(-2);
		return cellInfo.getCellFromAbsolute(targetHeaderPos);
	}

	

}

