import { IDocumentPosition } from "./IDocumentPosition";

export interface ITextChanged
{
	changeStartPosition: IDocumentPosition;
}

export interface ISelectChanged
{
	selectStargePosition: IDocumentPosition;
}



export interface IEventReciever
{
	textChanged(e: ITextChanged): void;
	selectChanged(e: ISelectChanged): void;
	otherChanged(e?: any): void;
}
