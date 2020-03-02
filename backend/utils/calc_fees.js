const france = ["FR"]
const euro_zone1 = ["DE", "BE", "LU", "NL"]
const euro_zone2 = ["AT", "DK", "ES", "FI", "GB", "GR", "IT", "PT", "SE", "IE"];
const euro_zone3 = ["BG", "CY", "HR", "EE", "HU", "LT", "LV", "MT", "PL", "CZ", "RO", "SK", "SI"];

function calcul_fees(item, country) {
    if (france.indexOf(country) !== -1) {
        return item.fee_france
    }
    if (euro_zone1.indexOf(country) !== -1){
        return item.fee_euro_zone1;
    }
    if (euro_zone2.indexOf(country) !== -1){
        return item.fee_euro_zone2;
    }
    if (euro_zone3.indexOf(country) !== -1){
        return item.fee_euro_zone3;
    }
    return (item.fee_world)
}

module.exports = calcul_fees