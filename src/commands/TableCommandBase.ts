import { CommandBaseGeneric } from "./CommandBaseGeneric";
import { ICommandContext } from "../interfaces/ICommandContext";
import { IAppContext } from "../interfaces/IAppContext";
import { AppHelper } from "../app/AppHelper";

export abstract class TableCommandBase<T> extends CommandBaseGeneric<T>
{

	protected readonly appContext: IAppContext;
	protected readonly appHelper: AppHelper;

	public constructor(protected readonly commandContext: ICommandContext)
	{
		super();
		this.appContext = commandContext.appContext;
		this.appHelper = new AppHelper(this.appContext);
	}


	/**
	 * デフォルトではパラメータの型の安全性は一切保証しません。
	 * @param parameter
	 */
	protected convert(parameter: any): T | undefined
	{
		return parameter as T;
	}
	

}
