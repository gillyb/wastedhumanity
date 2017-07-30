const convertStringToRegex = (str) => {
    return new RegExp(str, 'g');
};

module.exports = {

    getSlug: (str) => {
        return str
            .replace(/\s/g, '-');
    }

};