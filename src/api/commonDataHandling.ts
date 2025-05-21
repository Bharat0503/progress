
export const configAPIDataHandling = (data: any) => {
    let affiliation = []
    let specialities = []
    let societies = []
    let titles = []
    let country = []
    let traineeLevels = []
    let splashImages = data?.getAppConfig?.config["space_images"]
    for (let key in data?.getAppConfig?.config) {
        if (data?.getAppConfig?.config.hasOwnProperty(key)) {
            //console.log(key, data.getAppConfig?.config[key]);
            for (let value in data?.getAppConfig?.config[key]) {
                if (key === "affiliations") {
                    // console.log(value, data?.getAppConfig?.config[key][value]);
                    let affiliation_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name
                    }
                    affiliation.push(affiliation_value)
                }
                else if (key === "specialities") {
                    // console.log("specialities111", data?.getAppConfig[key][value]);
                    let specialities_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name
                    }
                    specialities.push(specialities_value)
                }
                else if (key === "titles") {
                    let titles_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name
                    }
                    titles.push(titles_value)
                }
                else if (key === "countries") {
                    let country_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name,
                        country_code: data?.getAppConfig?.config[key][value]?.country_code,
                        calling_code: data?.getAppConfig?.config[key][value]?.country_calling_code
                    }
                    country.push(country_value)
                }
                else if (key === "traineeLevels") {
                    let traineeLevel_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name,
                        key: data?.getAppConfig?.config[key][value]?.name_key
                    }
                    traineeLevels.push(traineeLevel_value)
                }
                else if (key === "societies") {
                    // console.log("hii", value, data?.getAppConfig?.config[key][value]);
                    let societies_value = {
                        id: data?.getAppConfig?.config[key][value]?.id,
                        name: data?.getAppConfig?.config[key][value]?.name
                    }
                    societies.push(societies_value)
                }

            }
        }
    }
    //  console.log(affiliation,specialities, titles );

    return { affiliation, specialities, titles, country, traineeLevels, splashImages, societies }

}