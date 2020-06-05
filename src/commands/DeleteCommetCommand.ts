import { TableCellCommandBase } from "./TableCellCommandBase";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo, MarkdownTableRows } from "../impls/MarkdownTableContent";

export class DeleteCommentCommand extends TableCellCommandBase<void> {

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return !!this.getCommentRows(cellInfo).length;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		const rows = this.getCommentRows(cellInfo);
		rows.forEach(_ => _.lastCell ? _.lastCell.word = '': '');

		focus.format();
		const f = cellInfo.newCellInfo()?.getForcus();
		focus.setFocusedCellInfo(f);
	}

	protected getCommentRows(cellInfo: TableCellInfo): Array<MarkdownTableRows>
	{
		return cellInfo.table.rows.filter(row => !!row.lastCell);
	}
}
