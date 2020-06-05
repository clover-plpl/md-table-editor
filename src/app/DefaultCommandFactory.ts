import { ChangeAlignmentCommand } from "../commands/ChangeAlignmentCommand";
import { RemoveColumnCommand } from "../commands/RemoveColumnCommand";
import { InsertColumnCommand } from "../commands/InsertColumnCommand";
import { InsertRowCommand } from "../commands/InsertRowCommand";
import { MoveRowCommand } from "../commands/MoveRowCommand";
import { MoveColumnCommand } from "../commands/MoveColumnCommand";
import { FillCellsCommand } from "../commands/FillCellsCommand";
import { FormatCommand } from "../commands/FormatCommand";
import { RemoveRowCommand } from "../commands/RemoveRowCommand";
import { FocusCommand } from "../commands/FocusCommand";
import { DeleteCommentCommand } from "../commands/DeleteCommetCommand";
import { SortCommand } from "../commands/SortCommand";
import { TextSortCommand } from "../commands/TextSortCommand";
import { ScrollCommand } from "../commands/ScrollCommand";
import { ICommandContext } from "../interfaces/ICommandContext";
import { MarkdownAlignments } from "../interfaces/MarkdownAlignments";
import { MarkdownTableRenderMode } from "../impls/MarkdownTableConverter";
import { Direction } from "../interfaces/Direction";
import { IAppContext } from "../interfaces/IAppContext";
import { TableCacheManager } from "./TableCacheManager";
import { IFormatterContext } from "../interfaces/IFormatterContext";
import { ColumnSelectCommand, SelectType } from "../commands/ColumnSelectCommand";
import { TableCellInfo, MarkdownTableContent } from "../impls/MarkdownTableContent";


export class DefaultCommandFactory
{
	public constructor(
		protected appContext: IAppContext,
		protected cache: TableCacheManager
	)
	{
		
	}

	public commandContext(formatterContext: IFormatterContext): ICommandContext
	{
		return new CommandContext(this.appContext, formatterContext, this.cache);
	}



	//#region セルベースのコマンド
	
	public createMoveLeft(formatterContext: IFormatterContext): MoveColumnCommand
	{
		return new MoveColumnCommand(this.commandContext(formatterContext), true);
	}

	public createMoveRight(formatterContext: IFormatterContext): MoveColumnCommand
	{
		return new MoveColumnCommand(this.commandContext(formatterContext), false);
	}

	public createMoveTop(formatterContext: IFormatterContext): MoveRowCommand
	{
		return new MoveRowCommand(this.commandContext(formatterContext), true);
	}

	public createMoveBottom(formatterContext: IFormatterContext): MoveRowCommand
	{
		return new MoveRowCommand(this.commandContext(formatterContext), false);
	}

	public createInsertLeft(formatterContext: IFormatterContext): InsertColumnCommand
	{
		return new InsertColumnCommand(this.commandContext(formatterContext), true);
	}

	public createInsertRight(formatterContext: IFormatterContext): InsertColumnCommand
	{
		return new InsertColumnCommand(this.commandContext(formatterContext), false);
	}

	public createInsertTop(formatterContext: IFormatterContext): InsertRowCommand
	{
		return new InsertRowCommand(this.commandContext(formatterContext), true);
	}

	public createInsertBottom(formatterContext: IFormatterContext): InsertRowCommand
	{
		return new InsertRowCommand(this.commandContext(formatterContext), false);
	}

	public createChangeAlignLeft(formatterContext: IFormatterContext): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(formatterContext), MarkdownAlignments.Left);
	}

	public createChangeAlignCenter(formatterContext: IFormatterContext): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(formatterContext), MarkdownAlignments.Center);
	}

	public createChangeAlignRight(formatterContext: IFormatterContext): ChangeAlignmentCommand
	{
		return new ChangeAlignmentCommand(this.commandContext(formatterContext), MarkdownAlignments.Right);
	}

	public createNaturalFormat(formatterContext: IFormatterContext): FormatCommand
	{
		return new FormatCommand(this.commandContext(formatterContext), MarkdownTableRenderMode.Natural);
	}

	public createBeautifulFormat(formatterContext: IFormatterContext): FormatCommand
	{
		return new FormatCommand(this.commandContext(formatterContext), MarkdownTableRenderMode.Beautiful);
	}

	public createFocusLeft(formatterContext: IFormatterContext): FocusCommand
	{
		return new FocusCommand(this.commandContext(formatterContext), Direction.Left);
	}

	public createFocusRight(formatterContext: IFormatterContext): FocusCommand
	{
		return new FocusCommand(this.commandContext(formatterContext), Direction.Right);
	}

	public createFocusTop(formatterContext: IFormatterContext): FocusCommand
	{
		return new FocusCommand(this.commandContext(formatterContext), Direction.Top);
	}

	public createFocusBottom(formatterContext: IFormatterContext): FocusCommand
	{
		return new FocusCommand(this.commandContext(formatterContext), Direction.Bottom);
	}

	public createColumnSelect(formatterContext: IFormatterContext): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(formatterContext), SelectType.Full);
	}

	public createColumnSelectAll(formatterContext: IFormatterContext): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(formatterContext), SelectType.Empty | SelectType.Full);
	}

	public createColumnSelectEmpty(formatterContext: IFormatterContext): ColumnSelectCommand
	{
		return new ColumnSelectCommand(this.commandContext(formatterContext), SelectType.Empty);
	}

	public createDeleteComment(formatterContext: IFormatterContext): DeleteCommentCommand
	{
		return new DeleteCommentCommand(this.commandContext(formatterContext));
	}

	public createFillCells(formatterContext: IFormatterContext): FillCellsCommand
	{
		return new FillCellsCommand(this.commandContext(formatterContext));
	}

	public createRemoveRow(formatterContext: IFormatterContext): RemoveRowCommand
	{
		return new RemoveRowCommand(this.commandContext(formatterContext));
	}

	public createRemoveColumn(formatterContext: IFormatterContext): RemoveColumnCommand
	{
		return new RemoveColumnCommand(this.commandContext(formatterContext));
	}

	public createSortAsc(formatterContext: IFormatterContext): SortCommand
	{
		return new SortCommand(this.commandContext(formatterContext), true);
	}

	public createSortDesc(formatterContext: IFormatterContext): SortCommand
	{
		return new SortCommand(this.commandContext(formatterContext), false);
	}

	public createTextSortAsc(formatterContext: IFormatterContext): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(formatterContext), true, false);
	}

	public createTextSortDesc(formatterContext: IFormatterContext): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(formatterContext), false, false);
	}

	public createTextSortAscIgnore(formatterContext: IFormatterContext): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(formatterContext), true, true);
	}

	public createTextSortDescIgnore(formatterContext: IFormatterContext): TextSortCommand
	{
		return new TextSortCommand(this.commandContext(formatterContext), false, true);
	}

	//#endregion





	//#region 全体的なコマンド

	public createIndexScrollCommand(formatterContext: IFormatterContext): ScrollCommand
	{
		return new ScrollCommand(this.commandContext(formatterContext), true);
	}

	//#endregion

}


class CommandContext implements ICommandContext
{
	public constructor(
		public readonly appContext: IAppContext,
		public readonly formatterContext: IFormatterContext,
		protected readonly cache: TableCacheManager)
	{

	}

	public getTable(): MarkdownTableContent
	{
		return this.cache.cachedItem;
	}

	public getFormatterContext(): IFormatterContext
	{
		return this.formatterContext;
	}

}