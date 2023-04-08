const getExactVersion = (str) => str.replace(/\D+/, '');
export default (dependencies, name) => {
    const ver = getExactVersion(dependencies[name]);
    return {
        name,
        ver,
        nameVer: `${name}@${ver}`,
        begin: 'https://',
        end: '.min.js',
    };
};
//# sourceMappingURL=index.js.map