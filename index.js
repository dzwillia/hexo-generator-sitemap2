/* global hexo */
'use strict';

const { extname } = require('path');

hexo.config.sitemap = Object.assign({
  path: 'sitemap.xml',
  rel: false
}, hexo.config.sitemap);

const config = hexo.config.sitemap;

if (!extname(config.path)) {
  config.path += '.xml';
}

hexo.on('generateBefore', function(post){
  hexo.extend.generator.register('lazy-sitemap', require('./lib/generator'));
})

if (config.rel === true) {
  hexo.extend.filter.register('after_render:html', require('./lib/rel'));
}
