import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo, MarkdownTableRows } from "../impls/MarkdownTableContent";
import { MovableArray } from "../interfaces/ICollectionMovable";
import { MoveCommandBase } from "./CommandBaseClasses";



export class MoveRowCommand extends MoveCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean
	{
		return this.getTargetRowIndex(cellInfo) !== undefined;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void
	{
		const itemRowIndex = cellInfo.rowIndex;
		const targetRowIndex = this.getTargetRowIndex(cellInfo) as number;
		const ba = this.getInsertLine(this.isBefore);
		new MovableArray<MarkdownTableRows>(cellInfo.table.rows).move(targetRowIndex, [itemRowIndex], ba);

		const f = cellInfo.newCellInfo()?.getForcus()
		focus.setFocusedCellInfo(f);
	}
	
	private getTargetRowIndex(cellInfo: TableCellInfo): number | undefined
	{
		const targetRowIndex = cellInfo.tablePosition.add(this.getMoveRowDirection(this.isBefore)).rowIndex;
		if(cellInfo.table.isRow(targetRowIndex))
		{
			return targetRowIndex;
		}
	}

	protected isRowOnly() : boolean
	{
		return true;
	}
	

}
