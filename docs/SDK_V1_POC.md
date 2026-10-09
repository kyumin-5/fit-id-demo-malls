# FIT ID — External Storefront SDK v1 / PoC Guide

Status: **PoC integration prototype**, not production partner onboarding.

## 1. What is available now

The public, dependency-free script is hosted from this repository:

`https://fit-id-demo-malls.vercel.app/sdk/v1/fit-id.js`

Standalone sample merchant page:

`https://fit-id-demo-malls.vercel.app/sdk-demo.html`

This host is for **pilot testing**. Before full release, move the SDK to a stable, FIT ID-owned distribution domain, and version it with an explicit compatibility policy.

### How it works

Merchant product detail page → FIT ID SDK button → iframe modal (or external new tab) → Consumer app receives `productCode` → Consumer queries the existing `public.products` / `public.product_sizes` records → FIT CHECK result.

The SDK does **not** make size predictions, receive personal measurements, access a customer session, or require a Supabase API key. It only passes a product code (and optional shop identifier) to FIT ID Consumer. Customer authentication and personal data remain within FIT ID Consumer.

**Virtual try-on is not yet end-to-end verified for partner products**. Existing product records `FIT-910101` through `FIT-930103` previously had `image_path = NULL`. Real raster product photos must be uploaded into Supabase Storage and connected to those existing product records before live AI try-on testing. Demo SVG placeholders are not suitable for AI try-on.

## 2. Install on a merchant's product page

A developer or authorized design administrator adds the following to a controlled **test page**. Replace each example product code with the code that has already been registered in FIT ID Partner.

```html
<div
  data-fit-id-product-code="FIT-910101"
  data-fit-id-shop-id="d1000000-0000-4000-8000-000000000001"
></div>

<script
  defer
  src="https://fit-id-demo-malls.vercel.app/sdk/v1/fit-id.js"
></script>
```

The SDK automatically mounts the button when the document loads, including product nodes added by client-side navigation. It does not change the merchant's payment, cart, or existing product selection logic.

Optional:

```html
<div data-fit-id-product-code="FIT-910101"
     data-fit-id-mode="new-tab"
     data-fit-id-label="나에게 맞는 사이즈 확인"></div>
```

Use `data-fit-id-mode="new-tab"` if the platform disallows iframes or third-party authentication in a modal. A link to the Consumer is also always shown at the top of the iframe modal.

JavaScript API for a dynamically rendered product page:

```js
window.FitIDSDK.mount({
  element: document.querySelector('#my-product-fit-id'),
  productCode: 'FIT-910101',
  shopId: 'd1000000-0000-4000-8000-000000000001',
  mode: 'modal'
});
// or window.FitIDSDK.open('FIT-910101', {mode:'new-tab'});
```

Note: the product code must exist in `public.products`. The `shopId` passed from the browser is untrusted context only; it does not authorize any merchant access.

## 3. Merchant prerequisites

- Confirm the store is a site where the merchant is authorized to inject third-party JavaScript (e.g. permitted custom HTML area or development theme).
- Identify merchant platform, test URL, test theme, maintenance contact, and rollback owner.
- Register each pilot product in FIT ID Partner; maintain mapping **merchant product ID / variant ↔ FIT ID product code**. Never assume the store's product ID equals the FIT ID product code.
- Verify product sizes, category, measurement units/schema and product images. Do not modify product IDs for an existing registered product.
- Only enable FIT ID on explicitly approved pilot products.
- Agree to privacy notices and user consent, retention, support, and acceptable virtual try-on usage costs before live customer exposure.

### Browser / site compatibility

The merchant may need to authorize script loading from `https://fit-id-demo-malls.vercel.app` and iframe navigation to `https://fit-id-consumer-mtvz.vercel.app` under its Content Security Policy. The Consumer hosting platform also has to permit embedding; inspect `frame-ancestors` and `X-Frame-Options` on the deployed Consumer.

