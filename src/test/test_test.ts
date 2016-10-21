///<reference path="../../typings/tsd.d.ts" />

describe("test", function () {

    fit("check true", function () {
        const expected = true;
        expect(expected).toBe(true);
    });

    it("check false", function () {
        const expected = true;
        expect(expected).toBe(false);
    });

});
