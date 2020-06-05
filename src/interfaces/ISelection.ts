import { IDocumentPosition } from "./IDocumentPosition";

export interface ISelection
{
    readonly sPos: IDocumentPosition;
    readonly ePos?: IDocumentPosition;
}
