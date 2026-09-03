# Tabs in forms

A form section named `tabs` renders its child sections as tabs instead of stacking them underneath each
other. Use it for blocks whose content, media and container settings together make the form too long to
scan.

```xml
<section name="tabs">
    <properties>
        <section name="content">
            <meta>
                <title lang="en">Content</title>
            </meta>
            <properties>
                <property name="text" type="text_editor">
                    <meta>
                        <title lang="en">Text</title>
                    </meta>
                </property>
            </properties>
        </section>

        <section name="container">
            <meta>
                <title lang="en">Container</title>
            </meta>
            <properties>
                <!-- ... -->
            </properties>
        </section>
    </properties>
</section>
```

- The `<meta><title>` of a child section is the tab label.
- Use `tabs_something` when one form needs more than one group of tabs.
- A property placed directly inside the `tabs` section, outside any child section, is rendered above the
  tab bar and stays visible on every tab.
- `visibleCondition` works on the group and on the individual tabs. A tab whose condition is false
  disappears from the bar.
- After a failed save, a tab that contains invalid fields shows the number of errors as a badge.

For Sulu itself nothing changes: the stored data stays flat, the resolved data on the website is the same,
and without this bundle the XML renders as plain nested sections.
