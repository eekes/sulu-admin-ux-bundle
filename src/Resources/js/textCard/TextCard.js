// @flow
import React from 'react';
import {observer} from 'mobx-react';
import {isArrayLike, toJS} from 'mobx';
import CardComponent from 'sulu-admin-bundle/components/Card';
import renderValue from '../value/renderValue';
import textCardStyles from './textCard.scss';
import type {FieldTypeProps} from 'sulu-admin-bundle/containers/Form/types';

@observer
class TextCard extends React.Component<FieldTypeProps<?(Array<mixed> | string)>> {
    get lines(): Array<mixed> {
        const {value} = this.props;

        const lines = isArrayLike(value) ? toJS(value) : [toJS(value)];

        return lines.filter((line) => undefined !== line && null !== line && '' !== line);
    }

    render() {
        const {
            schemaOptions: {
                placeholder_text: {
                    value: placeholderText,
                } = {},
            } = {},
        } = this.props;

        const lines = this.lines;

        return (
            <CardComponent>
                {0 === lines.length
                    ? <div className={textCardStyles.placeholder}>{placeholderText}</div>
                    : (
                        <div className={textCardStyles.textCard}>
                            {lines.map((line, index) => (
                                <div key={index}>{renderValue(line)}</div>
                            ))}
                        </div>
                    )
                }
            </CardComponent>
        );
    }
}

export default TextCard;
