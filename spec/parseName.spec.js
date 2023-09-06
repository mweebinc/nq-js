const parseName = require('../src/parseName');

describe('parseName', () => {
    it('should parse names in "FirstName MiddleName LastName" format', () => {
        // if the format is 3 parts it will automatically the middle_name is the center
        const name = "John Doe Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should parse names with salutations', () => {
        const name = "Mr. John Doe Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "Mr",
            suffix: ""
        });
    });
    it('should parse names with suffixes', () => {
        const name = "John Doe Franco Jr.";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "",
            suffix: "Jr"
        });
    });
    it('should parse names in "LastName, FirstName MiddleName"', () => {
        const name = "Franco, John Doe";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should parse names in "LastName, FirstName MiddleName with suffix"', () => {
        const name = "Franco, John Jr. Doe";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "",
            suffix: "Jr"
        });
    });
    it('should parse names in "LastName, FirstName MiddleName with salutation"', () => {
        const name = "Franco, Mr. John Doe";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "Mr",
            suffix: ""
        });
    });
    it('should parse names in "LastName, FirstName MiddleName" format with suffix', () => {
        const name = "Franco Jr., John Doe";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "Franco",
            salutation: "",
            suffix: "Jr"
        });
    });
    it('should handle compound names', () => {
        // if has compound name it will be
        const name = "John Doe von Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "von Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle complex names with salutations, middle names, and suffixes', () => {
        const name = "Dr. John Doe von Franco Jr.";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "von Franco",
            salutation: "Dr",
            suffix: "Jr"
        });
    });
    it('should handle first name first with 3 lastname', () => {
        const name = "John Doe De Los Reyes";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Doe",
            lastName: "De Los Reyes",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle names with no middle name', () => {
        const name = "John Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle names with multiple middle names', () => {
        const name = "John William Robert Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John William",
            middleName: "Robert",
            lastName: "Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle names with salutation but no middle name', () => {
        const name = "Mr. John Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "Franco",
            salutation: "Mr",
            suffix: ""
        });
    });
    it('should handle names with suffix but no middle name', () => {
        const name = "John Franco Jr.";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "Franco",
            salutation: "",
            suffix: "Jr"
        });
    });
    it('should handle names with special characters', () => {
        const name = "John O'Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "O'Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle names with extra spaces', () => {
        const name = "  John   Franco  ";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "Franco",
            salutation: "",
            suffix: ""
        });
    });
    it('should handle names with middle name and compound last name', () => {
        const name = "John Della Vega De Los Reyes";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "Della Vega",
            lastName: "De Los Reyes",
            salutation: "",
            suffix: ""
        });
    });
});
describe('handle invalid', function () {
    it('should handle empty strings', () => {
        const name = "";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "",
            middleName: "",
            lastName: "",
            salutation: "",
            suffix: ""
        });
    });

    it('should handle null values', () => {
        const name = null;
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "",
            middleName: "",
            lastName: "",
            salutation: "",
            suffix: ""
        });
    });

    it('should handle names with hyphens', () => {
        const name = "Mary-Jane Doe-Franco";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "Mary-Jane",
            middleName: "",
            lastName: "Doe-Franco",
            salutation: "",
            suffix: ""
        });
    });

    it('should handle names with only a first name', () => {
        const name = "John";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "John",
            middleName: "",
            lastName: "",
            salutation: "",
            suffix: ""
        });
    });

    it('should handle names with case variations', () => {
        const name = "jOhN dOe";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "jOhN",
            middleName: "",
            lastName: "dOe",
            salutation: "",
            suffix: ""
        });
    });

    it('should handle names consisting only of a salutation', () => {
        const name = "Mr.";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "",
            middleName: "",
            lastName: "",
            salutation: "Mr",
            suffix: ""
        });
    });

    it('should handle names consisting only of a suffix', () => {
        const name = "Jr.";
        const result = parseName(name);
        expect(result).toEqual({
            firstName: "",
            middleName: "",
            lastName: "",
            salutation: "",
            suffix: "Jr"
        });
    });

});

