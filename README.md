# Sulu Admin UX Bundle

Over the years I have built many dozens of Sulu websites. This bundle collects the improvements to the
Sulu administration interface that kept proving useful across those projects: small additions that make a
form quicker to scan and quicker to fill in, without changing how Sulu stores or resolves the content.

## Features

### Forms

| Feature | What it does |
|:---|:---|
| [Tabs in forms](docs/tabs.md) | A section named `tabs` renders its child sections as tabs instead of stacking them underneath each other |

### Form fields

| Field type | What it does |
|:---|:---|
| [headline](docs/headline.md) | A heading as one field, with the level as a dropdown inside the title input |
| [table](docs/table.md) | A read-only table on a detail page, built from the rows the form's API returns |
| [info_card](docs/info-card.md) | A read-only summary of a record: a label left, its value right |
| [text_card](docs/text-card.md) | A read-only block of text, one line per entry |

### List field transformers

| Transformer | What it does |
|:---|:---|
| [link](docs/link.md) | A URL in a list, shown as a button that opens it |
| [money](docs/money.md) | An amount stored in cents, shown as a formatted amount in a list |

## Installation

```bash
composer require eekes/sulu-admin-ux-bundle
```

Symfony Flex registers the bundle. Add the javascript package to `assets/admin/package.json`:

```json
"sulu-admin-ux-bundle": "file:../../vendor/eekes/sulu-admin-ux-bundle/src/Resources/js"
```

Import it in `assets/admin/app.js`:

```js
import 'sulu-admin-ux-bundle';
```

Finally, [rebuild the administration interface](https://docs.sulu.io/2.x/cookbook/build-admin-frontend.html#solution-1-update-command-recommended-way).

## Compatibility

Built and tested against `sulu/sulu` 3.0. Every feature uses the components of `sulu-admin-bundle` as they
are, except the tabs: Sulu's form renderer has no extension point for a third kind of form item, so the
bundle replaces its `renderItem` method and hands everything that is not a group of tabs back to the
original. That is the one part of this bundle to check first after a Sulu upgrade.
