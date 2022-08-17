const File = require('../src/domain/File');
const Queue = require('../src/Queue');

beforeAll(() => {
    Queue.setUrl('http://test.com');
    Queue.setApplicationId('test');
});
describe('File', function () {
    it('should get correct path', function () {
        const path = 'http://165.232.167.26:8888/v1/files/123/456_like_professional.jpeg';
        expect(File.getFile(path)).toEqual('http://test.com/files/test/456_like_professional.jpeg');
    });
});
