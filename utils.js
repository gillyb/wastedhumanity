const convertStringToRegex = (str) => {
    return new RegExp(str, 'g');
};

module.exports = {

    getSlug: (str) => {
        return str.replace(/[^a-zA-Z0-9-_.]/g, '-');
    }

};