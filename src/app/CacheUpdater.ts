import { IEventReciever, ITextChanged, ISelectChanged } from "../interfaces/IEventReciever";
import { EventUpdateManager } from "./EventUpdateManager";
import { TableCacheManager } from "./TableCacheManager";



export class CacheUpdater implements IEventReciever
{
	private updateManager: EventUpdateManager;

	public constructor(protected readonly cache: TableCacheManager)
	{

		this.updateManager = new EventUpdateManager(200);
		this.updateManager.updated.push(() =>
		{
			this.onUpdated();
		});

	}

	public textChanged(e: ITextChanged): void
	{
		this.updateManager.lazyUpdate();
	}

	public selectChanged(e: ISelectChanged): void
	{
		const table = this.cache.cachedItem;
		const pos = e.selectStargePosition;

		// 同じテーブル内のセレクションなら同じテーブルで即更新
		if (table)
		{
			if (pos && table.range.internal(pos.docIndex))
			{
				// 現在のアイテムで更新(イベントを発生させるため)
				this.cache.updateCacheItem(table);
				return;
			}
		}

		// それ以外は単純に即更新
		this.updateManager.update();
	}


	public otherChanged(e: any): void
	{
		this.updateManager.lazyUpdate();
	}

	private onUpdated()
	{
		this.cache.newItem;
	}
}



/*
export class CacheUpdater implements IEventReciever
{
	private updateManager: EventUpdateManager;

	public constructor(protected readonly cache: TableCacheManager)
	{

		this.updateManager = new EventUpdateManager(200);
		this.updateManager.updated.push(() =>
		{
			this.onUpdated();
		});

	}

	public textChanged(e: ITextChanged): void
	{
		this.logic(false);
	}

	public selectChanged(e: ISelectChanged): void
	{
		this.logic(true, e.selectStargePosition)
	}


	public otherChanged(e: any): void
	{
		this.logic(false);
	}

	private logic(isSelected: boolean, pos?: IDocumentPosition)
	{
		const table = this.cache.cachedItem;

		if (table)
		{
			if (isSelected && pos && table.range.internal(pos.docIndex))
			{
				// 現在のアイテムで更新(イベントを発生させるため)
				this.cache.updateCacheItem(table);
				return;
			}

			//即undfinedでクリア
			this.cache.clear();

		}
	
		// 遅延更新を要求
		this.updateManager.lazyUpdate();
	}

	private onUpdated()
	{




		this.cache.newItem;
	}
}
*/