// @flow
import log from 'loglevel';
import type {Node} from 'react';
import {userStore} from 'sulu-admin-bundle/stores';
import type {FieldTransformer} from 'sulu-admin-bundle/containers/List/types';

const DEFAULT_SCALE = 2;

// Amounts are stored as integers in the smallest unit (cents), so a column type of `number`
// would show 1999 where an editor expects 19,99.
export default class MoneyFieldTransformer implements FieldTransformer {
    transform(value: *, parameters: {[string]: mixed} = {}): Node {
        if (value === undefined || value === null || value === '') {
            return null;
        }

        if (isNaN(value)) {
            log.error('Invalid money value given: "' + value + '"');

            return null;
        }

        const scale = parameters.scale !== undefined && parameters.scale !== null
            ? Number(parameters.scale)
            : DEFAULT_SCALE;
        const currency = typeof parameters.currency === 'string' && parameters.currency !== ''
            ? parameters.currency
            : undefined;
        const locale = typeof parameters.locale === 'string' && parameters.locale !== ''
            ? parameters.locale
            : userStore.systemLocale;

        const amount = Number(value) / Math.pow(10, scale);

        try {
            return new Intl.NumberFormat(
                locale,
                currency
                    ? {style: 'currency', currency}
                    : {minimumFractionDigits: scale, maximumFractionDigits: scale}
            ).format(amount);
        } catch (error) {
            // An unknown currency or locale is a mistake in the list XML, not in the data of one row:
            // report it once and still show the amount.
            log.error('Invalid money parameters given: ' + error.message);

            return amount.toFixed(scale);
        }
    }
}
