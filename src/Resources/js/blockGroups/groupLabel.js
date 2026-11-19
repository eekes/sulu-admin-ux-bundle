// @flow
import {translate} from 'sulu-admin-bundle/utils/Translator';

/** Separates the group from the block title wherever a title stands on its own, as in "Advantages › Icons". */
export const GROUP_SEPARATOR = ' › ';

/** The heading of a group: the admin translation used for template groups, or "Other" for types without a group. */
export default function groupLabel(group: ?string): string {
    return group
        ? translate('sulu_admin.template_group.' + group)
        : translate('sulu_admin.block_group_other');
}
