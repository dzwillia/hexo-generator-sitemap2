'use strict'

const micromatch = require('micromatch')
const template = require('./template')

module.exports = function(locals) {
  const { config } = this
  const skipRenderList = [
    '**/*.js',
    '**/*.css'
  ]

  if (Array.isArray(config.skip_render)) {
    skipRenderList.push(...config.skip_render)
  } else if (typeof config.skip_render === 'string') {
    if (config.skip_render.length > 0) {
      skipRenderList.push(config.skip_render)
    }
  }

  const data = locals.data || {}
  const generated = data.generated || {}
  const generated_pages = generated.pages || []

  const posts = [].concat(locals.posts.toArray(), locals.pages.toArray(), generated_pages)
    .map(p => {
      return {
        path: p.path.replace(/\/?index.html/g, '/'),
        updated: p.updated,
        sitemap: p.sitemap
      }
    })
    .filter(p => {
      return p.sitemap !== false && (p.source === undefined || !isMatch(p.source, skipRenderList))
    })
    .sort((a, b) => {
      return b.updated - a.updated
    })

  if (posts.length <= 0) {
    config.sitemap.rel = false
    return
  }

  const xml = template(config).render({
    config,
    posts
  })

  return {
    path: config.sitemap.path,
    data: xml
  }
}

function isMatch(path, patterns) {
  return micromatch.isMatch(path, patterns)
}
