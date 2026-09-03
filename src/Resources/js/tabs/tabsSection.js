// @flow

/**
 * A section named "tabs" (or "tabs_*", when a form needs more than one group) renders its child sections as tabs.
 * Everything stays a plain section for Sulu itself, so the form data and the block preview are not affected.
 */
const TABS_SECTION_REGEX = /^tabs(_.+)?$/;

export function isTabsSection(schemaKey: string): boolean {
    return TABS_SECTION_REGEX.test(schemaKey);
}
