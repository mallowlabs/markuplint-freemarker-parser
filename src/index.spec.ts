import { nodeListToDebugMaps } from '@markuplint/parser-utils';
import { describe, test, expect } from 'vitest';

import { parse } from './parse.js';

describe('Node list', () => {
	test('a code', () => {
		const doc = parse('<div>abc${ efg }hij</div>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:6](0,5)div: <div>',
			'[1:6]>[1:9](5,8)#text: abc',
			'[1:9]>[1:17](8,16)#ps:freemarker-expression: ${␣efg␣}',
			'[1:17]>[1:20](16,19)#text: hij',
			'[1:20]>[1:26](19,25)div: </div>',
		]);
	});

	test('two codes', () => {
		const doc = parse('<div>abc${ efg }hij${ klm }</div>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:6](0,5)div: <div>',
			'[1:6]>[1:9](5,8)#text: abc',
			'[1:9]>[1:17](8,16)#ps:freemarker-expression: ${␣efg␣}',
			'[1:17]>[1:20](16,19)#text: hij',
			'[1:20]>[1:28](19,27)#ps:freemarker-expression: ${␣klm␣}',
			'[1:28]>[1:34](27,33)div: </div>',
		]);
	});

	test('two codes2', () => {
		const doc = parse('<div>abc${ efg }hij${ klm }nop</div>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:6](0,5)div: <div>',
			'[1:6]>[1:9](5,8)#text: abc',
			'[1:9]>[1:17](8,16)#ps:freemarker-expression: ${␣efg␣}',
			'[1:17]>[1:20](16,19)#text: hij',
			'[1:20]>[1:28](19,27)#ps:freemarker-expression: ${␣klm␣}',
			'[1:28]>[1:31](27,30)#text: nop',
			'[1:31]>[1:37](30,36)div: </div>',
		]);
	});

	test('two codes2 on bare', () => {
		const doc = parse('abc${ efg }hij${ klm }nop');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:4](0,3)#text: abc',
			'[1:4]>[1:12](3,11)#ps:freemarker-expression: ${␣efg␣}',
			'[1:12]>[1:15](11,14)#text: hij',
			'[1:15]>[1:23](14,22)#ps:freemarker-expression: ${␣klm␣}',
			'[1:23]>[1:26](22,25)#text: nop',
		]);
	});

	test('nest block', () => {
		const doc = parse('<#if foo>abcdef</#if>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:10](0,9)#ps:freemarker-tag: <#if␣foo>',
			'[1:10]>[1:16](9,15)#text: abcdef',
			'[1:16]>[1:22](15,21)#ps:freemarker-tag: </#if>',
		]);
	});

	test('nest block', () => {
		const doc = parse('<#if foo>abc${ foo }def</#if>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:10](0,9)#ps:freemarker-tag: <#if␣foo>',
			'[1:10]>[1:13](9,12)#text: abc',
			'[1:13]>[1:21](12,20)#ps:freemarker-expression: ${␣foo␣}',
			'[1:21]>[1:24](20,23)#text: def',
			'[1:24]>[1:30](23,29)#ps:freemarker-tag: </#if>',
		]);
	});

	test('nest block', () => {
		const doc = parse(`<#if user>
<div>\${ user.name }</div>
</#if>
`);
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:11](0,10)#ps:freemarker-tag: <#if␣user>',
			'[1:11]>[2:1](10,11)#text: ⏎',
			'[2:1]>[2:6](11,16)div: <div>',
			'[2:6]>[2:20](16,30)#ps:freemarker-expression: ${␣user.name␣}',
			'[2:20]>[2:26](30,36)div: </div>',
			'[2:26]>[3:1](36,37)#text: ⏎',
			'[3:1]>[3:7](37,43)#ps:freemarker-tag: </#if>',
			'[3:7]>[4:1](43,44)#text: ⏎',
		]);

		const el = doc.nodeList[3];
		const el2 = doc.nodeList[3]?.parentNode?.childNodes?.[0];
		expect(el?.nodeName).toBe(el2?.nodeName);
		expect(el?.uuid).toBe(el2?.uuid);
	});

	test('omitted close tag', () => {
		const doc = parse('<div></div><#assign name1=value1>');
		expect(nodeListToDebugMaps(doc.nodeList)).toStrictEqual([
			'[1:1]>[1:6](0,5)div: <div>',
			'[1:6]>[1:12](5,11)div: </div>',
			'[1:12]>[1:34](11,33)#ps:freemarker-tag: <#assign␣name1=value1>',
		]);
	});
});

describe('Tags', () => {
	test('freemarker-tag', () => {
		expect(parse('<#any>').nodeList[0]?.nodeName).toBe('#ps:freemarker-tag');
		expect(parse('</#any>').nodeList[0]?.nodeName).toBe('#ps:freemarker-tag');
	});

	test('freemarker-expression', () => {
		expect(parse('${ any }').nodeList[0]?.nodeName).toBe('#ps:freemarker-expression');
	});

	test('freemarker-comment', () => {
		expect(parse('<#-- any; -->').nodeList[0]?.nodeName).toBe('#ps:freemarker-comment');
	});
});
