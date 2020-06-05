import assert = require('assert');
import { readFileSync } from 'fs';
import { TextSource } from '../../src/interfaces/TextSource';
import { MarkdownParser } from '../../src/app/MarkdownParser';
import { MarkdownTableContent } from '../../src/impls/MarkdownTableContent';

describe("Test Suite 1", () =>
{
	it('format', () =>
	{
		const rf = readFileSync('./tests/resources/test.md', 'utf8');
		const text = rf.toString();
		const ts = new TextSource(text);
		const parser = new MarkdownParser();
		const table = parser.findContent(ts, 5) as MarkdownTableContent;

	});
});
