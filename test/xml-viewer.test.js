import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '../xml-viewer.js';


describe('<xml-viewer>', () => {
  async function basicFixture() {
    return (await fixture(`<xml-viewer></xml-viewer>`));
  }

  async function contentActionFixture() {
    return (await fixture(`<xml-viewer>
      <paper-icon-button slot="content-action"></paper-icon-button>
    </xml-viewer>`));
  }

  async function getXml(file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file, true);
      xhr.send();
      xhr.onload = (e) => {
        resolve(e.target.response);
      };
      xhr.onerror = () => {
        reject(new Error('Unable to get test xml data'));
      };
    });
  }

  describe('basic', () => {
    let xml;
    let element;

    before(async () => {
      xml = await getXml('/base/demo/valid.xml');
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.xml = xml;
    });

    it('Should parse HTML', function() {
      const output = element.shadowRoot.querySelector('output');
      const html = output.innerHTML;
      assert.isString(html);
    });
  });

  describe('content actions', () => {
    let element;
    beforeEach(async () => {
      element = await contentActionFixture();
    });

    it('Should have distributed nodes', () => {
      const nodes = element.shadowRoot.querySelector('slot').assignedNodes();
      assert.equal(nodes.length, 1);
    });
  });

  describe('_changed()', () => {
    let xml;
    let element;
    before(async () => {
      xml = await getXml('/base/demo/valid.xml');
    });

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Function is called when "xml" property chnage', () => {
      const spy = sinon.spy(element, '_changed');
      element.xml = xml;
      assert.isTrue(spy.called);
    });

    it('Calls _renderXml() with argument', () => {
      const spy = sinon.spy(element, '_renderXml');
      element.xml = xml;
      assert.equal(spy.args[0][0], xml);
    });

    it('Calls reset() when no XML', () => {
      const spy = sinon.spy(element, 'reset');
      element._changed();
      assert.isTrue(spy.called);
    });
  });

  describe('reset()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets working property', () => {
      element._working = true;
      element.reset();
      assert.isFalse(element._working);
    });

    it('Sets isError property', () => {
      element._isError = true;
      element.reset();
      assert.isFalse(element._isError);
    });

    it('Clears errorMessage', () => {
      element._errorMessage = 'test';
      element.reset();
      assert.equal(element._errorMessage, null);
    });

    it('Clears the output', () => {
      element._output.innerText = 'test';
      element.reset();
      assert.equal(element._output.innerText, '');
    });
  });

  describe('_renderXml()', () => {
    let xml;
    let element;
    before(async () => {
      xml = await getXml('/base/demo/valid.xml');
    });

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _processData()', () => {
      const spy = sinon.spy(element, '_processData');
      element._renderXml(xml);
      assert.isTrue(spy.called);
    });
  });

  describe('Errored XML', () => {
    let xml;
    let element;
    before(async () => {
      xml = await getXml('/base/demo/invalid.xml');
    });

    beforeEach(async () => {
      element = await basicFixture();
      element.xml = xml;
      await nextFrame();
    });

    it('Renders error message', () => {
      const error = element.shadowRoot.querySelector('error-message');
      assert.ok(error);
    });

    it('Sets _isError', () => {
      assert.isTrue(element._isError);
    });

    it('Sets _working', () => {
      assert.isFalse(element._working);
    });

    it('Sets _errorMessage', () => {
      assert.typeOf(element._errorMessage, 'string');
    });

    it('Sets output', () => {
      const txt = element._output.innerText.trim();
      assert.equal(txt.indexOf('<feed xml:base'), 0);
    });
  });

  describe('_handleDisplayClick()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._output.innerHTML = `
      <div class="top">
        <div class="expansion-not-set">
          <div class="parent-collapse-marker" colapse-marker="true">
            <div class="child-collapse-marker"></div>
          </div>
        </div>
        <div class="expansion-set-true" data-expanded="true">
          <div class="parent-collapse-marker-set-true" colapse-marker="true">
            <div class="child-collapse-marker-set-true"></div>
          </div>
        </div>
        <div class="expansion-set-false" data-expanded="false">
          <div class="parent-collapse-marker-set-false" colapse-marker="true">
            <div class="child-collapse-marker-set-false"></div>
          </div>
        </div>
      </div>
      `;
    });

    it('Does nothing when no target', () => {
      element._handleDisplayClick({});
      // no error
    });

    it('Toggles unset from child', () => {
      const node = element._output.querySelector('.child-collapse-marker');
      node.click();
      const target = element._output.querySelector('.expansion-not-set');
      assert.equal(target.dataset.expanded, 'false');
    });

    it('Toggles unset from parent', () => {
      const node = element._output.querySelector('.parent-collapse-marker');
      node.click();
      const target = element._output.querySelector('.expansion-not-set');
      assert.equal(target.dataset.expanded, 'false');
    });

    it('Toggles set to "true" from child', () => {
      const node = element._output.querySelector('.child-collapse-marker-set-true');
      node.click();
      const target = element._output.querySelector('.expansion-set-true');
      assert.equal(target.dataset.expanded, 'false');
    });

    it('Toggles set to "true" from parent', () => {
      const node = element._output.querySelector('.parent-collapse-marker-set-true');
      node.click();
      const target = element._output.querySelector('.expansion-set-true');
      assert.equal(target.dataset.expanded, 'false');
    });

    it('Toggles set to "false" from child', () => {
      const node = element._output.querySelector('.child-collapse-marker-set-false');
      node.click();
      const target = element._output.querySelector('.expansion-set-false');
      assert.equal(target.dataset.expanded, 'true');
    });

    it('Toggles set to "false" from parent', () => {
      const node = element._output.querySelector('.parent-collapse-marker-set-false');
      node.click();
      const target = element._output.querySelector('.expansion-set-false');
      assert.equal(target.dataset.expanded, 'true');
    });
  });
});
