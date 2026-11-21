import path from 'node:path';
import { getTestData } from './dataProvider.js';

const root = (...segments: string[]): string => path.join('testdata', ...segments);

export type CsvToggleState = {
  label: string;
  expectedText: string;
  expectedName: string;
  expectedClass: string;
};

export type Product = {
  id: number;
  name: string;
  price: string;
};

export type ProductTablePage = {
  page: number;
  products: Product[];
};

export type ProductTableFixture = {
  headers: string[];
  rowsPerPage: number;
  columnCount: number;
  pages: ProductTablePage[];
  selection: { select: string; leaveChecked: string };
};

export type DialogFixture = {
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
  expectMonthChange?: boolean;
  expectedValuePattern?: string;
};

export type SiteChromeFixture = {
  pages: { label: string; path: string }[];
  expectedTitle: string;
  expectedDescription: string;
  expectedNavLabels: string[];
  linkWithHref: { label: string; hrefPattern: string };
};

export type PopupsFixture = {
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

export type OnboardingFixture = {
  testName: string;
  expectedOnboardingUrl: string;
  expectedProgress: string;
  expectedNavLabels: string[];
  dateOfBirth: { year: number; month: number; day: number };
  expectedBirthDate: string;
  minimumMonthOptions: number;
  minimumYearOptions: number;
};

export const fixtures = {
  toggle: (): CsvToggleState[] => getTestData<CsvToggleState>(root('blogspot', 'toggle.json')),
  productTable: (): ProductTableFixture =>
    getTestData<ProductTableFixture>(root('blogspot', 'productTable.json'))[0]!,
  dialogs: (): DialogFixture[] => getTestData<DialogFixture>(root('blogspot', 'dialog.json')),
  datePicker: (): DatePickerCase[] =>
    getTestData<DatePickerCase>(root('blogspot', 'datePicker.json')),
  siteChrome: (): SiteChromeFixture =>
    getTestData<SiteChromeFixture>(root('blogspot', 'siteChrome.json'))[0]!,
  popups: (): PopupsFixture => getTestData<PopupsFixture>(root('blogspot', 'popups.json'))[0]!,
  boltLogin: (): BoltCredentials[] => getTestData<BoltCredentials>(root('bolt', 'login.json')),
  onboarding: (): OnboardingFixture =>
    getTestData<OnboardingFixture>(root('bolt', 'onboarding.json'))[0]!,
};
