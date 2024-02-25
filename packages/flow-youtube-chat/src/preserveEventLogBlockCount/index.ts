import maxEventLogBlockCount from '@/maxEventLogBlockCount';

const preserveRatio = 0.2;

export default Math.floor(maxEventLogBlockCount * preserveRatio);

