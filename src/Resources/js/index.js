// @flow
import {blockPreviewTransformerRegistry, fieldRegistry, listFieldTransformerRegistry} from 'sulu-admin-bundle/containers';
import './tabs/patchRenderer';
import TabbedSections from './tabs/TabbedSections';
import {isTabsSection} from './tabs/tabsSection';
import InfoCard from './infoCard/InfoCard';
import Table from './table/Table';
import TextCard from './textCard/TextCard';
import Headline from './headline/Headline';
import HeadlineBlockPreviewTransformer from './headline/HeadlineBlockPreviewTransformer';
import LinkFieldTransformer from './link/LinkFieldTransformer';
import MoneyFieldTransformer from './money/MoneyFieldTransformer';
import renderValue from './value/renderValue';

const FIELD_TYPE_INFO_CARD = 'info_card';
const FIELD_TYPE_TABLE = 'table';
const FIELD_TYPE_TEXT_CARD = 'text_card';
const FIELD_TYPE_HEADLINE = 'headline';
const LIST_FIELD_TYPE_LINK = 'link';
const LIST_FIELD_TYPE_MONEY = 'money';

fieldRegistry.add(FIELD_TYPE_INFO_CARD, InfoCard);
fieldRegistry.add(FIELD_TYPE_TABLE, Table);
fieldRegistry.add(FIELD_TYPE_TEXT_CARD, TextCard);
fieldRegistry.add(FIELD_TYPE_HEADLINE, Headline);

// The priority matches the one of `text_line`, so the title leads the preview of a collapsed block.
blockPreviewTransformerRegistry.add(FIELD_TYPE_HEADLINE, new HeadlineBlockPreviewTransformer(), 1024);

listFieldTransformerRegistry.add(LIST_FIELD_TYPE_LINK, new LinkFieldTransformer());
listFieldTransformerRegistry.add(LIST_FIELD_TYPE_MONEY, new MoneyFieldTransformer());

export {
    isTabsSection,
    renderValue,
    InfoCard,
    TabbedSections,
    Table,
    TextCard,
    Headline,
    HeadlineBlockPreviewTransformer,
    LinkFieldTransformer,
    MoneyFieldTransformer,
};
