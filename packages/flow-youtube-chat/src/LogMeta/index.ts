import {
  Context,
  Option as O,
} from 'effect';

export default class LogMeta extends Context.Reference<LogMeta>()('LogMeta', {
  defaultValue: () => O.none<unknown>(),
}) {}
