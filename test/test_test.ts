///<reference path="../typings/tsd.d.ts" />

describe('test', function () {

    fit('check true', function () {
        var expected = true;
        expect(expected).toBe(true);
    });

    it('check false', function () {
        var expected = true;
        expect(expected).toBe(false);
    });

});
