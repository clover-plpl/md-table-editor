import { IEventReciever, ITextChanged, ISelectChanged } from "../interfaces/IEventReciever";
import { EventUpdateManager } from "./EventUpdateManager";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { IAppContext } from "../interfaces/IAppContext";
import { AppHelper } from "./AppHelper";


export class TableObserver implements IEventReciever
{

	private eventManager: EventUpdateManager;

	public constructor(
		private readonly appContext: IAppContext,
		private readonly updated: (tables: Array<MarkdownTableContent>) => void)
	{
		this.eventManager = new EventUpdateManager(3000);
		this.eventManager.updated.push(() =>
		{
			this.tableUpdate();
		});
	}

	public textChanged(e: ITextChanged): void
	{
		this.update();
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.update();
	}

	public otherChanged(e?: any): void
	{
		// テキスト変更やセレクション変更以外、つまりエディタの変更時などは即時更新。
		this.eventManager.update();
	}

	private update(): void
	{
		this.eventManager.lazyUpdate();
	}

	private tableUpdate(): void
	{
		const tables = new AppHelper(this.appContext).getTableContents();
		this.updated(tables);
	}

}

