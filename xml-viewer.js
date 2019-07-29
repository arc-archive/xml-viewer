/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-spinner/paper-spinner.js';
import '@polymer/iron-icon/iron-icon.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@advanced-rest-client/error-message/error-message.js';

const SafeHtmlUtils = {
  AMP_RE: new RegExp(/&/g),
  GT_RE: new RegExp(/>/g),
  LT_RE: new RegExp(/</g),
  SQUOT_RE: new RegExp(/'/g),
  QUOT_RE: new RegExp(/"/g),
  htmlEscape: function(s) {
    if (s.indexOf('&') !== -1) {
      s = s.replace(SafeHtmlUtils.AMP_RE, '&amp;');
    }
    if (s.indexOf('<') !== -1) {
      s = s.replace(SafeHtmlUtils.LT_RE, '&lt;');
    }
    if (s.indexOf('>') !== -1) {
      s = s.replace(SafeHtmlUtils.GT_RE, '&gt;');
    }
    if (s.indexOf('"') !== -1) {
      s = s.replace(SafeHtmlUtils.QUOT_RE, '&quot;');
    }
    if (s.indexOf('\'') !== -1) {
      s = s.replace(SafeHtmlUtils.SQUOT_RE, '&#39;');
    }
    return s;
  }
};
/**
 * `<xml-viewer>` An XML payload viewer for the XML response
 *
 * ### Example
 * ```
 * <xml-viewer xml="&lt;tag&gt;&lt;/tag&gt;"></xml-viewer>
 * ```
 *
 * **Note** This element uses web workers with dependencies. It expect to find
 * workers files in current directory in the `workers` folder.
 * Your build process has to ensure that this files are avaiable.
 *
 * ## Content actions
 *
 * You can add action items in the actions bar by adding elements as a children
 * of this element with slot set to `content-action`.
 *
 * ### Example
 * ```
 * <xml-viewer>
 *  <paper-icon-button title="Additional action" icon="arc:cached" slot="content-action"></paper-icon-button>
 *  <paper-icon-button title="Clear the code" icon="arc:clear" slot="content-action"></paper-icon-button>
 * </xml-viewer>
 * ```
 *
 * ## Changes in version 2
 *
 * - The element doesn't mixin text search behavior. This service is deprecated.
 * - It uses worker files instead of compiled worker data in elements body
 *
 * ### Styling
 *
 * `<xml-viewer>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--xml-viewer` | Mixin applied to the element | `{}`
 * `--xml-viewer-comment-color` | Color of the comment section. | `#236E25`
 * `--xml-viewer-punctuation-color` | Color of the punctuation signs | `black`
 * `--xml-viewer-tag-name-color` | Color of the XML tag name | `#881280`
 * `--xml-viewer-attribute-name-color` | Color of the XML attribute. | `#994500`
 * `--xml-viewer-attribute-value-color` | Color of the attribute's value. | `#1A1AA6`
 * `--xml-viewer-cdata-color` | CDATA section color. | `#48A`
 * `--xml-viewer-document-declaration-color` | XML document declaration (header) color. | `#999`
 * `--xml-viewer-constant-color` | Constant (boolean, null, number) color. | `#283593`
 *
 * @customElement
 * @polymer
 * @memberof UiElements
 * @demo demo/index.html
 */
export class XmlViewer extends LitElement {
  static get styles() {
    return css`:host {
      display: block;
      color: black;
      cursor: text;
      user-select: text;
      overflow: auto;
      word-wrap: break-word;
    }

    [hidden] {
      display: none !important;
    }

    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      /* Preferred icon size */
      display: inline-block;
      line-height: 1;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
    }

    .prettyPrint {
      font-family: monospace;
      font-size: 15px;
    }

    .arrowEmpty {}

    .node {
      margin: 1px 0px;
    }

    .opened {}

    .comment {
      color: var(--xml-viewer-comment-color, #236E25);
    }

    .punctuation {
      color: var(--xml-viewer-punctuation-color, black);
    }

    .tagname {
      color: var(--xml-viewer-tag-name-color, #881280);
    }

    .attname {
      color: var(--xml-viewer-attribute-name-color, #994500);
    }

    .attribute {
      color: var(--xml-viewer-attribute-value-color, #1A1AA6);
    }

    .cdata {
      color: var(--xml-viewer-cdata-color, #48A);
    }

    .cdata *[collapsible] {
      white-space: pre;
    }

    .arrowExpanded,
    .arrowEmpty {
      display: inline-block;
      width: 24px;
      height: 18px;
    }

    .processing {
      color: var(--xml-viewer-document-declaration-color, #999);
    }

    .inline,
    .inline > div {
      display: inline-block;
      text-indent: 0px;
    }

    .node.opened > arrowEmpty {
      text-indent: 0;
      font-size: 10px;
      letter-spacing: 0.1em;
      width: 21px;
      margin-left: 3px;
      margin-right: 3px;
    }

    .nodeMargin {
      margin-left: 44px;
    }

    .collapseIndicator {
      display: none;
      margin: 0px 1px;
      text-indent: 0px;
    }

    *[colapse-marker] {
      -webkit-user-select: none;
      cursor: pointer;
    }

    *[less] {
      display: inline-block;
    }

    *[more] {
      display: none;
    }

    *[data-expanded="false"] .arrowEmpty {
      display: none;
    }

    *[data-expanded="false"] *[less] {
      display: none;
    }

    *[data-expanded="false"] *[more] {
      display: inline-block;
    }

    *[data-expanded="false"] *[collapsible] {
      display: none !important;
    }

    *[data-expanded="false"] *[collapse-indicator] {
      display: inline-block !important;
    }

    .value.number,
    .value.null,
    .value.boolean {
      color: var(--xml-viewer-constant-color, #283593);
    }

    .arc-search-mark.selected {
      background-color: #ff9632;
    }

    .actions-panel {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .actions-panel.hidden {
      display: none;
    }

    .spinner {
      position: relative;
    }

    paper-spinner {
      position: absolute;
    }

    .deprecation {
      color: #9E9E9E;
    }`;
  }

  render() {
    const { xml, _working, _isError, errorMessage, hideDeprecationMessage } = this;
    const showOutput = !_working && !!xml;
    return html`
    <p ?hidden="${hideDeprecationMessage}" class="deprecation">
      This view is retired and will be replaced around June 2019. <a target="_blank" href="https://restforchrome.blogspot.com/2019/02/deprecation-of-xml-viewer-component.html">Learn more.</a>
    </p>
    <div class="${this._computeActionsPanelClass(showOutput)}">
      <slot name="content-action"></slot>
    </div>
    <div class="spinner">
      <paper-spinner .active="${_working}"></paper-spinner>
    </div>
    <error-message ?hidden="${!_isError}">
      <p>There was an error parsing XML.</p>
      <p>${errorMessage}</p>
      <p>Rendering unprocessed data.</p>
    </error-message>
    <output ?hidden="${!showOutput}" @click="${this._handleDisplayClick}"></output>`;
  }

  static get properties() {
    return {
      /**
       * XML data to parse and display
       */
      xml: { type: Object },
      /**
       * True if error ocurred when parsing data
       */
      _isError: { type: Boolean },
      /**
       * True when XML is parsing
       */
      _working: { type: Boolean },
      /**
       * An error message to display.
       */
      _errorMessage: { type: String },
      /**
       * When set deprecation message won't be rendered.
       */
      hideDeprecationMessage: { type: Boolean },
      /**
       * Used in generating HTML output to prefix CSS classes for CSS scopes.
       */
      cssPrefix: { type: String }
    };
  }

  get _output() {
    return this.shadowRoot.querySelector('output');
  }

  get xml() {
    return this._xml;
  }

  set xml(value) {
    const old = this._xml;
    if (old === value) {
      return;
    }
    this._xml = value;
    this._changed(value);
  }

  get isError() {
    return this._isError;
  }

  get _isError() {
    return this.__isError;
  }

  set _isError(value) {
    const old = this.__isError;
    if (old === value) {
      return;
    }
    this.__isError = value;
    this.requestUpdate('_isError', old);
    this.dispatchEvent(new CustomEvent('iserror-changed', {
      detail: {
        value
      }
    }));
  }

  get working() {
    return this._working;
  }

  get _working() {
    return this.___working;
  }

  set _working(value) {
    const old = this.___working;
    if (old === value) {
      return;
    }
    this.___working = value;
    this.requestUpdate('_working', old);
    this.dispatchEvent(new CustomEvent('working-changed', {
      detail: {
        value
      }
    }));
  }

  constructor() {
    super();
    this.cssPrefix = 'xml-viewer style-scope ';
  }

  /**
   * Handler for the xml attribute change.
   *
   * @param {String} xml Changed value.
   */
  _changed(xml) {
    if (!xml) {
      this.reset();
      return;
    }
    this._renderXml(xml);
  }
  /**
   * Resets the state of the component.
   */
  reset() {
    this._working = false;
    this._isError = false;
    this._errorMessage = null;
    const out = this._output;
    if (out) {
      this._output.innerText = '';
    }
  }
  /**
   * Parses and renders XML data.
   *
   * @param {String} xml XML string to parse and render.
   */
  _renderXml(xml) {
    this.reset();
    this._working = true;
    try {
      const data = this._processData(xml);
      this._working = false;
      this._output.innerHTML = data;
    } catch (e) {
      this._parsingError(e, xml);
    }
  }
  /**
   * Handles parsing errors
   *
   * @param {Error} e
   * @param {String} xml Original XML string
   */
  _parsingError(e, xml) {
    this._isError = true;
    this._working = false;
    const message = e.message || 'Invalid XML value.';
    const err = message.replace('Uncaught Error: ', '');
    this._errorMessage = err;
    const out = this._output;
    if (out) {
      this._output.innerText = xml || '';
    }
  }
  /**
   * Handles clicks on the rendered items.
   * Provides support for expand / collapse functions.
   *
   * @param {Event} e
   */
  _handleDisplayClick(e) {
    if (!e.target) {
      return;
    }
    let target = e.target;
    if (!target.getAttribute('colapse-marker')) {
      target = target.parentNode;
      if (!target || !target.getAttribute('colapse-marker')) {
        return;
      }
    }
    target = target.parentNode;
    const expanded = target.dataset.expanded;
    if (!expanded || expanded === 'true') {
      target.dataset.expanded = 'false';
    } else {
      target.dataset.expanded = 'true';
    }
  }

  // Computes CSS class for the content actions pane.
  _computeActionsPanelClass(showOutput) {
    let clazz = 'actions-panel';
    if (!showOutput) {
      clazz += ' hidden';
    }
    return clazz;
  }

  _processData(xml) {
    const parser = new DOMParser();
    const result = parser.parseFromString(xml, 'application/xml');
    const err = result.querySelector('parsererror');
    if (err) {
      const message = err.innerText;
      throw new Error(message);
    }
    return this._getHTML(result);
  }

  _getHTML(doc) {
    const nodes = doc.childNodes;
    const nodesCnt = nodes.length;
    if (nodesCnt === 0) {
      return 'no xml';
    }
    let result = '<div class="' + this.cssPrefix + 'prettyPrint" data-expanded="true">';
    for (let i = 0; i < nodesCnt; i++) {
      result += this._parse(nodes.item(i));
    }
    result += '</div>';
    return result;
  }

  _parse(node) {
    const cssPrefix = this.cssPrefix;
    let parsed = '';
    const type = node.nodeType;
    switch (type) {
      case 1:
        // ELEMENT_NODE, value null
        parsed += this._parseElement(node);
        break;
      case 3:
        // TEXT_NODE, content of node
        {
          let value = node.nodeValue;
          value = SafeHtmlUtils.htmlEscape(value);
          if (value === '') {
            return '';
          }
          parsed += this._parseValue(value);
        }
        break;
      case 4:
        // CDATA_SECTION_NODE, content of node
        parsed += '<span colapse-marker="true" class="' + cssPrefix +
          '"><iron-icon more icon="arc:expand-more" class="' + cssPrefix + '"></iron-icon>' +
          '<iron-icon less icon="arc:expand-less" class="' + cssPrefix + '"></iron-icon></span>';
        parsed += '<span class="' + cssPrefix + 'cdata">&lt;![CDATA[</span>';
        parsed += '<div collapsible class="' + cssPrefix + '">';
        // parsed += this._urlify(SafeHtmlUtils.htmlEscape(node.nodeValue));
        parsed += SafeHtmlUtils.htmlEscape(node.nodeValue);
        parsed += '</div><span class="' + cssPrefix + 'cdata">]]&gt;</span>';
        break;
      case 7:
        // document declaration
        parsed += '<div class="' + cssPrefix + 'processing">&lt;?xml ' + node.nodeValue +
          ' ?&gt;</div>';
        break;
      case 8:
        // COMMENT_NODE, comment text
        parsed += '<div class="' + cssPrefix + 'comment">&lt;--';
        parsed += node.nodeValue;
        parsed += '--&gt</div>';
        break;
    }
    parsed = '<div class="' + cssPrefix + 'node">' + parsed + '</div>';
    return parsed;
  }

  _parseValue(value) {
    value = value.trim();
    let css = 'value';
    if (!isNaN(value)) {
      css += ' number';
    } else if (value === 'true' || value === 'false') {
      css += ' boolean';
    } else if (value === 'null') {
      css += ' null';
    }
    value = '<span class="' + this.cssPrefix + css + '">' + value + '</span>';
    return value;
  }

  _parseElement(node) {
    const cssPrefix = this.cssPrefix;
    const childrenCount = node.childNodes.length;
    let parsed = '';
    let showArrows = false;

    if (childrenCount > 1) {
      parsed += '<span colapse-marker="true" class="' + cssPrefix +
        '"><iron-icon more icon="arc:expand-more" class="' + cssPrefix + '"></iron-icon>' +
        '<iron-icon less icon="arc:expand-less" class="' + cssPrefix + '"></iron-icon></span>';
      showArrows = true;
    }
    parsed += '<span class="' + cssPrefix + 'punctuation">&lt;</span>';
    parsed += '<span class="' + cssPrefix + 'tagname">' + node.nodeName + '</span>';
    parsed += this._parseAttributes(node);
    if (childrenCount > 0) {
      const children = node.childNodes;
      parsed += '<span class="' + cssPrefix + 'punctuation">&gt;</span>';

      let showInline = false;
      if (childrenCount === 1 && children.item(0).nodeType === 3) {
        // simple: only one child - text - show response inline.
        showInline = true;
      }
      if (showInline) {
        parsed += '<div class="' + cssPrefix + 'inline">';
      } else {
        parsed += '<div collapse-indicator colapse-marker="true" class="' + cssPrefix +
          'collapseIndicator">...</div>';
        parsed += '<div collapsible class="' + cssPrefix + 'nodeMargin">';
      }
      for (let i = 0; i < childrenCount; i++) {
        parsed += this._parse(children.item(i));
      }

      parsed += '</div>';

      if (showArrows) {
        parsed += '<span arrowEmpty class="' + cssPrefix + 'arrowEmpty">&nbsp;</span>';
      }
      parsed += '<span class="' + cssPrefix + 'punctuation end">&lt;/</span>';
      parsed += '<span class="' + cssPrefix + 'tagname end">' + node.nodeName + '</span>';
      parsed += '<span class="' + cssPrefix + 'punctuation">&gt;</span>';
    } else {
      parsed += '<span class="' + cssPrefix + 'punctuation"> /&gt;</span>';
    }
    return parsed;
  }

  _parseAttributes(node) {
    let parsed = '';
    const attr = node.attributes;
    if (attr !== null && attr.length > 0) {
      for (let i = 0; i < attr.length; i++) {
        parsed += ' ' + this._getAttributesString(attr.item(i));
      }
    }
    return parsed;
  }

  _getAttributesString(attr) {
    const cssPrefix = this.cssPrefix;
    let data = '<span class="' + cssPrefix + 'attname">';
    let name = attr.name;
    name = SafeHtmlUtils.htmlEscape(name);
    data += name;
    data += '</span>';
    data += '<span class="' + cssPrefix + 'punctuation">=</span>';
    data += '<span class="' + cssPrefix + 'attribute">&quot;';
    let value = attr.value;
    value = SafeHtmlUtils.htmlEscape(value);
    data += value;
    data += '&quot;</span>';
    return data;
  }
}
/* eslint-disable wc/no-invalid-element-name */
window.customElements.define('xml-viewer', XmlViewer);
