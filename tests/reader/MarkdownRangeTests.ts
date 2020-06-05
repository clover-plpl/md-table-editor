import assert = require('assert');
import { MarkdownRange } from '../../src/interfaces/MarkdownRange';
import { TextSource } from '../../src/interfaces/TextSource';
import { TextReader } from '../../src/interfaces/TextReader';
import { TextReaderHelper } from '../../src/app/MarkdownParser';

describe("Test Suite 1", () => {

	it("1", () =>
	{

		let range = new MarkdownRange(10, 20);
		assert.equal(range.length, 10);
		assert.equal(range.isBack, false);
		assert.equal(range.isNext, true);
		assert.equal(range.isZero, false);

		range = new MarkdownRange(20, 10);
		assert.equal(range.length, -10);
		assert.equal(range.isBack, true);
		assert.equal(range.isNext, false);
		assert.equal(range.isZero, false);

		range = new MarkdownRange(10, 10);
		assert.equal(range.length, 0);
		assert.equal(range.isBack, false);
		assert.equal(range.isNext, false);
		assert.equal(range.isZero, true);
		

	});

	it("2", () =>
	{
		const ts = new TextSource("ABCDEFg".split('').join("\n"));
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'C');
		assert.equal(tr.position, 2);

		const rf = TextReaderHelper.createRangeFactory(tr);
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'E');
		assert.equal(tr.position, 4);

		const range = rf.create();
		assert.equal(range.begin, 2);
		assert.equal(range.end, 4);
		assert.equal(range.length, 2);
		
		

	});


});
