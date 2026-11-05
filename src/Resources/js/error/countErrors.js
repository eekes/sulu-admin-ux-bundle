// @flow
import {toJS} from 'mobx';
import type {Error} from 'sulu-admin-bundle/containers/Form/types';

function countLeaves(error: mixed): number {
    if (!error || 'object' !== typeof error) {
        return 0;
    }

    if (Array.isArray(error)) {
        return error.reduce((count, item) => count + countLeaves(item), 0);
    }

    if ('string' === typeof error.keyword) {
        return 1;
    }

    return Object.keys(error).reduce((count, key) => count + countLeaves(error[key]), 0);
}

/**
 * Counts the invalid fields in an error of the form, including the ones of nested blocks. Sulu nests errors as
 * objects keyed by property name and arrays indexed by block, the leaves are the errors of a single field.
 *
 * Observable arrays of mobx 4 are no real arrays, so the error is converted to plain javascript first.
 */
export default function countErrors(error: ?Error): number {
    return countLeaves(toJS(error));
}
