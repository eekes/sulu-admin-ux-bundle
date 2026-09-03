# The `table` field

A read-only table on a detail page, built from the rows the form's API returns: the lines of an order,
the contacts of a dealer, the versions of a document.

## Usage

```xml
<property name="items" type="table">
    <meta>
        <title lang="en">Order lines</title>
    </meta>

    <params>
        <param name="columns" type="collection">
            <param name="code" value="Item number"/>
            <param name="productName" value="Product"/>
            <param name="quantity" value="Quantity"/>
            <param name="totalPrice" value="Total"/>
        </param>

        <param name="placeholder_text" value="This order has no lines yet"/>
    </params>
</property>
```

Each child param of `columns` is one column: its name is the key it reads from a row, its value is the
header label, and the order of the params is the order of the columns.

| Param | Type | Meaning |
|:---|:---|:---|
| `columns` | collection | The columns, as `name` → header label. Required. |
| `skin` | string | `dark` (default, the look of Sulu's own lists), `light` or `flat` |
| `placeholder_text` | string | Shown when there are no rows |

A column label may also come from a `<meta><title>` instead of the `value` attribute, for an admin that
runs in more than one language.

## What it expects

A list of flat objects, one per row, on the field's own property:

```php
protected function getDataForEntity(Order $order): array
{
    return [
        'id' => $order->getId(),
        'items' => [
            ['id' => 12, 'code' => 'A-100', 'productName' => 'Three-furrow plough', 'quantity' => 2, 'totalPrice' => '€ 1,200.00'],
            ['id' => 13, 'code' => 'A-220', 'productName' => 'Extra share', 'quantity' => 1, 'totalPrice' => '€ 150.00'],
        ],
    ];
}
```

- `id` is optional; without it the position in the list is the row's identity.
- A missing key renders an empty cell. An empty list renders the placeholder.
- A summary is just more rows: append a total row with only the columns it needs.
- Cells hold strings or numbers; anything richer uses a [value type](values.md).

The field is read-only, but Sulu sends the whole form on save, so the property arrives in the `PUT`
payload. Ignore that key in the controller and return freshly built rows.

There is no sorting, paging, selection or row actions. For those you need a resource of its own with a
list XML and a real list view.
