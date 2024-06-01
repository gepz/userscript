import Setter from '@/setter/Setter';
declare const setFilteredString: <S extends string>(allowedStrings: readonly S[]) => Setter<string, S>;
export default setFilteredString;
