// @flow
import React from 'react';
import type {Node} from 'react';

const MAX_LENGTH = 50;

export default class HeadlineBlockPreviewTransformer {
    transform(value: *): Node {
        const text = 'string' === typeof value ? value : value && value.text;

        if ('string' !== typeof text) {
            return null;
        }

        return <p>{text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) + '...' : text}</p>;
    }
}
