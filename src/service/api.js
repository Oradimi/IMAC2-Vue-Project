const getApiData = async function() {
    const response = await fetch("https://raw.githubusercontent.com/Tibowl/api_start2/master/start2.json")
    if (response.status == 200) {
        return await response.json()
    } else {
        return new Error(response.statusText)
    }
}
export { getApiData }
