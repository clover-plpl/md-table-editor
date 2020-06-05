import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TableCellInfo } from "../impls/MarkdownTableContent";
import { FormatCommandBase } from "./CommandBaseClasses";


export class FormatCommand extends FormatCommandBase
{

	protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
	{
		return true;
	}

	protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
	{
		const rp = cellInfo.relativeCursorInnerPosition;

		focus.format();

		const cp = cellInfo.newCellInfo(rp);
		const f = cp?.getForcus();
		focus.setFocusedCellInfo(f);
	}

	public put(cp: TableCellInfo | undefined, tag: string): void
	{
		if(cp)
		{
			const pos = this.commandContext.appContext.getCursor() || {
				docIndex: -1,
				charIndex: -1
			};

			const tx = `wordPos=${cp.wordInnerPosition}, cursor(${pos.docIndex}, ${pos.charIndex})`;
			const line = `|${cp.row.cells.map(_ => _.word).join('|')}|`;
			console.log(`${line} [${tag}]relPos = ${cp.relativeCursorInnerPosition}, fcs(${cp.docPosition.docIndex}, ${cp.docPosition.charIndex}) ... tx(${tx}), ${ cp.serial }`);
		}
		else
		{
			console.log(`undefined [${tag}]`);
		}
	}
}



