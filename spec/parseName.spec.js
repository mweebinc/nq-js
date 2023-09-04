const parseName = require('../src/parseName');
describe('Parsing names', () => {
    const names = [
        {
            name: 'ABAGON, JOCELYN LABNAO',
            result: {
                firstName: 'JOCELYN',
                middleName: 'LABNAO',
                lastName: 'ABAGON',
                fullName: 'JOCELYN LABNAO ABAGON'
            }
        },
        {
            name: 'ABALOS, MELY ANNE ANASTACIO',
            result: {
                firstName: 'MELY',
                middleName: 'ANNE ANASTACIO',
                lastName: 'ABALOS',
                fullName: 'MELY ANNE ANASTACIO ABALOS'
            }
        },
        {
            name: 'ABATA, JANICE DELOS REYES',
            result: {
                firstName: 'JANICE',
                middleName: 'DELOS REYES',
                lastName: 'ABATA',
                fullName: 'JANICE DELOS REYES ABATA'
            }
        },
        {
            name: 'Mr. William R. Hearst, III',
            result: {
                salutation: 'Mr.',
                firstName: 'William',
                middleName: 'R.',
                lastName: 'Hearst',
                suffix: 'III',
                fullName: 'Mr. William R. Hearst, III'
            }
        },
        {
            name: '"Franců Franců", Jan',
            result: {
                firstName: 'Jan',
                lastName: 'Franců Franců',
                fullName: 'Jan Franců Franců',
            }
        },
        {
            name: 'William Randolph Hearst',
            result: {
                firstName: 'William',
                lastName: 'Hearst',
                middleName: 'Randolph',
                fullName: 'William Randolph Hearst'
            }
        }, {
            name: 'William R. De La Cruz',
            result: {
                firstName: 'William',
                lastName: 'De La Cruz',
                middleName: 'R.',
                fullName: 'William R. De La Cruz'
            }
        }, {
            name: 'Mr. William R. De La Cruz III',
            result: {
                salutation: 'Mr.',
                firstName: 'William',
                suffix: 'III',
                lastName: 'De La Cruz',
                middleName: 'R.',
                fullName: 'Mr. William R. De La Cruz III'
            }
        }, {
            name: 'William De Cruz',
            result: {
                firstName: 'William',
                lastName: 'De Cruz',
                fullName: 'William De Cruz'
            }
        }, {
            name: 'William De La Cruz',
            result: {
                firstName: 'William',
                lastName: 'De La Cruz',
                fullName: 'William De La Cruz'
            }
        }, {
            name: 'Mr. William R. Hugh Calum De La Cruz III',
            result: {
                salutation: 'Mr.',
                firstName: 'William',
                suffix: 'III',
                lastName: 'De La Cruz',
                middleName: 'R. Hugh Calum',
                fullName: 'Mr. William R. Hugh Calum De La Cruz III'
            }
        }, {
            name: 'William A. B. De La Cruz',
            result: {
                firstName: 'William',
                middleName: 'A. B.',
                lastName: 'De La Cruz',
                fullName: 'William A. B. De La Cruz'
            }
        }, {
            name: 'James Hugh Calum Laurie',
            result: {
                firstName: 'James',
                middleName: 'Hugh Calum',
                lastName: 'Laurie',
                fullName: 'James Hugh Calum Laurie'
            }
        }, {
            name: 'Kiefer William Frederick Dempsey George Rufus Sutherland',
            result: {
                firstName: 'Kiefer',
                middleName: 'William Frederick Dempsey George Rufus',
                lastName: 'Sutherland',
                fullName: 'Kiefer William Frederick Dempsey George Rufus Sutherland'
            }
        }, {
            name: 'William Hearst',
            result: {
                firstName: 'William',
                lastName: 'Hearst',
                fullName: 'William Hearst'
            }
        }, {
            name: 'William Hearst Jr',
            result: {
                firstName: 'William',
                suffix: 'Jr',
                lastName: 'Hearst',
                fullName: 'William Hearst Jr'
            }
        }, {
            name: 'Hearst, William Jr',
            result: {
                firstName: 'William',
                suffix: 'Jr',
                lastName: 'Hearst',
                fullName: 'William Hearst Jr'
            }
        }, {
            name: 'Hearst, William Randolph',
            result: {
                firstName: 'William',
                lastName: 'Hearst',
                middleName: 'Randolph',
                fullName: 'William Randolph Hearst'
            }
        }, {
            name: 'Hearst Jr., William Randolph',
            result: {
                firstName: 'William',
                lastName: 'Hearst',
                middleName: 'Randolph',
                suffix: 'Jr.',
                fullName: 'William Randolph Hearst Jr.'
            }
        }, {
            name: 'Hearst, William, M.D.',
            result: {
                firstName: 'William',
                suffix: 'M.D.',
                lastName: 'Hearst',
                fullName: 'William Hearst M.D.'
            }
        }, {
            name: 'William',
            result: {
                firstName: 'William',
                lastName: '',
                fullName: 'William'
            }
        }, {
            name: 'Mr. Hearst',
            result: {
                salutation: 'Mr.',
                lastName: 'Hearst',
                fullName: 'Mr. Hearst'
            }
        }, {
            name: 'Mr. Hearst Jr.',
            result: {
                salutation: 'Mr.',
                lastName: 'Hearst',
                suffix: 'Jr.',
                fullName: 'Mr. Hearst Jr.'
            }
        }, {
            name: 'hussain al robeh',
            result: {
                firstName: 'hussain',
                lastName: 'al robeh',
                fullName: 'hussain al robeh'
            }
        }, {
            name: 'EUGENE L. NATH,JR.',
            result: {
                firstName: 'EUGENE',
                middleName: 'L.',
                lastName: 'NATH',
                suffix: 'JR.',
                fullName: 'EUGENE L. NATH,JR.'
            }
        }, {
            name: 'LEE TANT , JR',
            result: {
                firstName: 'LEE',
                lastName: 'TANT',
                suffix: 'JR',
                fullName: 'LEE TANT , JR'
            }
        }, {
            name: '',
            result: {
                firstName: '',
                lastName: '',
                fullName: ''
            }
        }, {
            name: 'Tuan Syed Azmin Nur',
            result: {
                salutation: 'Tuan',
                firstName: 'Syed',
                middleName: 'Azmin',
                lastName: 'Nur',
                fullName: 'Tuan Syed Azmin Nur'
            }
        }
    ];
    it('Should parse all name attributes', () => {
        names.forEach((name, i, list) => {
            const parsed = parseName(name.name);
            expect(name.result).toEqual(parsed);
        });
    });
    it('should should parse name', function () {
        const parsed = parseName('Franco, John Carlo    Villaganas');
        console.log(parsed);
        // expect(name.result).toEqual(parsed);
    });
});

