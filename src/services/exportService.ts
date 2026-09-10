// service is convert data (invoice & reports) in CSV and PDF format 

export const exportService = {
    toCSV: <T extends Record<string, any>>(data: T[], fileName: string): void => {

        if (!data || data.length === 0) {
            console.warn('No data to export');
            return
        }
        // for extract Headers (key of data object)
        const headers = Object.keys(data[0])

        // for biuld CSV rows
        const csvRows = []

        // header row
        csvRows.push(headers.join(","))

        // data row

        for (const row of data) {
            const values = headers.map((header) => {
                const value = row[header]
                if (typeof value === "string" && value.includes(",")) {
                    return `${value}`

                }

                if (value === null || value === undefined) {
                    return ' '
                }
                return String(value)
            })
            csvRows.push(values.join(","))
        }

        // create Blob

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: `text/csv;charset=utf-8;` })

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url
        link.download = `${fileName}.csv`
        document.body.appendChild(link);
        link.click();
        // Temporary URL ko memory se free krta h 
        document.body.removeChild(link);
        URL.revokeObjectURL(url)
        console.log(` CSV exported: ${fileName}.csv`);


    },


    // JSON Export (alternative) in JSON format

    toJSON: <T>(data: T[], fileName: string): void => {
        //(data,replace:null,space:2)
        // just reading m sahi lagta h 
        // {
        // "id": "1,
        //"name":"usama"
        // "} is tara hota h 
        const jsonString = JSON.stringify(data, null, 2)

        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url
        link.download = `${fileName}.json`
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log(` JSON exported: ${fileName}.json`);

    }

}
