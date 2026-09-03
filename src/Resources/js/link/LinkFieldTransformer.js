// @flow
import React from 'react';
import log from 'loglevel';
import type {Node} from 'react';
import Button from 'sulu-admin-bundle/components/Button';
import {translate} from 'sulu-admin-bundle/utils';
import type {FieldTransformer} from 'sulu-admin-bundle/containers/List/types';

const SKINS = ['link', 'text', 'primary', 'secondary'];
const TARGETS = ['_blank', '_self'];

export default class LinkFieldTransformer implements FieldTransformer {
    transform(value: *, parameters: {[string]: mixed} = {}): Node {
        if (!value || typeof value !== 'string') {
            return null;
        }

        const skin = this.pick('skin', parameters, SKINS);
        const target = this.pick('target', parameters, TARGETS);

        return (
            <Button onClick={this.handleClick} skin={skin} value={{url: value, target}}>
                {this.label(value, parameters)}
            </Button>
        );
    }

    handleClick = ({url, target}: {url: string, target: string}) => {
        window.open(url, target, target === '_blank' ? 'noopener' : undefined);
    };

    label(value: string, parameters: {[string]: mixed}): string {
        const {label_translation: translationKey, label} = parameters;

        if (typeof translationKey === 'string' && translationKey !== '') {
            return translate(translationKey);
        }

        if (typeof label === 'string' && label !== '') {
            return label;
        }

        return value;
    }

    // A value outside the whitelist is a mistake in the list XML, not in the data of one row:
    // report it and fall back to the first option instead of rendering nothing.
    pick(name: string, parameters: {[string]: mixed}, allowed: Array<string>): string {
        const given = parameters[name];

        if (given === undefined || given === null || given === '') {
            return allowed[0];
        }

        if (typeof given !== 'string' || !allowed.includes(given)) {
            log.error('Invalid "' + name + '" given for the link transformer: "' + String(given) + '"');

            return allowed[0];
        }

        return given;
    }
}
