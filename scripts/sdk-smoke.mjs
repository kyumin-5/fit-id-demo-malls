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
    if (selector === '[data-fit-id-product-code],[data-fit-id-merchant-product-id]') {
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
const listeners={};
const consumerFrame={};
const window = {
  open: (url) => {opened.push(url);return {};},
  addEventListener:(name,handler)=>{listeners[name]=handler;},
  fetch:async(url)=>({ok:true,json:async()=>({productCode:'FIT-123456'})})
};
class CustomEvent {
  constructor(type, options) {this.type = type;this.detail = options?.detail;}
}
vm.runInNewContext(sdk, {window, document, URL, CustomEvent, MutationObserver: undefined, setTimeout, clearTimeout, AbortController});
assert.equal(window.FitIDSDK.version, '1.1.0');
assert.equal(target.children.length, 2, 'mounts button and status from product code');
assert.equal(target.getAttribute('data-fit-id-mounted'), '1.1.0');
assert.equal(window.FitIDSDK.mountAll(document), 1);
assert.equal(target.children.length, 2, 'duplicate mount does not create extra button');
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
// A merchant's own product ID can be used without knowing the FIT ID code.
const merchantHost=new Node('div');
const merchantShop='d1000000-0000-4000-8000-000000000001';
merchantHost.setAttribute('data-fit-id-shop-id',merchantShop);
merchantHost.setAttribute('data-fit-id-merchant-product-id','SKU-ABC-15');
assert.equal(window.FitIDSDK.mount({element:merchantHost}),true,'mounts merchant product placeholder');
await merchantHost.children[0].handlers.click();
await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(body.children.length,1,'async mapping opens modal');
assert.equal(new URL(body.children[0].children[0].children[1].src).searchParams.get('productCode'),'FIT-123456');
window.FitIDSDK.close();
assert.equal(await window.FitIDSDK.resolveMerchantProduct(merchantShop,'SKU-ABC-15'),'FIT-123456','cached resolution');
await assert.rejects(window.FitIDSDK.resolveMerchantProduct('bad-shop','SKU-ABC-15'),/INVALID_MERCHANT_MAPPING/);
// Ignore forged close requests, but accept trusted Consumer iframe requests.
window.FitIDSDK.open('FIT-910101');
assert.equal(body.children.length,1);
listeners.message({origin:'https://evil.example',source:consumerFrame,data:{type:'FITID_CLOSE_REQUEST_V1'}});
assert.equal(body.children.length,1,'reject untrusted frame origins');
const trustedFrame=body.children[0].children[0].children[1];
trustedFrame.contentWindow=consumerFrame;
listeners.message({origin:'https://fit-id-consumer-mtvz.vercel.app',source:consumerFrame,data:{type:'FITID_CLOSE_REQUEST_V1'}});
assert.equal(body.children.length,0,'Consumer can request modal close from its own iframe');
console.log('FIT ID SDK v1.1 smoke PASS: direct code, merchant ID resolve/cache, origin-checked close, iframe, new tab.');
