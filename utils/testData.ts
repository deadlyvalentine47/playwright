import path from 'node:path';
import { getTestData } from './dataProvider.js';

const root = (...segments: string[]): string => path.join('testdata', ...segments);

/**
 * One expected state in an ordered sequence. `label` is used as a test step name,
 * so a failure points at the transition that broke rather than at the whole cycle.
 */
export type ToggleState = {
  label: string;
  expectedText: string;
  expectedName: string;
  expectedClass: string;
};

/** A named sequence of states, walked in order by one test. */
export type ToggleScenario = {
  testName: string;
  expectedStates: ToggleState[];
};

export type Product = {
  id: number;
  name: string;
  price: string;
};

/**
 * Only what a human chooses, plus the invariants of the widget. Deliberately
 * contains no product list: the table's contents belong to the site, not to us,
 * so the specs assert on structure and read the rows from the DOM.
 */
export type ProductTableData = {
  rowsPerPage: number;
  expectedHeaders: string[];
  pricePattern: string;
};

export type DialogCase = {
  testName: string;
  trigger: 'simple' | 'confirmation' | 'prompt';
  accept?: boolean;
  promptText?: string;
  expectedType: 'alert' | 'confirm' | 'prompt';
  expectedMessage: string;
  expectedResult: string | null;
};

export type DatePickerCase = {
  testName: string;
  action: 'open' | 'nextMonth' | 'selectDay';
  day?: number;
  expectedMonthPattern?: string;
  minimumDaysInMonth?: number;
};

export type SiteChromeData = {
  pages: { label: string; path: string }[];
  expectedTitle: string;
  expectedDescription: string;
  expectedNavLabels: string[];
  linkWithHref: { label: string; hrefPattern: string };
};

export type PopupsData = {
  popupUrls: string[];
  expectedTitles: Record<string, string>;
  expectedPopupCount: number;
  singlePopupButton: string;
};

export type BoltCredentials = {
  testName: string;
  email: string;
  password: string;
};

export type OnboardingData = {
  testName: string;
  expectedOnboardingUrl: string;
  expectedProgress: string;
  expectedNavLabels: string[];
  dateOfBirth: { year: number; month: number; day: number };
  expectedBirthDate: string;
  minimumMonthOptions: number;
  minimumYearOptions: number;
};

/**
 * Typed accessors for the JSON under testdata/. Each call reads and parses the
 * file, so a malformed file fails during collection with a message naming the
 * path, instead of surfacing as `undefined is not a function` mid-test.
 */
export const testData = {
  toggleScenarios: (): ToggleScenario[] =>
    getTestData<ToggleScenario>(root('blogspot', 'toggle.json')),

  productTable: (): ProductTableData =>
    getTestData<ProductTableData>(root('blogspot', 'productTable.json'))[0]!,

  dialogs: (): DialogCase[] => getTestData<DialogCase>(root('blogspot', 'dialog.json')),

  datePicker: (): DatePickerCase[] => getTestData<DatePickerCase>(root('blogspot', 'datePicker.json')),

  siteChrome: (): SiteChromeData =>
    getTestData<SiteChromeData>(root('blogspot', 'siteChrome.json'))[0]!,

  popups: (): PopupsData => getTestData<PopupsData>(root('blogspot', 'popups.json'))[0]!,

  boltLogin: (): BoltCredentials[] => getTestData<BoltCredentials>(root('bolt', 'login.json')),

  onboarding: (): OnboardingData =>
    getTestData<OnboardingData>(root('bolt', 'onboarding.json'))[0]!,
};
