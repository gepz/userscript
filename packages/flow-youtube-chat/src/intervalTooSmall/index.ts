import UserConfigGetter from '@/UserConfigGetter';

const overlapInterval = 0.999;
export default (interval: number) => (
  getConfig: UserConfigGetter,
): boolean => getConfig.noOverlap() && interval < overlapInterval;
