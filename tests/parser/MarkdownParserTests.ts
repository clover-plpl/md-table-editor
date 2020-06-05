import assert = require('assert');
import { TextSource } from '../../src/interfaces/TextSource';
import { MarkdownParser } from '../../src/app/MarkdownParser';


import { readFileSync } from 'fs';
import { MarkdownTableContent } from '../../src/impls/MarkdownTableContent';

describe("Test Suite 1", () => {


	it("1", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const parser = new MarkdownParser();

		const txt = [...parser.parse(ts)].map(p => (<any>p).text || 'NULL').join('');
		
		assert.equal(txt, 'ABCDEFG');
	});



	it("111", () =>
	{
		const rf = readFileSync('./tests/resources/test.md', 'utf8');
		const text = rf.toString();
		const ts = new TextSource(text);
		const parser = new MarkdownParser();

		let a = "";
		let b = "";

		for (const result of parser.parse(ts))
		{
			if (result instanceof MarkdownTableContent)
			{
				a = result.headers.cells[0].word;
				b = result.rows[2].cells[1].word;
			}
		}

		assert.equal(a, 'A');
		assert.equal(b, 'p');
	});

});





