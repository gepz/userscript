import TextGetter from '@/TextGetter';
import AppNodeTextKey from '@/appNode/AppNodeTextKey';

type AppTextGetter<Key, State> = TextGetter<Key | AppNodeTextKey, State>;

export default AppTextGetter;

