/**
 * @file objectToUrlParams.js
 * @author huangzongzhe
 */

module.exports.objectToUrlParams = object => {
    return Object.keys(object).map(function (key) {
        return key + '=' + object[key];
    }).join('&');
};
