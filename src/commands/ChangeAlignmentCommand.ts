import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { MarkdownAlignments } from "../interfaces/MarkdownAlignments";
import { TableAlignmentCell, TableCellInfo } from "../impls/MarkdownTableContent";
import { ITableCommandParameter } from "./ITableCommandParameter";
import { ChangeAlignmentCommandBase } from "./CommandBaseClasses";




export class ChangeAlignmentCommand extends ChangeAlignmentCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return !!this.getAlignmentCell(cellInfo);
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		const ac = this.getAlignmentCell(cellInfo);
		if (ac)
		{
			ac.updateAlign(this.align);

			const rp = cellInfo.relativeCursorInnerPosition;

			focus.format();
			const f = cellInfo.newCellInfo(rp)?.getForcus()
			focus.setFocusedCellInfo(f);
		}
	}
	

	private getAlignmentCell(cellInfo: TableCellInfo): TableAlignmentCell | undefined
	{
		return cellInfo.table.alignments.cells[cellInfo.columnIndex];
	}

}

export interface MarkdownAlignmentsParameter extends ITableCommandParameter
{
	align: MarkdownAlignments;
}

