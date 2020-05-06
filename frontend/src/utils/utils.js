import { parse } from 'qs';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);
