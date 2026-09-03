// @flow
import React from 'react';
import Renderer from 'sulu-admin-bundle/containers/Form/Renderer';
import TabbedSections from './TabbedSections';
import {isTabsSection} from './tabsSection';
import type {Node} from 'react';
import type {SchemaEntry} from 'sulu-admin-bundle/containers/Form/types';

/**
 * The renderer of sulu-admin-bundle maps every form item to a field or a section and offers no extension point
 * for a third type, so its renderItem is replaced here. Everything it does not recognise as a group of tabs is
 * handed back to the original implementation.
 */
const originalRenderItem = Renderer.prototype.renderItem;

// The observer of TabbedSections compares props, so the callback has to keep its identity between renders.
function getRenderItem(renderer: Object) {
    if (!renderer.tabbedSectionsRenderItem) {
        renderer.tabbedSectionsRenderItem = (
            schemaField: SchemaEntry,
            schemaKey: string,
            schemaPath: string
        ) => renderer.renderItem(schemaField, schemaKey, schemaPath);
    }

    return renderer.tabbedSectionsRenderItem;
}

Renderer.prototype.renderItem = function(
    schemaField: SchemaEntry,
    schemaKey: string,
    schemaPath: string
): Node {
    if ('section' !== schemaField.type || !isTabsSection(schemaKey) || !schemaField.items) {
        return originalRenderItem.call(this, schemaField, schemaKey, schemaPath);
    }

    const {data, errors, formInspector, showAllErrors} = this.props;

    return (
        <TabbedSections
            data={data}
            errors={errors}
            formInspector={formInspector}
            items={schemaField.items}
            key={schemaKey}
            renderItem={getRenderItem(this)}
            schema={schemaField}
            schemaPath={schemaPath}
            showAllErrors={showAllErrors}
        />
    );
};
