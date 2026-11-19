// @flow
import React from 'react';
import type {Node} from 'react';
import SingleSelect from 'sulu-admin-bundle/components/SingleSelect';
import GroupHeading from './GroupHeading';
import groupLabel, {GROUP_SEPARATOR} from './groupLabel';
import type {BlockGroups} from './BlockGroupsContext';

const OTHER = '';

/**
 * The options of a block type dropdown, sorted into their groups under a heading: the groups alphabetically by their
 * label, the types without a group last under "Other", each group in the order the types come in. Returns null when
 * the options are not exactly the block types of the field (any other dropdown inside a block) or when no type has a
 * group, so those dropdowns render unchanged. Under its heading an option drops the group in front of its title.
 */
export default function groupOptions(children: Node, groups: BlockGroups): ?Array<Node> {
    const options = React.Children.toArray(children);
    const typeKeys = Object.keys(groups);

    const isTypeDropdown = options.length === typeKeys.length
        && options.every((option) => option.type === SingleSelect.Option && option.props.value in groups);

    if (!isTypeDropdown || typeKeys.every((typeKey) => !groups[typeKey])) {
        return null;
    }

    const buckets: Map<string, Array<Node>> = new Map();
    options.forEach((option) => {
        const group = groups[option.props.value] || OTHER;
        buckets.set(group, [...(buckets.get(group) || []), option]);
    });

    const label = (group: string) => groupLabel(group === OTHER ? null : group);

    const withoutGroup = (option, group: string) => {
        const prefix = label(group) + GROUP_SEPARATOR;
        const title = option.props.children;

        return group !== OTHER && typeof title === 'string' && title.startsWith(prefix)
            ? React.cloneElement(option, {}, title.slice(prefix.length))
            : option;
    };

    const sortedGroups = Array.from(buckets.keys()).sort((a, b) => {
        if (a === OTHER || b === OTHER) {
            return a === OTHER ? 1 : -1;
        }

        return label(a).localeCompare(label(b));
    });

    return sortedGroups.reduce((grouped, group) => [
        ...grouped,
        <GroupHeading key={'group-' + group}>{label(group)}</GroupHeading>,
        ...(buckets.get(group) || []).map((option) => withoutGroup(option, group)),
    ], []);
}
