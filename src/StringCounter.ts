import { IStringCounter } from "./interfaces/IStringCounter";

export class StringCounter
{

	public static counter: IStringCounter = str => str.length;

	public static stringCount(str: string): number
	{
		return this.counter(str);
	}

}