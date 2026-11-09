# Contact-path regression tests

Run the production build and browser regression tests:

```sh
npm run test:contact
```

The tests reuse Puppeteer from the existing BackstopJS dependency. If its bundled
Chrome is not installed, use a compatible installed browser, for example on macOS:

```sh
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:contact
```

The tests render the built site at desktop and mobile widths. Every browser
request is intercepted locally, including successful form POSTs. No test inquiry
is sent to Web3Forms, and no production or analytics service is contacted.

Coverage includes the homepage About contact link, email-only and phone-only
submissions, both contact methods, missing/whitespace-only contact methods,
required name, invalid email, repeated attempts, switching/clearing values,
reset, restored/autofilled fields, keyboard submission, help text and layout,
and the JavaScript-disabled fallback.

## Validation boundary

This site is statically hosted on GitHub Pages and posts directly to Web3Forms.
The email-or-phone rule is browser validation, not server-side enforcement.
Without JavaScript, email remains required and the page explains the fallback.
The existing Web3Forms destination, field names, and optional message are retained.

Web3Forms does not document an email-or-phone server validation rule. Direct API
requests can bypass browser validation. Guaranteed server-side enforcement would
require a provider-supported rule or an authorized backend change. Its API docs
also restrict server-side use to paid plans with server-IP whitelisting:
https://docs.web3forms.com/getting-started/api-reference

For the existing full-site visual comparison suite, see `backstop/README.md`.
