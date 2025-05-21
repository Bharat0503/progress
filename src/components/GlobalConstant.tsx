
export const REMOVE_HTML_REGEX = /(<([^>]+)>)/gi;

export const stripHtmlTags = (html) => {
    if (!html) return '';

    const removeHtmlTags = html.replace(/<\/?[^>]+(>|$)/g, '');
    const replaceHtmlEntities = removeHtmlTags.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
        const entitiesMap = {
            '&nbsp;': ' ',
            '&lt;': '<',
            '&gt;': '>',
            '&amp;': '&',
            '&quot;': '"',
            '&apos;': "'",
            '&#39;': "'",
            '&iacute;': 'í',
            '&oacute;': 'ó',
            '&eacute;': 'é',
            '&aacute;': 'á',
            '&uacute;': 'ú',
            '&ntilde;': 'ñ',
        };
        return entitiesMap[entity] || '';
    });

    return replaceHtmlEntities.replace(/\n/g, ' ').trim();
};

export function generateRandomId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// constants.js
export const BASE_API_URL_DEEPLINK_DEV = 'https://api-dev.staycurrent.globalcastmd.com/staycurrent';
// export const BASE_API_URL_DEEPLINK_PROD = 'https://api-uat.staycurrent.globalcastmd.com/staycurrent';
//  "associatedDomains": ["applinks:api-uat.staycurrent.globalcastmd.com"]
export const BASE_API_URL_DEEPLINK_PROD = 'https://staycurrentmd.com/staycurrent';


export const BASE_API_URL_DEV = 'https://api-dev.staycurrent.globalcastmd.com';
// export const BASE_API_URL_PROD = 'https://api-uat.staycurrent.globalcastmd.com';
export const BASE_API_URL_PROD = 'https://api.staycurrentmd.com';

export const PRIVACY_POLICY_URL = 'https://globalcastmd.com/privacy-policy/';
export const TERMS_AND_CONDITION_URL = 'https://globalcastmd.com/terms-and-conditions/';

export const constgetContrastColor = (hexColor) => {
    // Remove "#" if present
    hexColor = hexColor.replace(/^#/, '');

    // Convert to RGBlet r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);
};
