// @flow
import React from 'react';

/** The group of every block type of the nearest block field, by type key (null for a type without a group). */
export type BlockGroups = {[typeKey: string]: ?string};

const BlockGroupsContext: React$Context<?BlockGroups> = React.createContext(null);

export default BlockGroupsContext;
