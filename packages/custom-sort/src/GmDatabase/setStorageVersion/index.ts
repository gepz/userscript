import reservedKeys from '../reservedKeys';

export default (version: number): Promise<void> => GM.setValue(
  reservedKeys.version,
  version,
);
