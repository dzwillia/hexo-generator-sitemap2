/* global hexo */
'use strict';

const { extname } = require('path');

const config = hexo.config.sitemap = Object.assign({
  path: 'sitemap.xml',
  rel: true
}, hexo.config.sitemap);

if (!extname(config.path)) {
  config.path += '.xml';
}

hexo.extend.generator.register('sitemap', require('./lib/generator'));

if (config.sitemap.rel === true) {
  hexo.extend.filter.register('after_render:html', require('./lib/rel'));
}
