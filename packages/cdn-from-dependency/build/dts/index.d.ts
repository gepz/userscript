declare const _default: <T>(dependencies: T & Record<string, string>, name: string | (keyof T & string)) => {
    name: string;
    ver: string;
    nameVer: string;
    begin: 'https://';
    end: '.min.js';
};
export default _default;
