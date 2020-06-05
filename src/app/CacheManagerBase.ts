
export class CacheManagerBase<T>
{

	private _cachedItem: T | undefined;
	public readonly cacheItemUpdated: Array<(newValue: T | undefined, oldValue: T | undefined) => void> = [];

	/**
	 * キャッシュされたアイテムを取得します。無ければundefinedが返ります。
	 */
	public get cachedItem(): T | undefined
	{
		return this._cachedItem;
	}

	/**
	 * キャッシュされたアイテム、無ければ新規作成して返します。
	 */
	public get item(): T | undefined
	{
		return this._cachedItem || this.newItem;
	}

	/**
	 * 新しくアイテムを生成します。その後updateCacheItem()で更新されることに注意してください。
	 * newItemFactoryがundefinedの場合はそのままundefinedが返ります。
	 */
	public get newItem(): T | undefined
	{
		const item = this.newItemFactory ? this.newItemFactory() : undefined;
		return this.updateCacheItem(item);
	}

	/**
	 * @param newItemFactory 新しくアイテムを作成する必要があるときに呼び出します。
	 */
	public constructor(protected readonly newItemFactory?: () => T | undefined)
	{

	}

	/**
	 * アイテムを更新します。
	 * @param item
	 */
	public updateCacheItem(item: T | undefined): T | undefined
	{
		const ov = this._cachedItem;
		const nv = item;
		this._cachedItem = item;
		
		this.onCacheItemUpdated(nv, ov);

		return item;
	}
	

	/**
	 * 
	 * @param nv
	 * @param ov
	 */
	protected onCacheItemUpdated(nv: T | undefined, ov: T | undefined): void
	{
		
		if(ov === undefined && nv === undefined)
		{
			return;
		}
		
		for (const up of this.cacheItemUpdated)
		{
			up(nv, ov);
		}
	}

	public clear(): void
	{
		this.updateCacheItem(undefined);
	}

	public hasCachedItem(): boolean
	{
		return this._cachedItem !== undefined;
	}

}




