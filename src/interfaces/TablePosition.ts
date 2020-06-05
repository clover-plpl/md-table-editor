
export class TablePosition
{

	public constructor(
		public readonly rowIndex: number,
		public readonly columnIndex: number
	)
	{

	}

	public equals(tablePosition: TablePosition): boolean
	{
		return this.rowIndex === tablePosition.rowIndex && this.columnIndex === tablePosition.columnIndex;
	}

	public add(vector: TablePosition): TablePosition
	{
		return new TablePosition(
			this.rowIndex + vector.rowIndex,
			this.columnIndex + vector.columnIndex
		);
	}

	public addRowIndex(rowIndex: number): TablePosition
	{
		return this.add(new TablePosition(rowIndex, 0));
	}

	public addColumnIndex(columnIndex: number): TablePosition
	{
		return this.add(new TablePosition(0, columnIndex));
	}

	public setRowIndex(rowIndex: number): TablePosition
	{
		return new TablePosition(rowIndex, this.columnIndex);
	}

	public setColumnIndex(columnIndex: number): TablePosition
	{
		return new TablePosition(this.rowIndex, columnIndex);
	}
}