Cross-site browser storage restrictions may affect iframe login. Always test the included **open in new tab** fallback. Do not assume an iframe `load` event means successful authentication or a successful FIT CHECK.

Some hosted marketplace product-description editors strip scripts and iframes. For those platforms, use approved marketplace integrations or an allowed external link, rather than trying to bypass their restrictions.

## 4. Embedded widget events

Merchants can observe custom events on `document`:

- `fitid:mounted` — a valid product code button was rendered.
- `fitid:open` — click requested modal or external page.
- `fitid:close` — modal dismissed.
- `fitid:frame-load` — iframe navigation loaded (NOT proof of Consumer success).
- `fitid:error` — invalid product code passed in merchant markup.

```js
document.addEventListener('fitid:open', (event) => {
  console.log(event.detail.productCode, event.detail.mode);
});
```

These are local **browser events only**; do not treat them as verified purchase conversions or server-side PoC metrics. The Consumer already records some own engagement events for supported deep links. Merchant checkout and return-rate metrics require separately approved data-sharing/instrumentation.

## 5. Validation and rollback

PoC install QA checklist:

- [ ] Script URL serves JavaScript, not an error page or HTML.
- [ ] Button appears on the registered product page on mobile and desktop.
- [ ] Product code received by Consumer equals selected merchant product; no cross-product confusion.
- [ ] Modal opens, Esc/close works and scroll lock clears on close.
- [ ] Consumer login and FIT CHECK work; if iframe auth fails, new-tab flow works.
- [ ] No console errors, broken cart, broken payment, or changed merchant layout.
- [ ] A test partner product photo is a valid public raster image; virtual try-on succeeds with permitted test account.
- [ ] No private image or body data is sent to the merchant page or its analytics.
- [ ] Merchant admin can disable the widget instantly by removing the snippet without touching FIT ID or checkout.

`npm run sdk:check` verifies the SDK script parses and the standalone fixture references a valid product code. CI executes `npm run typecheck`, `npm run sdk:check`, and `npm run build`.

## 6. Planned implementation stages and gates

| Gate | Work | Exit evidence |
| --- | --- | --- |
| P0 · **SDK v1 scaffold** | Host script, auto mount, accessible modal, new-tab fallback, static external-style test page | Public URL responds; static test page mounts buttons; script syntax and deployment verified |
| P1 · **Product onboarding** | Partner image upload & exact SKU mapping, nine demo images registered in Storage, sizes validated | Real partner products with product photos and measurements; no NULL image paths for pilot |
| P2 · **VTON integration QA** | Partner photo delivered to Edge Function; actual authenticated try-on call; review credit policy and status | 1 real successful generated output or explicit documented blocker |
| P3 · **Merchant install** | Choose Cafe24/custom site; supported placement, auth/CSP/mobile testing, product-page rollback | Approved merchant staging/test theme passes smoke tests |
| P4 · **Limited PoC** | 1–2 merchants, 10–30 products, proposed 4-week window (negotiable) | Event/usage/errors/feedback logs collected with agreed privacy safeguards |
| P5 · **Go/No-go** | Review engagement, operational burden and costs, checkout/returns only when comparable data exists | Written PoC findings and follow-up decision |
| P6 · **Platform rollout** | Production SDK domain, authenticated product mapping, allowlisted domains, signed events, Cafe24/Shopify adapters | Platform-specific production readiness and owner-approved rollout |

Do **not** claim higher conversion rates, fewer returns, real photo upload, or successful AI try-on until measured.

## 7. Changes deliberately deferred

- Merchant-specific product-catalog synchronization, domain allowlisting and signed analytics/event validation.
- Business/contract terms, data-processing agreement and platform approval.
- Full consent/accessibility/security penetration tests and browser-matrix QA.
- Patented correction-scope algorithm changes. **This SDK introduces no fitting algorithm changes.**

The SDK is deliberately just a presentation/entrypoint adapter. FIT CHECK logic, user evidence, scoring and scope-specific correction engine remain in Consumer.
