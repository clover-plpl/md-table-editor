import assert = require('assert');

import { TextReader } from '../../src/interfaces/TextReader';
import { TextSource } from '../../src/interfaces/TextSource';
import { readFileSync } from 'fs';



describe("TextReader Tests", () =>
{

	it("1", () =>
	{
		const rf = readFileSync('./tests/reader/test-markdown.md', 'utf8');
		const text = rf.toString();
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		while (tr.moveNext());

		const pos = tr.position;
		const lines = text.split("\n").length;

		assert.equal(pos, lines);

	});

	it("2", () =>
	{
		const rf = readFileSync('./tests/reader/test-markdown.md', 'utf8');
		const text = rf.toString();
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		while (tr.moveNext());
		while (tr.moveBack());
		assert.equal(tr.position, -1);

	});


	it("3-0", () =>
	{
		const text = "A\nB\nC";
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		assert.ok(tr.moveNext());
		assert.ok(tr.moveNext());
		assert.ok(tr.moveNext());
		assert.ok(!tr.moveNext());

	});

	it("3", () =>
	{
		const text = "A\nB\nC";
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		assert.equal(tr.current, 'A');
		assert.equal(tr.position, 0);
		
		tr.moveNext();
		assert.equal(tr.current, 'B');
		assert.equal(tr.position, 1);

		tr.moveNext();
		assert.equal(tr.current, 'C');
		assert.equal(tr.position, 2);

		tr.moveNext();
		assert.equal(tr.position, 3);

		tr.moveNext();
		assert.equal(tr.position, 3);

		tr.moveBack();
		assert.equal(tr.current, 'C');
		assert.equal(tr.position, 2);


		tr.moveBack();
		assert.equal(tr.current, 'B');
		assert.equal(tr.position, 1);

		tr.moveBack();
		assert.equal(tr.current, 'A');
		assert.equal(tr.position, 0);

		tr.moveBack();
		assert.equal(tr.position, -1);

		tr.moveBack();
		assert.equal(tr.position, -1);
	});


	it("4", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'C');
		assert.equal(tr.position, 2);

		const cp = tr.copy();
		assert.equal(cp.current, 'C');
		assert.equal(cp.position, 2);

		cp.moveNext();
		assert.equal(cp.current, 'D');
		assert.equal(cp.position, 3);

		// trに変更はない
		assert.equal(tr.current, 'C');
		assert.equal(tr.position, 2);

	});


	it("copy() - moveNext()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

		const cp = tr.copy();
		const rev: Array<string> = [];
		while (cp.moveNext()) rev.push(cp.current);
		assert.equal(rev.join(''), 'EFG');

	});

	it("copyNext()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

		const cp = tr.copyNextMode();
		const rev: Array<string> = [];
		while (cp.moveNext()) rev.push(cp.current);
		assert.equal(rev.join(''), 'DEFG');

	});

	it("copy() - moveBack()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

		const cp = tr.copy();
		const rev: Array<string> = [];
		while (cp.moveBack()) rev.push(cp.current);
		assert.equal(rev.join(''), 'CBA');

	});

	it("copyBack()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

		const cp = tr.copyBackMode();
		const rev: Array<string> = [];
		while (cp.moveBack()) rev.push(cp.current);
		assert.equal(rev.join(''), 'DCBA');

	});


	it("copyBack from end point", () =>
	{

		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		// 終点からのー
		while (tr.moveNext());

		// copyBack()
		const cp = tr.copyBackMode();
		const rev: Array<string> = [];
		while (cp.moveBack()) rev.push(cp.current);
		assert.equal(rev.join(''), 'GFEDCBA');

	});


	it("seek()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		let r = tr.seek(6);
		assert.equal(r, true);
		assert.equal(tr.current, 'G');

		r = tr.seek(5);
		assert.equal(r, true);
		assert.equal(tr.current, 'F');

		// 終点
		r = tr.seek(7);
		assert.equal(r, false);

		// 終点を超える
		r = tr.seek(20);
		assert.equal(r, false);

		// その時は終点(7)になる
		assert.equal(tr.position, 7);


		r = tr.seek(0);
		assert.equal(r, true);
		assert.equal(tr.current, 'A');

		// 始点
		tr.seek(4);
		r = tr.seek(-1);
		assert.equal(r, false);

		// 始点を下回る
		tr.seek(4);
		r = tr.seek(-7);
		assert.equal(r, false);

		// その時は始点(-1)になる
		assert.equal(tr.position, -1);

	});

	it("safeSeek()", () =>
	{

		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		let r = tr.safeSeek(3);
		assert.equal(r, true);
		assert.equal(tr.current, 'D');

		r = tr.safeSeek(10);
		assert.equal(r, false);
		assert.equal(tr.position, 3);
		assert.equal(tr.current, 'D');

		r = tr.safeSeek(-2);
		assert.equal(r, false);
		assert.equal(tr.position, 3);

		r = tr.safeSeek(2);
		assert.equal(r, true);
		assert.equal(tr.position, 2);
		
	});

	it("createRollbackable()", () =>
	{
		const text = "ABCDEFG".split('').join("\n");
		const ts = new TextSource(text);
		const tr = new TextReader(ts);

		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		tr.moveNext();
		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

		const rb = tr.createRollbackable();
		tr.moveNext();
		tr.moveNext();


		assert.equal(tr.current, 'F');
		assert.equal(tr.position, 5);

		rb.rollback();

		assert.equal(tr.current, 'D');
		assert.equal(tr.position, 3);

	});








});
