# The `info card` field

A read-only summary of the record a detail page is about: a label on the left, its value on the right.

```
┌───────────────────────────────────────────────┐
│  Order number   ORD-2024-1234                 │
│  Created at     02/09/2026 09:14              │
│  E-mail         jan@example.com               │
│  Status         ( Paid )                      │
└───────────────────────────────────────────────┘
```

## Usage

```xml
<property name="general_info" type="info_card" colspan="4">
    <meta>
        <title lang="en">Information</title>
    </meta>

    <params>
        <param name="rows" type="collection">
            <param name="order_number" value="Order number"/>
            <param name="created" value="Created at"/>
            <param name="email" value="E-mail"/>
            <param name="status" value="Status"/>
        </param>

        <param name="placeholder_text" value="Nothing to show yet"/>
    </params>
</property>
```

Each child param of `rows` is one line: its name is the key it reads from the value, its value is the
label, and the order of the params is the order of the lines.

| Param | Type | Meaning |
|:---|:---|:---|
| `rows` | collection | The lines, as `name` → label. Required. |
| `placeholder_text` | string | Shown when no line has a value |

A label may also come from a `<meta><title>` instead of the `value` attribute, for an admin that runs in
more than one language.

## What it expects

One flat object on the field's own property:

```php
'general_info' => [
    'order_number' => $order->getOrderNumber(),
    'created' => $order->getCreatedAt()->format('d/m/Y H:i'),
    'email' => ['type' => 'link', 'label' => $order->getEmail(), 'href' => 'mailto:' . $order->getEmail()],
    'status' => ['type' => 'badge', 'label' => 'Paid', 'skin' => 'success'],
],
```

A row whose value is empty is left out, so the card stays as short as the data. Values are strings or
numbers; a link or a badge uses a [value type](values.md).

The field is read-only, but the value travels back in the `PUT` payload. Ignore that key in the
controller.
