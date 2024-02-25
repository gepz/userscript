import UserConfig from '@/UserConfig';

const overlapInterval = 0.999;
export default (interval: number) => (
  config: UserConfig,
): boolean => config.noOverlap && interval < overlapInterval;

