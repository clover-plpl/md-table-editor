import { IDocumentPosition } from "./IDocumentPosition";
import { MarkdownRange } from "./MarkdownRange";
import { ITextSource } from "./ITextSource";
import { IStringCounter } from "./IStringCounter";
import { MarkdownTableContent } from "../impls/MarkdownTableContent";

export interface IAppContext
{
	getCursor(): IDocumentPosition | undefined;
	replace(range: MarkdownRange, text: string, cursorPos: IDocumentPosition): void;
	getTextSource(): ITextSource | undefined;

	getStringCounter(): IStringCounter;
	getAppConfig(): IAppConfig;

	decorate(table: MarkdownTableContent, docPos: IDocumentPosition): void;
	clearDecorate(): void;

	scroll(docIndex: number): void;
}

export interface IAppConfig
{
	returnKey(): string;
}


