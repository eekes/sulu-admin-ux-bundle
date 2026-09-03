# Cell and row values

The [table](table.md), [info card](info-card.md) and [text card](text-card.md) fields render a value that
is a string or a number as text. A value that is more than text is an object naming what it is:

```php
'email' => ['type' => 'link', 'label' => $order->getEmail(), 'href' => 'mailto:' . $order->getEmail()],
'status' => ['type' => 'badge', 'label' => 'Paid', 'skin' => 'success'],
'address' => ['type' => 'html', 'value' => 'Street 1<br>2000 Antwerp'],
```

| Type | Keys | Renders |
|:---|:---|:---|
| `link` | `label`, `href`, `target` | An anchor. `target: '_blank'` also sets `rel="noopener noreferrer"`. Without an `href` the label is rendered as text. |
| `badge` | `label`, `skin` | A pill. Skins: `default`, `info`, `success`, `warning`, `error`. |
| `html` | `value` | The markup as it is. |

A skin that does not exist falls back to `default`, and an unknown `type` renders its `label` as text.

Format dates, amounts and booleans in the backend, which knows the locale and the wording, and pass them
as strings. Use `html` only for the case nobody foresaw, never for text a user typed.
