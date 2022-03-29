import {
  PageContainer,
} from '@/PageContainer';

export default (page: PageContainer): void => {
  page.src = '';
  page.remove();
};
