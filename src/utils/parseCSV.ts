export function parseCSV(csvString: string, delimiter = ',') {
    const lines = csvString.trim().split('\n')

    if (lines.length < 2) throw new Error('Invalid CSV string')

    const keys = lines[0].split(delimiter).map((key) => key.trim())
    const values = lines.slice(1).map((line) => line.split(delimiter).map((value) => value.trim()))

    return values.map((row) => {
        const obj = {} as any
        row.forEach((value, index) => {
            obj[keys[index]] = value
        })
        return obj
    })
}
