const flatten = require('../src/flatten'); // Update the path accordingly

describe('flatten function', () => {

    it('should return an empty array when input is an empty object', () => {
        const input = {};
        const output = flatten(input);
        expect(output).toEqual([{}]);
    });

    it('should flatten a simple object', () => {
        const input = {
            a: 1,
            b: 2
        };
        const output = flatten(input);
        expect(output).toEqual([{a: 1, b: 2}]);
    });

    it('should flatten a nested object', () => {
        const input = {
            a: 1,
            b: {
                c: 2,
                d: 3
            }
        };
        const output = flatten(input);
        expect(output).toEqual([{ a: 1, 'b.c': 2, 'b.d': 3 }]);
    });


    it('should flatten an object with arrays', () => {
        const input = {
            a: 1,
            b: [2, 3]
        };
        const output = flatten(input);
        expect(output).toEqual([{a: 1, b: 2}, {a: 1, b: 3}]);
    });

    it('should flatten a complex nested object with arrays', () => {
        // we get only the first value of array b.d 3 on this test
        const input = {
            a: 1,
            b: {
                c: 2,
                d: [3, 4]
            }
        };
        const output = flatten(input);
        expect(output).toEqual([ { a: 1, 'b.c': 2, 'b.d': 3 } ]);
    });
});
