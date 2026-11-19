// @flow
import React from 'react';
import blockGroupsStyles from './blockGroups.scss';

type Props = {|
    children: string,
|};

/** A heading between the options of a dropdown. It has no button, so the dropdown's keyboard navigation skips it. */
export default function GroupHeading({children}: Props) {
    return <li className={blockGroupsStyles.heading} role="presentation">{children}</li>;
}
