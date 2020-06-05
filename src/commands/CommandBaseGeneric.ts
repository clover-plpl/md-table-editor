import { ICommand } from "../interfaces/ICommand";


export abstract class CommandBase implements ICommand
{
	public readonly canExecuteChanged: Array<() => void> = [];

	public abstract execute(parameter?: any): void;
	public abstract canExecute(parameter?: any): boolean;

	public raiseCanExecuteChanged(): void
	{
		this.canExecuteChanged.forEach(_ => _());
	}

}


export abstract class CommandBaseGeneric<T> extends CommandBase
{

	protected abstract convert(parameter: any): T | undefined;
	protected abstract executeGeneric(parameter: T | undefined): void;
	protected abstract canExecuteGeneric(parameter: T | undefined): boolean;


	public execute(parameter?: any): void
	{
		const p = this.convert(parameter);
		this.executeGeneric(p);
	}

	public canExecute(parameter?: any): boolean
	{
		const p = this.convert(parameter);
		return this.canExecuteGeneric(p);
	}

}



