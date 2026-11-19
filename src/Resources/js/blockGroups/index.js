// @flow
import React from 'react';
import {fieldRegistry} from 'sulu-admin-bundle/containers';
import SingleSelect from 'sulu-admin-bundle/components/SingleSelect';
import initializer from 'sulu-admin-bundle/services/initializer';
import BlockGroupsContext from './BlockGroupsContext';
import groupLabel, {GROUP_SEPARATOR} from './groupLabel';
import groupOptions from './groupOptions';
import type {BlockGroups} from './BlockGroupsContext';

/**
 * Groups the block type dropdown by the `<group>` of each block template (label `sulu_admin.template_group.{group}`,
 * as for article templates). BlockGroupFormMetadataVisitor puts that group on every block type of a form; Sulu's own
 * dropdown shows a flat list.
 *
 * Block and FieldBlocks are mobx observers, whose render cannot be replaced after the fact, so the block field is
 * wrapped to put the groups of its types in a context, and SingleSelect (a plain PureComponent) reads it. The wrapper
 * also puts the group in front of every title ("Advantages › Icons"), so a collapsed block and the closed dropdown
 * name it; under its heading in the open dropdown an option drops it again.
 */
const originalRender = SingleSelect.prototype.render;

// $FlowFixMe: SingleSelect has no context of its own.
SingleSelect.contextType = BlockGroupsContext;

SingleSelect.prototype.render = function() {
    const element = originalRender.call(this);
    const grouped = this.context ? groupOptions(this.props.children, this.context) : null;

    return grouped ? React.cloneElement(element, {}, ...grouped) : element;
};

function groupsOf(types: ?{[string]: {group?: ?string}}): BlockGroups {
    return Object.keys(types || {}).reduce((groups, typeKey) => {
        groups[typeKey] = types && types[typeKey].group ? types[typeKey].group : null;

        return groups;
    }, {});
}

type BlockTypes = {[string]: {group?: ?string, title?: string}};

function withGroupInTitle(types: ?BlockTypes): ?BlockTypes {
    if (!types) {
        return types;
    }

    return Object.keys(types).reduce((titled, typeKey) => {
        const type = types[typeKey];
        const label = type.group ? groupLabel(type.group) : null;

        // "Text › Text" says nothing more than "Text".
        titled[typeKey] = label && type.title && label.toLowerCase() !== type.title.toLowerCase()
            ? {...type, title: label + GROUP_SEPARATOR + type.title}
            : type;

        return titled;
    }, {});
}

// Sulu registers its fields in its own sulu_admin hook, which runs before this one.
initializer.addUpdateConfigHook('sulu_admin', (config: Object, initialized: boolean) => {
    if (initialized) {
        return;
    }

    const FieldBlocks = fieldRegistry.get('block');

    function GroupedFieldBlocks(props: Object) {
        const groups = React.useMemo(() => groupsOf(props.types), [props.types]);
        const types = React.useMemo(() => withGroupInTitle(props.types), [props.types]);

        return (
            <BlockGroupsContext.Provider value={groups}>
                <FieldBlocks {...props} types={types} />
            </BlockGroupsContext.Provider>
        );
    }

    fieldRegistry.fields.block = GroupedFieldBlocks;
});
