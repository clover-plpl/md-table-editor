import { TableCellInfo } from "../impls/MarkdownTableContent";
import { IFormattableParameter } from "../interfaces/IFormattableParameter";
import { TablePosition } from "../interfaces/TablePosition";
import { TableCellCommandBase } from "./TableCellCommandBase";
import { ICommandContext } from "../interfaces/ICommandContext";

export enum SelectType
{
    None = 0,
    Empty = 1,
    Full = 2
}

export class ColumnSelectCommand extends TableCellCommandBase<void>
{
	public constructor(commandContext: ICommandContext, public readonly type: SelectType)
	{
		super(commandContext);
    }
    
    protected canExecuteOverride(cellInfo: TableCellInfo, parameter: void): boolean
    {
        return true;
    }
    
    protected executeOverride(cellInfo: TableCellInfo, parameter: void, focus: IFormattableParameter): void
    {
        const columnIndex = cellInfo.columnIndex;
        const check = (info: TableCellInfo) => {
            const st = info.cell.empty ? SelectType.Empty : SelectType.Full;
            return (this.type & st) !== 0;
        };
        
        const selections = cellInfo.table.rows
            .map<TableCellInfo>((v, idx) => TableCellInfo.createInstanceFromTablePosition(cellInfo.table, new TablePosition(idx, columnIndex)))
            .filter(_ => !!_ && check(_))
            .map(_ => _.getWordSelection());

        focus.setFocusedCellInfo(...selections);
    }

}