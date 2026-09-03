# The `money` list column

Shows an amount stored in cents as a formatted amount in a list: `1999` becomes `19,99` or `€ 19,99`,
in the locale of the administrator who is looking at it.

## Usage

```xml
<property name="price" type="money" translation="app.price">
    <transformer type="money">
        <params>
            <param name="currency" value="EUR"/>
        </params>
    </transformer>
</property>
```

Without params the `type` attribute alone is enough.

| Param | Type | Meaning |
|:---|:---|:---|
| `currency` | string | An ISO 4217 code such as `EUR`. Adds the currency symbol. Without it only the number is shown. |
| `scale` | string | How many decimal places the stored integer carries. Defaults to `2`. |
| `locale` | string | Forces a locale for the number format. Defaults to the locale of the logged-in administrator. |

## What it expects

An integer in the smallest unit of the currency, the way a `Money` value object stores it. An empty value
renders nothing. An unknown `currency` or `locale` is logged and the amount is shown as a plain number.
