// Self-contained smoke test of the browser SDK contract. No third-party DOM package needed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const sdk = fs.readFileSync(new URL('../public/sdk/v1/fit-id.js', import.meta.url), 'utf8');
const fixture = fs.readFileSync(new URL('../public/sdk-demo.html', import.meta.url), 'utf8');
assert.match(fixture, /data-fit-id-product-code="FIT-910101"/);
assert.match(fixture, /src="\/sdk\/v1\/fit-id\.js"/);

class Node {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.nodeType = 1;
    this.children = [];
    this.attributes = {};
    this.style = {overflow: ''};
    this.handlers = {};
    this.parentNode = null;
  }
  appendChild(node) {
    this.children.push(node);
    node.parentNode = this;
    return node;
  }
  setAttribute(name, value) {this.attributes[name] = String(value);}
  getAttribute(name) {return this.attributes[name] ?? null;}
  addEventListener(name, callback) {this.handlers[name] = callback;}
  removeEventListener(name) {delete this.handlers[name];}
  focus() {this.focused = true;}
  remove() {
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(node => node !== this);
    this.parentNode = null;
  }
  querySelectorAll(selector) {
    if (selector === '[data-fit-id-product-code]') {
      return this.children.filter(node => node.getAttribute('data-fit-id-product-code'));
    }
    return [];
  }
}
const target = new Node('div');
target.setAttribute('data-fit-id-product-code', 'FIT-910101');
const head = new Node('head');
const body = new Node('body');
const mounted = [];
const document = {
  readyState: 'complete',
  head,
  body,
  activeElement: null,
  createElement: (tag) => new Node(tag),
  documentElement: new Node('html'),
  getElementById: (id) => head.children.find(node => node.id === id) || null,
  querySelectorAll: (selector) => selector === '[data-fit-id-product-code]' ? [target] : [],
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: event => {mounted.push(event.type);return true;}
};
const opened = [];
const window = {
  open: (url) => {opened.push(url);return {};}
};
class CustomEvent {
  constructor(type, options) {this.type = type;this.detail = options?.detail;}
}
vm.runInNewContext(sdk, {window, document, URL, CustomEvent, MutationObserver: undefined});
assert.equal(window.FitIDSDK.version, '1.0.0');
assert.equal(target.children.length, 1, 'mounts button from product code');
assert.equal(target.getAttribute('data-fit-id-mounted'), '1.0.0');
assert.equal(window.FitIDSDK.mountAll(document), 1);
assert.equal(target.children.length, 1, 'duplicate mount does not create extra button');
assert.equal(window.FitIDSDK.open('!bad-code!'), false, 'rejects malformed product codes');
target.children[0].handlers.click();
assert.equal(body.children.length, 1, 'click opens modal');
const overlay = body.children[0];
assert.equal(overlay.getAttribute('data-fitid-sdk-overlay'), 'v1');
const dialog = overlay.children[0];
const frame = dialog.children[1];
const iframeUrl = new URL(frame.src);
assert.equal(iframeUrl.origin, 'https://fit-id-consumer-mtvz.vercel.app');
assert.equal(iframeUrl.searchParams.get('productCode'), 'FIT-910101');
assert.equal(iframeUrl.searchParams.get('source'), 'partner-sdk');
assert.equal(body.style.overflow, 'hidden');
window.FitIDSDK.close();
assert.equal(body.children.length, 0);
assert.equal(body.style.overflow, '');
assert.equal(window.FitIDSDK.open('FIT-930102', {mode: 'new-tab'}), true);
assert.equal(new URL(opened[0]).searchParams.get('productCode'), 'FIT-930102');
assert.ok(mounted.includes('fitid:mounted'));
assert.ok(mounted.includes('fitid:open'));
assert.ok(mounted.includes('fitid:close'));
console.log('FIT ID SDK v1 smoke PASS: auto mount, code validation, iframe URL, modal, close, new tab.');
