import { ISelection } from "./ISelection";

export interface IFormattableParameter
{
    /**
     * テーブルをフォーマットします。
     */
    format(): void;
    
    /**
     * 後でフォーカスするように要請します。
     * フォーカスが反映されるのはテキスト変更が起きた後です。
     * テキスト変更前にフォーカスするとフォーカスの位置がずれる可能性があるからです。
     * @param cellInfo
     */
	setFocusedCellInfo(...cellInfo: (ISelection | undefined)[]): void;
}
