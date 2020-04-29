'use strict';

const micromatch = require('micromatch');
const template = require('./template');

module.exports = function(locals) {
  const { config } = this;
  const skipRenderList = [
    '**/*.js',
    '**/*.css'
  ];

  if (Array.isArray(config.skip_render)) {
    skipRenderList.push(...config.skip_render);
  } else if (typeof config.skip_render === 'string') {
    if (config.skip_render.length > 0) {
      skipRenderList.push(config.skip_render);
    }
  }

  const extra_pages = Array.isArray(locals.add_to_sitemap) ? locals.add_to_sitemap : []

  const posts = [].concat(locals.posts.toArray(), locals.pages.toArray(), extra_pages)
    .filter(post => {
      return post.sitemap !== false && !isMatch(post.source, skipRenderList);
    })
    .sort((a, b) => {
      return b.updated - a.updated;
    });

  if (posts.length <= 0) {
    config.sitemap.rel = false;
    return;
  }

  const xml = template(config).render({
    config,
    posts
  });

  return {
    path: config.sitemap.path,
    data: xml
  };
};

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns);
}
