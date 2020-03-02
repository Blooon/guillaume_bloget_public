// import requestUtils from '../Utils/request.utils'

export class PaiementUtils {

    static calcul_fees(items, country) {
        const pays = country.toLowerCase();
        const europe_fr = ['allemagne', 'autriche', 'belgique', 'bulgarie', 'chypre', 'croatie', 'danemark', 'espagne', 'estonie', 'finlande', 'grèce', 'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'royaume-unie', 'slovaquie', 'slovénie', 'suède', 'suisse', 'tchéquie']
        const europe_en = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'denmark', 'estonia', 'finland', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'united kingdom']
        let dest;
        if (pays === 'france') {
            dest = '_france'
        } else if (europe_fr.includes(pays) || europe_en.includes(pays)) {
            dest = '_europe'
        } else {
            dest = '_world'
        }
        return Math.max.apply(Math, items.map(function(item) {return item['fee' + dest]}))
    }

    static getFees(items) {
        let fees = 0;
        for (var i = 0; i < items.length; i++) {
            fees += items[i].fee
        }
        return fees
    }

    static getDeliveryTime(country, lang) {
        const pays = country.toLowerCase();
        const europe_fr = ['allemagne', 'autriche', 'belgique', 'bulgarie', 'chypre', 'croatie', 'danemark', 'espagne', 'estonie', 'finlande', 'grèce', 'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'royaume-unie', 'slovaquie', 'slovénie', 'suède', 'suisse', 'tchéquie']
        const europe_en = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'denmark', 'estonia', 'finland', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'united kingdom']
        let time;
        if (pays === 'france') {
            time = (lang === 'fr') ? "3 à 7 jours ouvrés" : "3-7 business days"
        } else if (europe_fr.includes(pays) || europe_en.includes(pays)) {
            time = (lang === 'fr') ? "2 à 3 semaines" : "2-3 weeks"
        } else {
            time = (lang === 'fr') ? "3 à 4 semaines" : "3-4 weeks"
        }
        return ((lang === 'fr') ? "Délai de livraison estimé : " : "Estimated delivery time : ") + time
    }
}

