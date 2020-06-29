import { MarkdownTableContent } from "../impls/MarkdownTableContent";
import { setAppContext } from "./AppContext"
import { StringCounter } from "../StringCounter";
import { AutoFormatter } from "./AutoFormatter";
import { TableCacheManager } from "./TableCacheManager";
import { CacheUpdater } from "./CacheUpdater";
import { TableObserver } from "./TableObserver";
import { AppHelper } from "./AppHelper";
import { IAppContext } from "../interfaces/IAppContext";
import { IAppCommandStateUpdatable } from "../interfaces/IAppRegister";
import { IEventReciever, ITextChanged, ISelectChanged } from "../interfaces/IEventReciever";

export abstract class AppMain
{
	//private proxy: AppContextProxy;
	protected readonly cache: TableCacheManager;
	protected commandExecutionManager: IAppCommandStateUpdatable | undefined
	protected readonly helper: AppHelper;
	private readonly eventReciever: EventReciever;

	// TODO: 突貫工事のためリファクタ必要。
	private recieverSwitcher: RecieverSwitcher;
	private decoratorSwitcher: DecoratorSwitcher;

	public set useAutoFormatter(use: boolean)
	{
		use ? this.recieverSwitcher.on() : this.recieverSwitcher.off();
	}

	public set useDecorator(use: boolean)
	{
		this.decoratorSwitcher.setEnabled(use);
	}
	
	public constructor(public readonly appContext: IAppContext)
	{
		this.helper = new AppHelper(this.appContext);
		this.cache = new TableCacheManager(() => this.helper.getTable());
		this.eventReciever = new EventReciever();
		this.recieverSwitcher = new RecieverSwitcher(this.eventReciever);
		this.decoratorSwitcher = new DecoratorSwitcher(appContext);


		this.cache.cacheItemUpdated.push((nv, ov) =>
		{
			this.onCurrentTableChanged(nv, ov);
		});


		// 文字数カウントの設定、仕様が定まらない・・・。
		StringCounter.counter = this.appContext.getStringCounter();

		// TODO: 設計上どうかと思うけど面倒だから仕方ない。
		setAppContext(this.appContext);

	}

	public async initialize(): Promise<void>
	{

		// イベントの受信設定
		this.initRecievers(this.eventReciever, this.appContext);


		// コマンドの登録設定
		this.commandExecutionManager = this.registerCommands(this.appContext);

	}

	/**
	* イベントを送信するよう設定してください。
	*/
	protected abstract initEvents(eventReciever: IEventReciever): void;

	/**
	 * コマンドを登録してください。
	 */
	protected abstract registerCommands(appContext: IAppContext): IAppCommandStateUpdatable;




	private initRecievers(reciever: EventReciever, appContext: IAppContext): void
	{
		reciever.recievers.push(new AutoFormatter(appContext, this.cache, () => this.formatted()));
		reciever.recievers.push(new CacheUpdater(this.cache));
		reciever.recievers.push(new TableObserver(appContext, tables => this.onTablesUpdated(tables)));
		this.initEvents(this.eventReciever);
	}


	protected onTablesUpdated(tables: Array<MarkdownTableContent>): void
	{
		
	}

	protected formatted(): void
	{

	}
	
	
	protected onCurrentTableChanged(nv: MarkdownTableContent | undefined, ov: MarkdownTableContent | undefined)
	{
		const appContext = this.appContext;

		appContext.clearDecorate();
		
		if (nv)
		{
			const docPos = appContext.getCursor();
			if (docPos)
			{
				this.decoratorSwitcher.decorate(() => appContext.decorate(nv, docPos));
			}
		}
		
		// コマンドの有効状態を更新
		this.commandExecutionManager?.updateContents();

	}

}


class EventReciever implements IEventReciever
{
	public readonly recievers: Array<IEventReciever> = [];
	
	public textChanged(e: ITextChanged): void
	{
		this.recievers.forEach(_ => _.textChanged(e));
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.recievers.forEach(_ => _.selectChanged(e));
	}

	public otherChanged(e: any): void
	{
		this.recievers.forEach(_ => _.otherChanged(e));
	}

}



class RecieverSwitcher
{
	private formatter: IEventReciever | undefined;

	public constructor(private reciever: EventReciever)
	{

	}

	public on(): void
	{
		if(this.formatter)
		{
			this.reciever.recievers.unshift(this.formatter);
			this.formatter = undefined;
		}
	}

	public off(): void
	{
		const formatter = this.reciever.recievers.find(_ => _ instanceof AutoFormatter);
		if(formatter)
		{
			const rs = this.reciever.recievers;
			const f = rs.splice(rs.indexOf(formatter), 1);
			if(f.length)
			{
				this.formatter = f[0];
			}
		}
	}

}


class DecoratorSwitcher
{
	private _enabled: boolean = false ;

	public constructor(private readonly appContext: IAppContext)
	{

	}

	public setEnabled(enabled: boolean)
	{
		this._enabled = enabled;
		if(!enabled)
		{
			this.appContext.clearDecorate();
		}
	}

	public decorate(action: () => void)
	{
		if(this._enabled)
		{
			action();
		}
	}
}







