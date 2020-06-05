import { CellInfoHelper } from "./TableCellCommandBase";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { MarkdownTableRows, TableCellInfo, TableCell } from "../impls/MarkdownTableContent";
import { InsertCommandBase } from "./CommandBaseClasses";



export class InsertRowCommand extends InsertCommandBase
{
	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: number): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: number, focus: IFormattableParameter): void
	{
		const table = cellInfo.table;
		const insertRowIndex = cellInfo.tablePosition.add(this.getInsertRowDirection(this.isBefore)).rowIndex;
		const insertRow = CellInfoHelper.createRow(MarkdownTableRows, table.columnLength, () => new TableCell(''));
		table.rows.splice(insertRowIndex, 0, insertRow);

		// フォーマット
		focus.format();

		// フォーカスは自身
		const f = cellInfo.newCellInfo()?.getForcus();
		focus.setFocusedCellInfo(f);

	}

	protected isRowOnly(): boolean
	{
		return true;
	}
	
}





