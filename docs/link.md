# The `link` list column

Shows a URL in a list as a button that opens it.

## Usage

```xml
<property name="url" type="link" translation="app.website" sortable="false">
    <transformer type="link">
        <params>
            <param name="label" value="Show on website"/>
        </params>
    </transformer>
</property>
```

Without params the `type` attribute alone is enough, and the button shows the URL itself.

| Param | Type | Meaning |
|:---|:---|:---|
| `label` | string | The caption of the button, as literal text. |
| `label_translation` | string | The caption as a translation key. Wins over `label` when both are given. |
| `skin` | string | `link` (default), `text`, `primary` or `secondary`. |
| `target` | string | `_blank` (default) opens a new tab, `_self` navigates the admin itself to the URL. |

## What it expects

A string holding the URL. An empty value renders nothing. An unknown `skin` or `target` is logged and the
default is used.
