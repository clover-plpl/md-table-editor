import { TableCellInfo, MarkdownTableContent } from "../impls/MarkdownTableContent";
import { IAppContext } from "./IAppContext";
import { IFormatterContext } from "./IFormatterContext";

export interface ICommandContext
{
	appContext: IAppContext;
	//cache: TableCacheManager;

	getFormatterContext(): IFormatterContext;
	getTable(): MarkdownTableContent | undefined;

}

