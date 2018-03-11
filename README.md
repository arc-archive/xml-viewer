[![Build Status](https://travis-ci.org/advanced-rest-client/xml-viewer.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/xml-viewer)

## UiElements.XmlViewer component
Tag: `<xml-viewer>`

### Installation
Using bower:
```
bower install --save advanced-rest-client/xml-viewer
```

`<xml-viewer>` An XML payload viewer for the XML response

### Example
```
<xml-viewer xml="&lt;tag&gt;&lt;/tag&gt;"></xml-viewer>
```

**Note** This element uses web workers with dependencies. It expect to find
workers files in current directory in the `workers` folder.
Your build process has to ensure that this files are avaiable.

## Content actions

You can add action items in the actions bar by adding elements as a children
of this element with slot set to `content-action`.

### Example
```
<xml-viewer>
 <paper-icon-button title="Additional action" icon="arc:cached" slot="content-action"></paper-icon-button>
 <paper-icon-button title="Clear the code" icon="arc:clear" slot="content-action"></paper-icon-button>
</xml-viewer>
```

## Changes in version 2

- The element doesn't mixin text search behavior. This service is deprecated.
- It uses worker files instead of compiled worker data in elements body

### Styling

`<xml-viewer>` provides the following custom properties and mixins for styling:

Custom property | Description | Default
----------------|-------------|----------
`--xml-viewer` | Mixin applied to the element | `{}`
`--xml-viewer-comment-color` | Color of the comment section. | `#236E25`
`--xml-viewer-punctuation-color` | Color of the punctuation signs | `black`
`--xml-viewer-tag-name-color` | Color of the XML tag name | `#881280`
`--xml-viewer-attribute-name-color` | Color of the XML attribute. | `#994500`
`--xml-viewer-attribute-value-color` | Color of the attribute's value. | `#1A1AA6`
`--xml-viewer-cdata-color` | CDATA section color. | `#48A`
`--xml-viewer-document-declaration-color` | XML document declaration (header) color. | `#999`
`--xml-viewer-constant-color` | Constant (boolean, null, number) color. | `#283593`

## API
### Component properties (attributes)

#### xml
- Type: `Object`
XML data to parse and display

#### isError
- Type: `boolean`
- Default: `false`
- Read only property
True if error ocurred when parsing data

#### working
- Type: `boolean`
- Default: `false`
- Read only property
True when XML is parsing

#### showOutput
- Type: `boolean`
- Default: `false`
- Read only property
True when output should be shown.

#### errorMessage
- Type: `string`
- Read only property
An error message to display.


### Component methods

#### disconnectedCallback
- Return type: `undefined`

#### reset
- Return type: `undefined`
Resets the state of the component.
#### render
- Return type: `undefined`
Parses and renders XML data.

