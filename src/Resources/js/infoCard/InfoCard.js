// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {isArrayLike, toJS} from 'mobx';
import CardComponent from 'sulu-admin-bundle/components/Card';
import renderValue from '../value/renderValue';
import infoCardStyles from './infoCard.scss';
import type {FieldTypeProps} from 'sulu-admin-bundle/containers/Form/types';

type Row = {|
    label: string,
    name: string,
|};

@observer
class InfoCard extends React.Component<FieldTypeProps<?Object>> {
    get rows(): Array<Row> {
        const {
            schemaOptions: {
                rows: {
                    value: rows,
                } = {},
            } = {},
        } = this.props;

        if (!isArrayLike(rows)) {
            throw new Error('The "rows" schema option of the info card field type must be a collection!');
        }

        return toJS(rows).map(({name, title, value}) => ({label: title || value || name, name}));
    }

    get values(): Object {
        const {value} = this.props;

        // A resource with nothing to show leaves the property out of its payload, which is not an error.
        if (!value || 'object' !== typeof value) {
            return {};
        }

        return toJS(value);
    }

    render() {
        const {
            schemaOptions: {
                placeholder_text: {
                    value: placeholderText,
                } = {},
            } = {},
        } = this.props;

        const values = this.values;

        // A record without a company name should not show an empty line for it.
        const rows = this.rows.filter(({name}) => {
            const value = values[name];

            return undefined !== value && null !== value && '' !== value;
        });

        return (
            <CardComponent>
                {0 === rows.length
                    ? <div className={infoCardStyles.placeholder}>{placeholderText}</div>
                    : (
                        <dl className={infoCardStyles.infoCard}>
                            {rows.map(({label, name}) => (
                                <React.Fragment key={name}>
                                    <dt className={infoCardStyles.label}>{label}</dt>
                                    <dd className={infoCardStyles.value}>{renderValue(values[name])}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    )
                }
            </CardComponent>
        );
    }
}

export default InfoCard;
