"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
// Defines a Mocha test suite to group tests of similar kind together
describe("Array", function () {
    //  Defines nested Mocha test suite for additional grouping
    describe("indexOf", function () {
        // Defines a Mocha unit test
        it("should return -1 when the value is not present", function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});
//# sourceMappingURL=sample.spec.js.map