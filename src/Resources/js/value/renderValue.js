// @flow
import React from 'react';
import classNames from 'classnames';
import valueStyles from './value.scss';
import type {Node} from 'react';

const BADGE_SKINS = ['default', 'info', 'success', 'warning', 'error'];

function renderLink(value: Object): Node {
    const {href, label, target} = value;

    if (!href) {
        return renderValue(label);
    }

    return (
        <a
            className={valueStyles.link}
            href={href}
            rel={'_blank' === target ? 'noopener noreferrer' : undefined}
            target={target}
        >
            {renderValue(label)}
        </a>
    );
}

function renderBadge(value: Object): Node {
    const {label, skin} = value;

    // A skin that is not offered is a mistake in the data of one row, not in the form, so it falls
    // back instead of breaking the page the way an invalid schema option does.
    const badgeClass = classNames(
        valueStyles.badge,
        valueStyles[BADGE_SKINS.includes(skin) ? skin : 'default']
    );

    return <span className={badgeClass}>{renderValue(label)}</span>;
}

/**
 * A value shows what it is given: the backend decides how a date, an amount or a boolean reads. Anything
 * richer than text says so with a type, which keeps the escaping automatic and the styling out of the
 * backend — the class names of sulu-admin-bundle are hashed, so markup built in PHP cannot reach them.
 */
export default function renderValue(value: mixed): Node {
    if ('string' === typeof value || 'number' === typeof value) {
        return value;
    }

    if (!value || 'object' !== typeof value) {
        return null;
    }

    switch (value.type) {
        case 'link':
            return renderLink(value);
        case 'badge':
            return renderBadge(value);
        case 'html':
            return <span dangerouslySetInnerHTML={{__html: String(value.value || '')}} />;
        default:
            // A type that is not known still shows its text, so a typo does not empty the cell.
            return renderValue(undefined === value.label ? value.value : value.label);
    }
}
