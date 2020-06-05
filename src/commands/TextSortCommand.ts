import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo, MarkdownTableRows } from "../impls/MarkdownTableContent";
import { TextSortCommandBase } from "./CommandBaseClasses";

export class TextSortCommand extends TextSortCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		this.sortText(cellInfo);

		
		focus.format();
		focus.setFocusedCellInfo(cellInfo.newCellInfo()?.getForcus());
	}


	private sortText(cellInfo: TableCellInfo): void
	{
		const columnIndex = cellInfo.columnIndex;
		const arr = cellInfo.table.rows;
		const nanVals: Array<[number, MarkdownTableRows]> = [];

		for (let i = arr.length - 1; i >= 0; i--)
		{
			const nbr = this.getStr(arr[i], columnIndex);
			if (nbr === undefined)
			{
				nanVals.push([i, arr[i]]);
				arr.splice(i, 1);
			}
		}

		arr.sort((a, b) => this.compare(a, b, columnIndex));
		nanVals.reverse().forEach(_ => arr.splice(_[0], 0, _[1]));
	}

	private compare(a: MarkdownTableRows, b: MarkdownTableRows, ci: number): number
	{
		const ob = this.isAsc ? -1 : 1;
		let sa = this.getStr(a, ci);
		let sb = this.getStr(b, ci);

		if (this.ignoreCase)
		{
			sa = sa.toUpperCase();
			sb = sb.toUpperCase();
		}

		return sa < sb ? ob : sa > sb ? -ob : 0;
	}

	private getStr(r: MarkdownTableRows, ci: number): string
	{
		const c = r.getCell(ci);
		if (c)
		{
			return c.word.trim();
		}

		return "";
	}

}
