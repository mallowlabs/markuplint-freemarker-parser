# markuplint-freemarker-parser

Use [markuplint](https://markuplint.dev/) with [**FreeMarker**](https://freemarker.apache.org/).

## Install

```shell
$ npm install -D mallowlabs/markuplint-freemarker-parser

```

## Usage

Add `parser` option to your [configuration](https://markuplint.dev/configuration/#properties/parser).

```json
{
  "parser": {
    ".ftl.html$": "markuplint-freemarker-parser"
  }
}
```
