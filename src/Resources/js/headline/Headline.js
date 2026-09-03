// @flow
import React from 'react';
import classNames from 'classnames';
import {isArrayLike, toJS} from 'mobx';
import SingleSelect from 'sulu-admin-bundle/components/SingleSelect';
import headlineStyles from './headline.scss';
import type {FieldTypeProps} from 'sulu-admin-bundle/containers/Form/types';

const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

type TitleValue = {|
    level?: ?string,
    text?: ?string,
|};

type Level = {|
    label: string,
    level: string,
|};

export default class Headline extends React.Component<FieldTypeProps<?(TitleValue | string)>> {
    constructor(props: FieldTypeProps<?(TitleValue | string)>) {
        super(props);

        const {onChange} = this.props;

        // The level is never empty, so an editor who only types a title still gets a valid heading.
        // This also upgrades a value that is still a plain string on the first render of the form.
        if (!this.normalizedValue.level) {
            onChange({...this.normalizedValue, level: this.defaultLevel}, {isDefaultValue: true});
        }
    }

    // A value that is still a plain string comes from a field that used to be a `text_line`.
    get normalizedValue(): TitleValue {
        const {value} = this.props;

        if ('string' === typeof value) {
            return {text: value};
        }

        return toJS(value) || {};
    }

    get levels(): Array<Level> {
        const {
            schemaOptions: {
                levels: {
                    value: levels,
                } = {},
            } = {},
        } = this.props;

        if (undefined === levels || null === levels) {
            return LEVELS.map((level) => ({label: level.toUpperCase(), level}));
        }

        if (!isArrayLike(levels)) {
            throw new Error('The "levels" schema option must be an array!');
        }

        return toJS(levels).map(({name, title}) => {
            if (!LEVELS.includes(name)) {
                throw new Error(
                    'Every param of the "levels" schema option must be named one of "' + LEVELS.join('", "') + '"!'
                );
            }

            return {label: title || name.toUpperCase(), level: name};
        });
    }

    get defaultLevel(): string {
        const {
            schemaOptions: {
                default_level: {
                    value: defaultLevel,
                } = {},
            } = {},
        } = this.props;

        const levels = this.levels;

        if (undefined === defaultLevel || null === defaultLevel || '' === defaultLevel) {
            return levels[0].level;
        }

        if (!levels.some(({level}) => defaultLevel === level)) {
            throw new Error('The "default_level" schema option must be one of the levels offered by the field!');
        }

        return String(defaultLevel);
    }

    handleTextChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        const {onChange} = this.props;

        onChange({...this.normalizedValue, text: event.currentTarget.value || undefined});
    };

    handleTextBlur = () => {
        this.props.onFinish();
    };

    handleTextFocus = (event: Event) => {
        const {onFocus} = this.props;

        if (onFocus) {
            onFocus(event.target);
        }
    };

    handleLevelChange = (level: string) => {
        const {onChange, onFinish} = this.props;

        onChange({...this.normalizedValue, level});
        onFinish();
    };

    render() {
        const {dataPath, disabled, error} = this.props;
        const {level, text} = this.normalizedValue;

        const headlineClass = classNames(headlineStyles.headline, {
            [headlineStyles.error]: !!error,
            [headlineStyles.disabled]: !!disabled,
        });

        return (
            <div className={headlineClass}>
                <div className={headlineStyles.level}>
                    <SingleSelect
                        disabled={!!disabled}
                        onChange={this.handleLevelChange}
                        skin="flat"
                        value={level || this.defaultLevel}
                    >
                        {this.levels.map(({label, level: option}) => (
                            <SingleSelect.Option key={option} value={option}>{label}</SingleSelect.Option>
                        ))}
                    </SingleSelect>
                </div>

                <input
                    className={headlineStyles.text}
                    disabled={!!disabled}
                    id={dataPath}
                    onBlur={this.handleTextBlur}
                    onChange={this.handleTextChange}
                    onFocus={this.handleTextFocus}
                    type="text"
                    value={text || ''}
                />
            </div>
        );
    }
}
