import {
  PageContainer,
} from '@/PageContainer';

export default (userAgent: string): PageContainer => (
  document.createElement(userAgent.indexOf('Firefox') > -1 ? 'embed' : 'iframe')
);
