
/**
 * 
 * ドキュメント変更におけるイベントを一元管理します。
 * エディタがアクティブ化されたり、コマンドが実行された場合など即時にイベントを発生させるものと、
 * テキスト変更、セレクション変更など遅延して発生させるものがあります。
 * update()が即時、lazyUpdate()が遅延でイベントを発生させます。
 * 
 * @see https://github.com/Microsoft/vscode-extension-samples/blob/master/decorator-sample/src/extension.ts
 */
export class EventUpdateManager
{
	private _timeout: NodeJS.Timer | null = null;


	public readonly updated: Array<() => void> = [];



	public constructor(public readonly interval: number = 500)
	{

	}

	/**
	 * 
	 * @param e
	 */
	public lazyUpdate(): void
	{
		this.clearTimeout();
		this._timeout = setTimeout(() => this.onUpdated(), this.interval);
	}

	/**
	 * 即時更新を実行します。
	 * @param e
	 */
	public update(): void
	{
		this.clearTimeout();
		this.onUpdated();
	}

	/**
	 * タイマーがセットしてある場合のみ即時更新します。
	 * @param e
	 */
	public hasUpdate(): void
	{
		if (this._timeout)
		{
			this.update();
		}
	}

    /**
     * オーバーライドする場合は派生元を呼び出してください。
     */
	protected onUpdated(): void
	{
		for (const updated of this.updated)
		{
			updated();
		}
	}

	public dispose()
	{
		this.clearTimeout();
	}

	public clearTimeout(): void
	{
		if (this._timeout)
		{
			clearTimeout(this._timeout);
		}
	}
}


