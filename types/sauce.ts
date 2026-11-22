export type CommonTestData = {
    testName: string;
    testdescription: string;
}

export type Validations = {
    expectedUrl: string | null;
    expectedError: string | null;
}

export type LoginCredentials = {
    userName: string,
    password: string,
}

export type SauceLoginModel = {
    loginCredentials: LoginCredentials;
    commonTestData: CommonTestData
    validations: Validations
}

export type CartPaageModel = {
    loginCredentials: LoginCredentials;
    commonTestData: CommonTestData
    //whatever cart page fields needed
}