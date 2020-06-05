import { CellInfoHelper } from "./TableCellCommandBase";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCell, TableAlignmentCell, MarkdownTableAlignments, TableCellInfo, } from "../impls/MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";



export class InsertColumnCommand extends InsertCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void
	{
		for (const row of cellInfo.table)
		{
			if (row.hasCell(cellInfo.columnIndex))
			{
				const factory = row instanceof MarkdownTableAlignments ?
					() => TableAlignmentCell.createCellFromWAlignWord('---') :
					() => new TableCell('');

				const ba = cellInfo.tablePosition.add(this.getInsertColumnDirection(this.isBefore)).columnIndex;
				CellInfoHelper.insertCell(row, ba, factory);
			}
		}


		focus.format();
		const f = cellInfo.newCellInfo()?.getForcus();
		focus.setFocusedCellInfo(f);

	}

	

}

