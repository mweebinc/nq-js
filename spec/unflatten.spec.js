const unflatten = require('../src/unflatten'); // Update the path accordingly

describe('unflatten function', () => {

    it('should return an empty array when input is an empty array', () => {
        const input = [];
        const output = unflatten(input);
        expect(output).toEqual([]);
    });

    it('should unflatten a simple object', () => {
        const input = [{a: 1, b: 2}];
        const output = unflatten(input);
        expect(output).toEqual([{a: 1, b: 2}]);
    });

    it('should unflatten a nested object', () => {
        const input = [{'a.1': 1, 'b.1.2': 2}];
        const output = unflatten(input);
        expect(output).toEqual([{a: {'1': 1}, b: {'1': {'2': 2}}}]);
    });

    it('should unflatten an array of objects', () => {
        const input = [{'a.1': 1}, {'b.1.2': 2}];
        const output = unflatten(input);
        expect(output).toEqual([{a: {'1': 1}}, {b: {'1': {'2': 2}}}]);
    });

    it('should unflatten a complex object', () => {
        const input = [{'a.1': 1, 'b.1.2': 2, c: 3}];
        const output = unflatten(input);
        expect(output).toEqual([{a: {'1': 1}, b: {'1': {'2': 2}}, c: 3}]);
    });

    // Add more test cases as needed
});
