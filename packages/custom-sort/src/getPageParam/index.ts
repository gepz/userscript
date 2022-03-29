const getNumberParam = (URL_: URL, name: string) => {
  const param = URL_.searchParams.get(name);
  return param ? Number.parseInt(param, 10) : 0;
};

export default (URL_: URL): number => getNumberParam(URL_, 'page');
