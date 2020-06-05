import { IMarkdownContent } from "./IMarkdownContent";
import { TextReader } from "./TextReader";

export interface IMarkdownContentParser<TContent extends IMarkdownContent>
{

	/**
	 * 一つ分の解析だけ行います。
	 */
	parse(textReader: TextReader): TContent | undefined;

    /**
     * 進みすぎたmoveNext()を責任をもって修正します。
     * 例えば、moveNext()がコンテントの範囲を超えて進みすぎた場合、moveBack()を呼び出します。
     */
	adjust(textReader: TextReader): void;

}
