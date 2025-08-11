const validator = (dataObj) => {
    const missingFields = Object.entries(dataObj)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

    return {
        isValid : missingFields.length === 0,
        missingFields
    }
}


module.exports = validator