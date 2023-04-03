import * as log from '@/Log';

const maxEntries = 10000;

export default Math.floor(maxEntries / log.blockSize);
