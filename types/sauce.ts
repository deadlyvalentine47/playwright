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

export type CartPageModel = {
    loginCredentials: LoginCredentials;
    commonTestData: CommonTestData
    firstname: string
    lastName: string
    postalCode: Number
    //whatever cart page fields needed
}