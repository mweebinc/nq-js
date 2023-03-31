const Config = require('../src/Config');
describe('Config', function () {
    it('should add configuration', function () {
        expect(() => Config.get('test')).toThrow(new Error('Configuration key not found.'));
        Config.set('test', 'value');
        expect(Config.get('test')).toEqual('value');
        Config.get('APPLICATION_ID','test');
    });
});