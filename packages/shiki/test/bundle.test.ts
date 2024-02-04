import { expect, it } from 'vitest'

it('bundle-full', async () => {
  const highlighter = await import('shiki/bundle/full').then(r => r.getHighlighter({
    langs: Object.keys(r.bundledLanguages),
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`251`)
})

it('bundle-web', async () => {
  const highlighter = await import('shiki/bundle/web').then(r => r.getHighlighter({
    langs: Object.keys(r.bundledLanguages),
  }))

  expect(highlighter.getLoadedLanguages().length)
    .toMatchInlineSnapshot(`80`)
})