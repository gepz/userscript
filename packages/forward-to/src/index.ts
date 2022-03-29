import {
  Observer,
} from 'rxjs';

export default <T>(observer: Observer<T>) => (value: T): void => {
  observer.next(value);
};
