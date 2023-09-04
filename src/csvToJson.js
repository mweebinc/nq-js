import Papa from "papaparse";

function csvToJson(file) {
    return new Promise(resolve => {
        Papa.parse(file, {
            header: true,
            complete: result => resolve(result.data)
        });
    });
}

export default csvToJson;