describe('Name Parser Functions', () => {

    describe('diff function', () => {
        it('should return the difference between two arrays', () => {
            expect(parseName.diff([1, 2, 3], [3, 4, 5])).toEqual([1, 2, 4, 5]);
            expect(parseName.diff(['a', 'b'], ['b', 'c'])).toEqual(['a', 'c']);
            expect(parseName.diff([], [])).toEqual([]);
        });
    });

    describe('isSuffix function', () => {
        it('should check if a word is a suffix', () => {
            expect(parseName.isSuffix('III', ['i', 'ii', 'iii'])).toBe(true);
            expect(parseName.isSuffix('Jr.', ['jr', 'sr'])).toBe(true);
            expect(parseName.isSuffix('Unknown', ['jr.', 'sr.'])).toBe(false);
        });
    });

    describe('generateFullName function', () => {
        it('should generate the full name based on attributes', () => {
            expect(parseName.generateFullName({firstName: 'John', lastName: 'Doe'})).toBe('John Doe');
            expect(parseName.generateFullName({
                firstName: 'John',
                middleName: 'M.',
                lastName: 'Doe',
                suffix: 'Jr.'
            })).toBe('John M. Doe Jr.');
        });
    });

    describe('handleLastNameFirstFormat function', () => {
        it('should handle "Last name, First name" format', () => {
            const parts = ['Doe,', 'John'];
            const attrs = {};
            const suffixes = ['jr', 'sr'];
            parseName.handleLastNameFirstFormat(parts, attrs, suffixes);
            expect(attrs).toEqual({
                lastName: 'Doe',
                firstName: 'John',
                fullName: 'John Doe'
            });
        });
    });

    describe('handleFirstNameLastFormat function', () => {
        it('should handle "First name Last name" format', () => {
            const parts = ['John', 'Doe'];
            const attrs = {};
            const salutations = ['mr', 'mrs'];
            const compound = ['van', 'de'];
            const name = 'John Doe';
            parseName.handleFirstNameLastFormat(parts, attrs, salutations, compound, name);
            expect(attrs).toEqual({
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe'
            });
        });
    });

    describe('parseName function', () => {
        it('should parse names correctly', () => {
            expect(parseName('Doe, John')).toEqual({firstName: 'John', lastName: 'Doe', fullName: 'John Doe'});
            expect(parseName('Mr. John Doe')).toEqual({
                salutation: 'Mr.',
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'Mr. John Doe'
            });
        });
    });
    describe('separateComponents Function', function () {
        it('should separate by whitespace if no quotes are present', function () {
            const result = parseName.separateComponents('John Jane');
            expect(result).toEqual(['John', 'Jane']);
        });
        it('should remove quotes around a word', function () {
            const result = parseName.separateComponents('"John" "Jane"');
            expect(result).toEqual(['John', 'Jane']);
        });

        it('should handle a mix of quoted and non-quoted words', function () {
            const result = parseName.separateComponents('Mr. "John Doe"');
            expect(result).toEqual(['Mr.', 'John Doe']);
        });

        it('should handle single words, with or without quotes', function () {
            let result = parseName.separateComponents('"John"');
            expect(result).toEqual(['John']);
            result = parseName.separateComponents('John');
            expect(result).toEqual(['John']);
        });
        it('should return an empty array for an empty string', function () {
            const result = parseName.separateComponents('');
            expect(result).toEqual(['']);
        });
    });

});
