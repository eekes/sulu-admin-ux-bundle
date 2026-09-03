# The `text card` field

A read-only block of text on a detail page: an address, a contact block, a note.

## Usage

```xml
<property name="shipping_address" type="text_card" colspan="4">
    <meta>
        <title lang="en">Delivery address</title>
    </meta>

    <params>
        <param name="placeholder_text" value="No delivery address"/>
    </params>
</property>
```

| Param | Type | Meaning |
|:---|:---|:---|
| `placeholder_text` | string | Shown when there is nothing to render |

## What it expects

A list of lines, or a single string:

```php
'shipping_address' => [
    $address->getFullName(),
    $address->getStreet() . ' ' . $address->getNumber(),
    $address->getZip() . ' ' . $address->getCity(),
    ['type' => 'link', 'label' => $order->getEmail(), 'href' => 'mailto:' . $order->getEmail()],
],
```

Every entry is one line. An entry that is empty or `null` is skipped, so an optional company name or a
second address line is harmless. An entry that is more than text uses a [value type](values.md).
