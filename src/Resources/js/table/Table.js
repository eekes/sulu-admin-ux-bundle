// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {isArrayLike, toJS} from 'mobx';
import TableComponent from 'sulu-admin-bundle/components/Table';
import renderValue from '../value/renderValue';
import type {FieldTypeProps} from 'sulu-admin-bundle/containers/Form/types';

const SKINS = ['dark', 'light', 'flat'];

type Column = {|
    label: string,
    name: string,
|};

type Row = {[string]: mixed};

@observer
class Table extends React.Component<FieldTypeProps<?Array<Row>>> {
    get columns(): Array<Column> {
        const {
            schemaOptions: {
                columns: {
                    value: columns,
                } = {},
            } = {},
        } = this.props;

        if (!isArrayLike(columns)) {
            throw new Error('The "columns" schema option of the table field type must be a collection!');
        }

        return toJS(columns).map(({name, title, value}) => ({label: title || value || name, name}));
    }

    get rows(): Array<Row> {
        const {value} = this.props;

        // A resource with nothing to show leaves the property out of its payload, which is not an error.
        if (!isArrayLike(value)) {
            return [];
        }

        return toJS(value).filter((row) => row && 'object' === typeof row);
    }

    get skin(): string {
        const {
            schemaOptions: {
                skin: {
                    value: skin,
                } = {},
            } = {},
        } = this.props;

        if (undefined === skin || null === skin || '' === skin) {
            return 'dark';
        }

        if (!SKINS.includes(skin)) {
            throw new Error('The "skin" schema option must be one of "' + SKINS.join('", "') + '"!');
        }

        return String(skin);
    }

    render() {
        const {
            schemaOptions: {
                placeholder_text: {
                    value: placeholderText,
                } = {},
            } = {},
        } = this.props;

        const columns = this.columns;

        return (
            <TableComponent placeholderText={placeholderText} skin={this.skin}>
                <TableComponent.Header>
                    {columns.map(({label, name}) => (
                        <TableComponent.HeaderCell key={name}>{label}</TableComponent.HeaderCell>
                    ))}
                </TableComponent.Header>

                <TableComponent.Body>
                    {this.rows.map((row, index) => (
                        <TableComponent.Row id={row.id} key={row.id || index}>
                            {columns.map(({name}) => (
                                <TableComponent.Cell key={name}>{renderValue(row[name])}</TableComponent.Cell>
                            ))}
                        </TableComponent.Row>
                    ))}
                </TableComponent.Body>
            </TableComponent>
        );
    }
}

export default Table;
