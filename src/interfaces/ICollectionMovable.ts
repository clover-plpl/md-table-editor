
export interface IMovableCollection<T>
{

	move(targetItem: T, items: ReadonlyArray<T>, pos?: number): void;
	move(targetIndex: number, itemIndexes: ReadonlyArray<number>, pos?: number): void;

}

export class MovableArray<T> implements IMovableCollection<T>
{

	public constructor(public readonly arr: Array<T>)
	{

	}

	public move(targetItem: T, items: ReadonlyArray<T>, pos?: number): void;
	public move(targetIndex: number, itemIndices: ReadonlyArray<number>, pos?: number): void;
	public move(targetIndex: any, items: any, pos?: number)
	{
		if (typeof (targetIndex) === 'number')
		{
			this.moveByIndex(targetIndex, items, pos);
		}
		else
		{
			this.moveByItem(targetIndex, items);
		}
	}

	/**
	 * 
	 * @param targetIndex
	 * @param itemIndices
	 * @param pos targetIndexの前に挿入される。前に挿入するなら-1を指定。
	 */
	private moveByIndex(targetIndex: number, itemIndices: ReadonlyArray<number>, pos: number = 0): void
	{

		// 削除するアイテムを取得
		const removeItems = this.getIndexItems(itemIndices);

		// targetIndex未満のインデックスのカウント
		const minCount = itemIndices.reduce((pv, cv, idx) => (cv < targetIndex) ? pv + 1 : pv, 0);

		// 削除する
		this.removeIndexItems(itemIndices);

		// 座標を修正
		const ti = this.floatIndex(targetIndex - minCount + pos);

		// 追加する
		this.insert(ti, removeItems);

	}


	private moveByItem(targetItem: T, items: ReadonlyArray<T>): void
	{

	}


	public getIndexItems(itemIndices: ReadonlyArray<number>): Array<T>
	{
		// 削除するアイテムを取得
		return this.arr.filter((v, i) => itemIndices.indexOf(i) !== -1);
	}

	public removeIndexItems(itemIndices: ReadonlyArray<number>): Array<T>
	{
		// 下から順に削除
		return itemIndices.concat().sort((a, b) => a + b).reduce((pv, cv) =>
		{
			if (itemIndices.indexOf(cv) !== -1) pv.push(...this.arr.splice(cv, 1));
			return pv;
		}, <Array<T>>[]).reverse();
	}

	public insert(index: number, items: ReadonlyArray<T>): void
	{
		this.arr.splice(index, 0, ...items);
	}


	public containsIndex(index: number): boolean
	{
		return index >= 0 && index < this.count();
	}

	public floatIndex(index: number): number
	{
		return Math.max(0, Math.min(this.count(), index));
	}


	public count(): number
	{
		return this.arr.length;
	}
	

}

