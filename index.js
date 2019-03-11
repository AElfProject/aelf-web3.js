var Aelf = require('./lib/aelf');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Aelf === 'undefined') {
    window.Aelf = Aelf;
}

module.exports = Aelf;
