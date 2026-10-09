/* FIT ID PoC Embed SDK v1.0.0 — zero dependencies, no credentials.
 * Install: <div data-fit-id-product-code="FIT-910101"></div>
 *          <script defer src="https://fit-id-demo-malls.vercel.app/sdk/v1/fit-id.js"></script>
 * A stable, distinct SDK hostname should replace this PoC host before general release.
 */
(function (window, document) {
  'use strict';
  if (window.FitIDSDK && window.FitIDSDK.version === '1.0.0') return;

  var VERSION = '1.0.0';
  var CONSUMER_URL = 'https://fit-id-consumer-mtvz.vercel.app/';
  var STYLE_ID = 'fitid-sdk-v1-styles';
  var SELECTOR = '[data-fit-id-product-code]';
  var overlay = null;
  var lastFocus = null;
  var previousOverflow = '';
  var activeProductCode = null;
  var observer = null;

  function text(value) {
    return value == null ? '' : String(value).trim();
  }

  function validCode(code) {
    return /^[A-Za-z0-9][A-Za-z0-9_-]{2,63}$/.test(code);
  }

  function emit(eventName, detail) {
    try {
      document.dispatchEvent(new CustomEvent('fitid:' + eventName, {
        detail: detail
      }));
    } catch (_ignore) { /* CustomEvent unavailable */ }
  }

  function getUrl(productCode, shopId) {
    var url = new URL(CONSUMER_URL);
    url.searchParams.set('productCode', productCode);
    url.searchParams.set('source', 'partner-sdk');
    url.searchParams.set('embed', '1');
    if (shopId) url.searchParams.set('shopId', shopId);
    return url.toString();
  }

  function element(tag, className, content) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var css = [
      '.fitid-sdk-button{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;min-height:50px!important;padding:12px 18px!important;border:0!important;border-radius:12px!important;background:#092e24!important;color:#fff!important;font:600 14px/1.4 system-ui,sans-serif!important;cursor:pointer!important;max-width:100%!important;}',
      '.fitid-sdk-button:hover{background:#155f45!important;}',
      '.fitid-sdk-button:focus-visible,.fitid-sdk-close:focus-visible,.fitid-sdk-outside:focus-visible{outline:3px solid #50eda5!important;outline-offset:3px!important;}',
      '.fitid-sdk-mark{color:#81eeb6;font-weight:800;letter-spacing:.08em;}',
      '.fitid-sdk-cover{position:fixed!important;inset:0!important;z-index:2147483000!important;background:rgba(0,0,0,.72)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:24px!important;box-sizing:border-box!important;}',
      '.fitid-sdk-dialog{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;width:min(100%,1000px)!important;height:min(92vh,920px)!important;max-height:calc(100dvh - 16px)!important;overflow:hidden!important;border-radius:18px!important;border:1px solid #264d3f!important;background:#fff!important;box-shadow:0 20px 70px #0008!important;color:#111!important;font:14px/1.5 system-ui,sans-serif!important;}',
      '.fitid-sdk-header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 18px;background:#08271d;color:#fff;}',
      '.fitid-sdk-heading{font-size:15px;font-weight:800;}',
      '.fitid-sdk-code{font-size:12px;color:#bce3cc;white-space:nowrap;}',
      '.fitid-sdk-actions{display:flex;align-items:center;gap:10px;}',
      '.fitid-sdk-outside{color:#b3ffdc!important;text-decoration:underline!important;font-size:12px!important;}',
      '.fitid-sdk-close{border:0!important;background:transparent!important;color:#fff!important;font-size:30px!important;line-height:1!important;cursor:pointer!important;padding:4px 10px!important;}',
      '.fitid-sdk-frame{border:0!important;width:100%!important;height:100%!important;min-height:0!important;flex:1!important;background:#f5f7f8!important;}',
      '.fitid-sdk-footer{padding:10px 18px;background:#f6f8f7;color:#59665f;font-size:12px;}',
      '@media(max-width:640px){.fitid-sdk-cover{padding:0!important;}.fitid-sdk-dialog{width:100%!important;height:100dvh!important;max-height:100dvh!important;border-radius:0!important;}.fitid-sdk-header{padding:12px;}.fitid-sdk-code{font-size:10px;}.fitid-sdk-footer{padding:8px 12px;}}'
    ].join('');
    var style = element('style');
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function close() {
    if (!overlay) return;
    document.removeEventListener('keydown', onKeyDown, true);
    overlay.remove();
    overlay = null;
    document.body.style.overflow = previousOverflow;
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    emit('close', {productCode: activeProductCode});
    activeProductCode = null;
  }

  function onKeyDown(event) {
    if (!overlay) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') {
      // Keep keyboard navigation inside the modal, including the iframe.
      var focusables = overlay.querySelectorAll('a[href],button:not([disabled]),iframe');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function open(productCode, options) {
    options = options || {};
    var code = text(productCode).toUpperCase();
    if (!validCode(code)) {
      emit('error', {code: 'INVALID_PRODUCT_CODE', productCode: code});
      return false;
    }
    var shopId = text(options.shopId);
    var link = getUrl(code, shopId);
    if (options.mode === 'new-tab') {
      var opened = window.open(link, '_blank', 'noopener,noreferrer');
      emit('open', {productCode: code, mode: 'new-tab'});
      return !!opened;
    }
    close();
    ensureStyles();
    lastFocus = document.activeElement;
    activeProductCode = code;
    previousOverflow = document.body.style.overflow;

    var cover = element('div', 'fitid-sdk-cover');
    cover.setAttribute('data-fitid-sdk-overlay', 'v1');
    var dialog = element('section', 'fitid-sdk-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'FIT ID 사이즈 및 가상피팅');
    dialog.tabIndex = -1;

    var header = element('div', 'fitid-sdk-header');
    var intro = element('div');
    intro.appendChild(element('div', 'fitid-sdk-heading', 'FIT ID · FIT CHECK'));
    intro.appendChild(element('div', 'fitid-sdk-code', 'PRODUCT ' + code));

    var actions = element('div', 'fitid-sdk-actions');
    var external = element('a', 'fitid-sdk-outside', '새 창으로 보기 ↗');
    external.href = link;
    external.target = '_blank';
    external.rel = 'noopener noreferrer';
    var exit = element('button', 'fitid-sdk-close', '×');
    exit.type = 'button';
    exit.setAttribute('aria-label', 'FIT ID 닫기');
    exit.addEventListener('click', close);
    actions.appendChild(external);
    actions.appendChild(exit);
    header.appendChild(intro);
    header.appendChild(actions);

    var frame = element('iframe', 'fitid-sdk-frame');
    frame.title = 'FIT ID - ' + code;
    frame.setAttribute('loading', 'eager');
    frame.setAttribute('allow', 'clipboard-read; clipboard-write');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox');
    frame.src = link;
    frame.addEventListener('load', function () {
      // iframe load does not prove the Consumer app or its login has succeeded.
      emit('frame-load', {productCode: code});
    });

    var footer = element('div', 'fitid-sdk-footer', '로그인 또는 화면 표시가 제한되면 우측 상단의 "새 창으로 보기"를 이용하세요.');
    dialog.appendChild(header);
    dialog.appendChild(frame);
    dialog.appendChild(footer);
    cover.appendChild(dialog);
    cover.addEventListener('mousedown', function (event) {
      if (event.target === cover) close();
    });
    document.body.appendChild(cover);
    overlay = cover;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown, true);
    exit.focus();
    emit('open', {productCode: code, mode: 'modal', shopId: shopId});
    return true;
  }

  function mount(config) {
    config = config || {};
    var host = config.element;
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host || host.nodeType !== 1) return false;
    if (host.getAttribute('data-fit-id-mounted') === VERSION) return true;
    var code = text(config.productCode || host.getAttribute('data-fit-id-product-code')).toUpperCase();
    if (!validCode(code)) {
      emit('error', {code: 'INVALID_PRODUCT_CODE', productCode: code});
      return false;
    }
    var mode = text(config.mode || host.getAttribute('data-fit-id-mode')).toLowerCase() === 'new-tab' ? 'new-tab' : 'modal';
    var shopId = text(config.shopId || host.getAttribute('data-fit-id-shop-id'));
    var label = text(config.label || host.getAttribute('data-fit-id-label')) || '내 FIT ID로 사이즈 확인';
    ensureStyles();
    var button = element('button', 'fitid-sdk-button');
    button.type = 'button';
    button.setAttribute('aria-label', 'FIT ID - ' + code + ' 사이즈 확인');
    button.appendChild(element('span', 'fitid-sdk-mark', 'FIT ID'));
    button.appendChild(element('span', '', label));
    button.addEventListener('click', function () {
      open(code, {mode: mode, shopId: shopId});
    });
    host.appendChild(button);
    host.setAttribute('data-fit-id-mounted', VERSION);
    emit('mounted', {productCode: code});
    return true;
  }

  function mountAll(root) {
    root = root || document;
    if (!root.querySelectorAll) return 0;
    var targets = root.querySelectorAll(SELECTOR);
    var count = 0;
    for (var i = 0; i < targets.length; i++) {
      if (mount({element: targets[i]})) count++;
    }
    return count;
  }

  window.FitIDSDK = {version: VERSION, mount: mount, mountAll: mountAll, open: open, close: close};

  function start() {
    mountAll(document);
    if (typeof MutationObserver !== 'undefined' && document.body) {
      observer = new MutationObserver(function (changes) {
        for (var i = 0; i < changes.length; i++) {
          if (changes[i].addedNodes && changes[i].addedNodes.length) {
            mountAll(document);
            break;
          }
        }
      });
      observer.observe(document.body, {childList: true, subtree: true});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once: true});
  } else {
    start();
  }
})(window, document);
