import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo, MarkdownTableRows } from "../impls/MarkdownTableContent";
import { SortCommandBase } from "./CommandBaseClasses";


export class SortCommand extends SortCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		this.sortNumber(cellInfo, this.isAsc);
		focus.format();
		const f = cellInfo.newCellInfo()?.getForcus()
		focus.setFocusedCellInfo(f);
	}
	

	private sortNumber(cellInfo: TableCellInfo, isAsk: boolean): void
	{
		const columnIndex = cellInfo.columnIndex;
		const arr = cellInfo.table.rows;
		const nanVals: Array<[number, MarkdownTableRows]> = [];

		for (let i = arr.length - 1; i >= 0; i--)
		{
			const nbr = this.toNumber(arr[i], columnIndex);
			if (isNaN(nbr))
			{
				nanVals.push([i, arr[i]]);
				arr.splice(i, 1);
			}
		}

		arr.sort((a, b) => this.compare(a, b, columnIndex, isAsk));
		nanVals.reverse().forEach(_ => arr.splice(_[0], 0, _[1]));
	}

	private compare(a: MarkdownTableRows, b: MarkdownTableRows, ci: number, isAsk: boolean): number
	{
		const an = this.toNumber(a, ci);
		const bn = this.toNumber(b, ci);

		// TODO: 後で変更。
		return isAsk ? an - bn : bn - an;
	}


	private toNumber(row: MarkdownTableRows, columnIndex: number): number
	{
		const cell = row.getCell(columnIndex);
		if (cell)
		{
			return parseFloat(cell.word);
		}

		return Number.NaN;
	}
}

