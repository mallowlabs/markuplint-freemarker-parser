import { HtmlParser } from '@markuplint/html-parser';

class FreemarkerParser extends HtmlParser {
	constructor() {
		super({
			ignoreTags: [
        {
          type: 'freemarker-comment',
          start: /<#--/,
          end: /-->/,
        },
        {
          type: 'freemarker-tag',
          start: /<[#@]\w+/,
          end: />/,
        },
        {
          type: 'freemarker-tag',
          start: /<\/[#@]/,
          end: />/,
        },
        {
          type: 'freemarker-expression',
          start: /\$\{/,
          end: /\}/,
        },
			],
		});
	}
}

export const parser = new FreemarkerParser();
