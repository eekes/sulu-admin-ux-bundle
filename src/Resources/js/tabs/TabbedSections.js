// @flow
import React from 'react';
import {action, computed, observable} from 'mobx';
import {observer} from 'mobx-react';
import jexl from 'jexl';
import Grid from 'sulu-admin-bundle/components/Grid';
import Tabs from 'sulu-admin-bundle/components/Tabs';
import conditionDataProviderRegistry from 'sulu-admin-bundle/containers/Form/registries/conditionDataProviderRegistry';
import tabbedSectionsStyles from './tabbedSections.scss';
import type {Node} from 'react';
import type FormInspector from 'sulu-admin-bundle/containers/Form/FormInspector';
import type {ErrorCollection, Schema, SchemaEntry} from 'sulu-admin-bundle/containers/Form/types';

type Tab = {|
    items: Schema,
    key: string,
    label: string,
    schemaPath: string,
|};

type Props = {|
    data: Object,
    errors?: ErrorCollection,
    formInspector: FormInspector,
    items: Schema,
    renderItem: (schemaField: SchemaEntry, schemaKey: string, schemaPath: string) => Node,
    schema: SchemaEntry,
    schemaPath: string,
    showAllErrors: boolean,
|};

@observer
class TabbedSections extends React.Component<Props> {
    @observable selectedIndex: number = 0;

    @computed get conditionData(): Object {
        const {data, formInspector} = this.props;

        return conditionDataProviderRegistry.getAll().reduce(
            function(conditionData, conditionDataProvider) {
                return {...conditionData, ...conditionDataProvider(conditionData, undefined, formInspector)};
            },
            {...data}
        );
    }

    isVisible(schemaEntry: SchemaEntry): boolean {
        if (!schemaEntry.visibleCondition) {
            return true;
        }

        return jexl.evalSync(schemaEntry.visibleCondition, this.conditionData);
    }

    @computed get tabs(): Array<Tab> {
        const {items, schemaPath} = this.props;

        return Object.keys(items)
            .filter((key) => 'section' === items[key].type && this.isVisible(items[key]))
            .map((key) => ({
                items: items[key].items || {},
                key,
                label: items[key].label || key,
                schemaPath: schemaPath + '/items/' + key,
            }));
    }

    @computed get selectedTab(): ?Tab {
        const tabs = this.tabs;

        return tabs[this.selectedIndex] || tabs[0];
    }

    countErrors(items: Schema): number {
        const {errors} = this.props;

        if (!errors) {
            return 0;
        }

        return Object.keys(items).reduce((count, key) => {
            const item = items[key];

            if ('section' === item.type) {
                return count + this.countErrors(item.items || {});
            }

            return count + (errors[key] ? 1 : 0);
        }, 0);
    }

    // Fields hidden behind an unselected tab would report their errors invisibly, so the tab itself has to show them.
    createBadges(tab: Tab): Array<Node> {
        const {showAllErrors} = this.props;

        if (!showAllErrors) {
            return [];
        }

        const errorCount = this.countErrors(tab.items);

        if (!errorCount) {
            return [];
        }

        return [
            <span className={tabbedSectionsStyles.errorBadge} key="error">{errorCount}</span>,
        ];
    }

    @action handleTabSelect = (index: number) => {
        this.selectedIndex = index;
    };

    renderItems(items: Schema, schemaPath: string): Array<Node> {
        const {renderItem} = this.props;

        return Object.keys(items).map((key) => renderItem(items[key], key, schemaPath + '/items/' + key));
    }

    render() {
        const {items, schema, schemaPath} = this.props;

        if (!this.isVisible(schema)) {
            return null;
        }

        const tabs = this.tabs;
        const selectedTab = this.selectedTab;

        // Properties placed next to the sections stay above the tab bar, they belong to every tab.
        const ungroupedItems = Object.keys(items)
            .filter((key) => 'section' !== items[key].type)
            .reduce((ungrouped, key) => ({...ungrouped, [key]: items[key]}), {});

        return (
            <Grid.Section colSpan={schema.colSpan || 12}>
                {this.renderItems(ungroupedItems, schemaPath)}

                {tabs.length > 0 &&
                    <Grid.Item className={tabbedSectionsStyles.tabsItem} colSpan={12}>
                        <Tabs
                            className={tabbedSectionsStyles.tabs}
                            onSelect={this.handleTabSelect}
                            selectedIndex={selectedTab ? tabs.indexOf(selectedTab) : 0}
                            type="inline"
                        >
                            {tabs.map((tab) => (
                                <Tabs.Tab badges={this.createBadges(tab)} key={tab.key}>{tab.label}</Tabs.Tab>
                            ))}
                        </Tabs>
                    </Grid.Item>
                }

                {!!selectedTab && this.renderItems(selectedTab.items, selectedTab.schemaPath)}
            </Grid.Section>
        );
    }
}

export default TabbedSections;
