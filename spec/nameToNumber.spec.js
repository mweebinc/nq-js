const nameToNumber = require("../src/nameToNumber.js");
const formatNumber = require("../src/formatNumber.js");
const dateToMMDDYY = require("../src/dateToMMDDYY.js");

const names = require("../test.json");

describe("nameToNumber function", function () {
  it("converts a single lowercase letter correctly", function () {
    expect(nameToNumber("a")).toEqual(1);
  });

  it("converts a single uppercase letter correctly", function () {
    expect(nameToNumber("A")).toEqual(1);
  });

  it("converts a simple name correctly", function () {
    // 'j' is the 10th letter, and it's the first character, so 10*1 = 10
    // 'o' is the 15th letter, and it's the second character, so 15*2 = 30
    // 'e' is the 5th letter, and it's the third character, so 5*3 = 15
    // Total = 10 + 30 + 15 = 55
    expect(nameToNumber("Joe")).toEqual(55);
  });

  it("converts name with spaces correctly by ignoring them", function () {
    // Assuming the function is intended to ignore non-alphabetical characters like spaces.
    // This test case will fail if the implementation doesn't ignore spaces.
    // If the implementation should consider spaces, this test needs to be adjusted.
    expect(nameToNumber("J o e")).toEqual(55);
  });

  it("handles an empty string without errors", function () {
    expect(nameToNumber("")).toEqual(0);
  });
  it("ignores non-English alphabetical characters like ñ", function () {
    expect(nameToNumber("Jññe")).toEqual(100);
    expect(nameToNumber("Jnne")).toEqual(100);
  });
  it("ignores non-alphabetical characters", function () {
    // Assuming the function is intended to ignore non-alphabetical characters.
    // This test case will fail if the implementation doesn't ignore them.
    // If the implementation should consider non-alphabetical characters, this test needs to be adjusted.
    expect(nameToNumber("J1o2e3")).toEqual(55);
  });
  it("produces the same output for different names under specific conditions", function () {
    expect(nameToNumber("ab")).toEqual(nameToNumber("ca"));
    expect(nameToNumber("Ali")).toEqual(nameToNumber("Eva"));
  });
  it("produces different output for different names under specific conditions", function () {
    const lastName = "Esguerra";
    const firstName = "Ferdineil John";
    const birthdate = "4/24/1980";

    function birthdateToNumber(birthdate) {
      // Assuming birthdate format is MM/DD/YYYY
      return birthdate.split("/").join("");
    }

    const lastNameNumber = nameToNumber(lastName);
    const firstNameNumber = nameToNumber(firstName);
    const birthdateNumber = birthdateToNumber(birthdate);

    // Simple concatenation example; might need refinement for large numbers
    const uniqueNumber = `${lastNameNumber}${firstNameNumber}${birthdateNumber}`;
    console.log(lastNameNumber);
    console.log(firstNameNumber);
    console.log(birthdateNumber);
    console.log(uniqueNumber);
  });
  it("should check all the name are the same", () => {
    const outputs = {};
    const duplicates = {};
    const names2 = [
      {
        first_name: "Ferdineil",
        last_name: "Esguerra",
        birthdate: "4/24/1980",
      },
    ];
    let count = 0;
    names.forEach((entry) => {
      const first_name = entry.first_name.replaceAll(" ", "");
      const last_name = entry.last_name.replaceAll(" ", "");
      // const birthdate = dateToMMDDYY(entry.birthdate);
      const first_number = nameToNumber(last_name);

      if (first_number < 1000) {
        // console.log(last_name);
        // console.log(first_number);
        count++;
      }
      // const first_number = formatNumber(nameToNumber(first_name), 4);
      // const last_number = formatNumber(nameToNumber(last_name), 4);
      const id = `${first_number}`;
      // const id = `${last_number}${first_number}${birthdate}`;
      // console.log('first_number', first_number);
      // console.log('first_number', first_number);
      // console.log('birthdate', birthdate);
      // console.log('id', id);
      if (outputs.hasOwnProperty(id)) {
        duplicates[id] = duplicates[id] || [outputs[id]];
        if (!duplicates[id].includes(first_name)) {
          duplicates[id].push(first_name);
        }
      } else {
        outputs[id] = first_name;
      }
    });
    console.log("count", count);
    const totalNames = names.length;
    const uniqueOutputs = Object.keys(outputs).length;
    const duplicateGroups = Object.values(duplicates).reduce(
      (acc, group) => acc + group.length - 1,
      0
    );
    const percentageOfDuplicates = (duplicateGroups / totalNames) * 100;

    // console.log(duplicates);
    console.log("Total names:", totalNames);
    console.log("Duplicate groups:", duplicateGroups);
    console.log("Unique numeric outputs:", uniqueOutputs);
    console.log(
      "Percentage of duplicates:",
      percentageOfDuplicates.toFixed(2) + "%"
    );
  });
});
