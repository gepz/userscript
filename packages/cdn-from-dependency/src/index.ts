const getExactVersion = (str: string) => str.replace(/\D+/, '');

export default <T>(
  dependencies: T & Record<string, string>,
  name: keyof typeof dependencies & string,
): {
  name: string,
  ver: string,
  nameVer: string
  begin: 'https://',
  end: '.min.js',
} => {
  const ver = getExactVersion(dependencies[name]);
  return {
    name,
    ver,
    nameVer: `${name}@${ver}`,
    begin: 'https://',
    end: '.min.js',
  };
};
