/**
 * 
 * このコードに意味はありません。
 * 
 */

import { TextSource } from "./src/interfaces/TextSource";
import { MarkdownParser } from "./src/app/MarkdownParser";
import { IMarkdownContent } from "./src/interfaces/IMarkdownContent";


const text = "ABCDEFG".split('').join("\n");
const ts = new TextSource(text);
const parser = new MarkdownParser();

const targetLine = [2, 4];
const items: Array<IMarkdownContent> = [];

for (let p of parser.parse(ts))
{
	console.log(`${p.range.begin} - ${p.range.end} ... ${p}`);

	if (targetLine.findIndex(t => p.range.internal(t)) !== -1)
	{
		items.push(p);
	}
}

for (let i of items)
{
	console.log(`range = ${i.range}, text = ${i}`);
}



const contents = parser.findContents(ts, targetLine);

for (let i of contents)
{
	console.log(`range = ${i.range}, text = ${i}`);
}


function* lst()
{
	let i = 2;

	while (i < 100000)
	{
		i *= 2;
		console.log(`計算中：${i}`);
		yield i;
	}
}

let r = lst();

