const checkCondition = require('../src/checkCondition');  // Modify the path appropriately

describe('Visibility Condition Checker', () => {

    describe('checkIfCondition', () => {
        it('should return false if the condition does not match', () => {
            const condition = {employment_status: "EMPLOYED"};
            const object = {employment_status: "UNEMPLOYED"};
            expect(checkCondition({if: condition}, object)).toBe(false);
        });

        it('should return true if the condition matches', () => {
            const condition = {employment_status: "EMPLOYED"};
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({if: condition}, object)).toBe(true);
        });

        it('should return true for a NOT condition that does not match', () => {
            const condition = {not: {employment_status: "UNEMPLOYED"}};
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({if: condition}, object)).toBe(true);
        });

        it('should return false for a NOT condition that matches', () => {
            const condition = {not: {employment_status: "EMPLOYED"}};
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({if: condition}, object)).toBe(false);
        });
    });

    describe('checkConditions using OR', () => {
        it('should return true if at least one of the conditions matches', () => {
            const conditions = [{if: {employment_status: "SELF-EMPLOYED"}}, {if: {employment_status: "EMPLOYED"}}];
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({or: conditions}, object)).toBe(true);
        });

        it('should return false if none of the conditions match', () => {
            const conditions = [{if: {employment_status: "SELF-EMPLOYED"}}, {if: {employment_status: "UNEMPLOYED"}}];
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({or: conditions}, object)).toBe(false);
        });
    });

    describe('checkConditions using AND', () => {
        it('should return true if all conditions match', () => {
            const conditions = [{if: {employment_status: "EMPLOYED"}}, {if: {job_title: "ENGINEER"}}];
            const object = {employment_status: "EMPLOYED", job_title: "ENGINEER"};
            expect(checkCondition({and: conditions}, object)).toBe(true);
        });

        it('should return false if at least one condition does not match', () => {
            const conditions = [{if: {employment_status: "EMPLOYED"}}, {if: {job_title: "DOCTOR"}}];
            const object = {employment_status: "EMPLOYED", job_title: "ENGINEER"};
            expect(checkCondition({and: conditions}, object)).toBe(false);
        });
    });

    describe('checkCondition with "or" and "not"', () => {
        const conditions = [
            {
                "if": {
                    "not": {
                        "employment_status": "SELF-EMPLOYED"
                    }
                }
            },
            {
                "if": {
                    "not": {
                        "employment_status": "UNEMPLOYED"
                    }
                }
            }];

        it('should return false if employment_status is SELF-EMPLOYED', () => {
            expect(checkCondition({and: conditions}, {employment_status: "SELF-EMPLOYED"})).toBe(false);
            expect(checkCondition({and: conditions}, {employment_status: "UNEMPLOYED"})).toBe(false);
            expect(checkCondition({and: conditions}, {employment_status: "FULL-TIME"})).toBe(true);
        });

        it('should return false if employment_status is UNEMPLOYED', () => {
            const object = {employment_status: "UNEMPLOYED"};
            expect(checkCondition({and: conditions}, object)).toBe(false);
        });

        it('should return true if employment_status is neither SELF-EMPLOYED nor UNEMPLOYED', () => {
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition({or: conditions}, object)).toBe(true);
        });

        it('should return true if employment_status field is absent', () => {
            const object = {};
            expect(checkCondition({or: conditions}, object)).toBe(true);
        });
    });

    describe('checkCondition', () => {
        it('should return false if no conditions provided', () => {
            const options = {};
            const object = {employment_status: "EMPLOYED"};
            expect(checkCondition(options, object)).toBe(false);
        });
    });
});
