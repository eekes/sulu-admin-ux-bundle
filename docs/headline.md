# The `headline` field

A heading as one field: the text, with the level as a dropdown inside the same input.

```
┌──────────┬──────────────────────────────────────┐
│  H2   ▾  │  Lorem ipsum dolor sit amet          │
└──────────┴──────────────────────────────────────┘
```

## Usage

```xml
<property name="title" type="headline" colspan="12">
    <meta>
        <title lang="en">Title</title>
    </meta>

    <params>
        <param name="default_level" value="h2"/>

        <param name="levels" type="collection">
            <param name="h2"/>
            <param name="h3"/>
            <param name="h4"/>
        </param>
    </params>
</property>
```

| Param | Type | Meaning |
|:---|:---|:---|
| `levels` | collection | Which levels the dropdown offers, in order. Child params are named `h1`…`h6`. Omit to offer all six. |
| `default_level` | string | The level a new block starts with. Defaults to the first offered level. |

A level's label is derived from its name (`h3` → `H3`). Give a child param a `<meta><title>` to override it.

## What it stores

```json
{"text": "Lorem ipsum dolor sit amet", "level": "h2"}
```

`level` is always set, so a heading is valid even if the editor only typed the text. `mandatory="true"` is
satisfied by the object itself, so it does not enforce that a text was typed.

## Rendering it

The object arrives in the template as stored:

```twig
{% set title = content.title|default %}

{% if title.text|default %}
    <{{ title.level }}>{{ title.text }}</{{ title.level }}>
{% endif %}
```

## Replacing an existing `text_line`

`headline` is a drop-in replacement for a `text_line`: change the `type` in the XML and the admin keeps
working, reading the old string as the text with the default level. The stored value only becomes an
object when the block is saved again, so until every page has been re-saved the template receives either
a string or an object. Cover both:

```twig
{% set title = content.title|default %}
{% set text = title is iterable ? title.text|default : title %}
{% set level = title is iterable ? title.level|default('h2') : 'h2' %}

{% if text %}
    <{{ level }}>{{ text }}</{{ level }}>
{% endif %}
```
