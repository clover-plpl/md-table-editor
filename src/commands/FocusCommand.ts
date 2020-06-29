import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo } from "../impls/MarkdownTableContent";
import { FocusCommandBase } from "./CommandBaseClasses";
import { Direction } from "../interfaces/Direction";
import { TablePosition } from "../interfaces/TablePosition";

export class FocusCommand extends FocusCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return true;

		// TODO: メニューバーとの問題がありどうするか検討中。
		const nextCellInfo = this.getNextCellInfo(cellInfo);
		return !!nextCellInfo;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		let targetCellInfo = this.getNextCellInfo(cellInfo);
		if(targetCellInfo)
		{
			targetCellInfo = targetCellInfo.newCellInfo(0);
			const f = targetCellInfo?.getWordSelection();
			focus.setFocusedCellInfo(f);
		}
	}

	private getNextCellInfo(cellInfo: TableCellInfo): TableCellInfo | undefined
	{
		const colIndex = cellInfo.columnIndex;
		const rowIndex = cellInfo.rowIndex;

		let currentCell: TableCellInfo | undefined = cellInfo;

		// 左移動(ワープ)
		if(this.direction === Direction.Left)
		{
			if(colIndex > 0)
			{
				return currentCell?.getCellFromDirection(Direction.Left);
			}

			currentCell = currentCell?.getCellFromDirection(Direction.Top);

			if(rowIndex === 0)
			{
				currentCell = currentCell?.getCellFromDirection(Direction.Top);
			}

			const lastColIndex = Math.max(0, (currentCell?.rowCellsLength || 0) -1);

			return currentCell?.getCellFromRelative(new TablePosition(0, lastColIndex));
		}

		// 右移動(ワープ)
		if(this.direction === Direction.Right)
		{
			const lastColIndex = cellInfo.rowCellsLength - 1 || 0;

			if(colIndex < lastColIndex)
			{
				return currentCell?.getCellFromDirection(Direction.Right);
			}

			currentCell = currentCell?.getCellFromAbsolute(cellInfo.tablePosition.setColumnIndex(0));

			currentCell = currentCell?.getCellFromDirection(Direction.Bottom);

			if(rowIndex === -2)
			{
				currentCell = currentCell?.getCellFromDirection(Direction.Bottom);
			}
			
			return currentCell;
		}

		if(this.direction === Direction.Top)
		{
			currentCell = currentCell?.getCellFromDirection(Direction.Top);

			if(rowIndex === 0)
			{
				currentCell = currentCell?.getCellFromDirection(Direction.Top);
			}

			return currentCell;
		}

		if(this.direction === Direction.Bottom)
		{
			currentCell = currentCell?.getCellFromDirection(Direction.Bottom);

			if(rowIndex === -2)
			{
				currentCell = currentCell?.getCellFromDirection(Direction.Bottom);
			}

			return currentCell;
		}

	}

	protected isRowOnly(): boolean
	{
		return false;
	}
}





