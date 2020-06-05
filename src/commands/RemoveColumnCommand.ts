import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo } from "../impls/MarkdownTableContent";
import { RemoveCommandBase } from "./CommandBaseClasses";

export class RemoveColumnCommand extends RemoveCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void
	{
		for (const row of cellInfo.table)
		{
			row.cells.splice(cellInfo.columnIndex, 1);
		}

		focus.format();

		const bef = cellInfo.befCellInfo();
		if (bef)
		{
			focus.setFocusedCellInfo(bef.newCellInfo(0)?.getForcus() || bef?.getForcus());
		}
	}

}

