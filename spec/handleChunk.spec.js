const handleChunk = require("../src/adapters/rest/xhr/handleChunk");
describe('handleChunk', () => {
    it('should handle complete chunk json', () => {
        const partial = '[{"first_name":"MARK ALEXANDER","id":"17c7b7338fe504a62d801f398712873a"},{"first_name":"EDWINA","id":"c06abb9a180b0ae1e7a04e22f900a60b"}]';
        const expectedResult = [{"first_name": "MARK ALEXANDER", "id": "17c7b7338fe504a62d801f398712873a"}, {
            "first_name": "EDWINA", "id": "c06abb9a180b0ae1e7a04e22f900a60b"
        }];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(partial.length - 1);
    });
    it('should handle chunk json', () => {
        const partial = '[{"first_name":"MARK ALEXANDER","id":"17c7b7338fe504a62d801f398712873a"},{"first_name":"EDWINA","id":"c06abb9a180b0ae1e7a04e22f900a60b"},{"first_name":"KELSIE RAINE","';
        const expectedResult = [{"first_name": "MARK ALEXANDER", "id": "17c7b7338fe504a62d801f398712873a"}, {
            "first_name": "EDWINA", "id": "c06abb9a180b0ae1e7a04e22f900a60b"
        }];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(136);
    });
    it('should handle complex chunk json', () => {
        const partial = '[{"id": "1","name": "john","address": {"zip": "12345", "city": "NY"},"business": [{"name": "business1", "address": {"zip": "12345", "city": "NY"}},{"name": "business2","address": {"zip": "12345", "city": "NY"}}],"skills": ["js", "python", "java"]},{"id": "2","name": "jane","address": {"zip": "12345", "city": "NY"},"business": [{"name": "business1", "address": {"zip": "12345", "city": "NY"}}, {"name": "business2","address": {"zip": "12345", "city": "NY"}}],"skills": ["js", "python", "java"]},{"id": "3","name": "doe","address": {"zip": "12345", "city": "NY"},"business": [{"name": "business1", "address": {"zip": "12345", "city": "NY"}}, {"name": "business2","address": {"zip": "12345",';
        const expectedResult = [{
            id: "1",
            name: "john",
            address: {zip: "12345", city: "NY"},
            business: [{name: "business1", address: {zip: "12345", city: "NY"}}, {
                name: "business2", address: {zip: "12345", city: "NY"}
            }],
            skills: ["js", "python", "java"]
        }, {
            id: "2",
            name: "jane",
            address: {zip: "12345", city: "NY"},
            business: [{name: "business1", address: {zip: "12345", city: "NY"}}, {
                name: "business2", address: {zip: "12345", city: "NY"}
            }],
            skills: ["js", "python", "java"]
        }];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(495);
    });
    it('should handle JSON arrays', () => {
        const partial = '[{"id": "4", "data": [1, 2, 3]}, {"id": "5", "data": [4, 5, 6]}]';
        const expectedResult = [
            {"id": "4", "data": [1, 2, 3]},
            {"id": "5", "data": [4, 5, 6]}
        ];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(partial.length - 1);
    });

    it('should handle escaped characters within strings', () => {
        const partial = '[{"name": "He said \\"hello\\"."}, {"name": "It\\\'s Friday!"}]';
        const expectedResult = [ { name: 'He said "hello".' } ];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(partial.length-1);
    });

    it('should handle deeply nested JSON objects', () => {
        const partial = '{"id": "6", "nested": {"inner": {"deep": {"deeper": [1, 2, {"deepest": "value"}]}}}}';
        const expectedResult = [
            {"id": "6", "nested": {"inner": {"deep": {"deeper": [1, 2, {"deepest": "value"}]}}}}
        ];
        const [result, remain] = handleChunk(partial);
        expect(result).toEqual(expectedResult);
        expect(remain).toEqual(partial.length);
    });

});