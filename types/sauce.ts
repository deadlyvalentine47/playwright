export type SauceLoginModel = {
    testName: string;
    userName: string,
    password: string,
    expectedUrl: string | null;
    expectedError: string | null;
}