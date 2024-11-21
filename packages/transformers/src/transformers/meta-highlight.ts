import type { ShikiTransformer } from 'shiki'

export function parseMetaHighlightString(meta: string): number[] | null {
  if (!meta)
    return null
  const match = meta.match(/\{([\d,-]+)\}/)
  if (!match)
    return null
  const lines = match[1]
    .split(',')
    .flatMap((v) => {
      const num = v.split('-').map(v => Number.parseInt(v, 10))
      if (num.length === 1)
        return [num[0]]
      else
        return Array.from({ length: num[1] - num[0] + 1 }, (_, i) => i + num[0])
    })
  return lines
}

export interface TransformerMetaHighlightOptions {
  /**
   * Class for highlighted lines
   *
   * @default 'highlighted'
   */
  className?: string

  /**
   * If true, word indices are 0-based (default is false, which is 1-based)
   *
   * @default false
   */
  zeroIndexed?: boolean
}

const symbol = Symbol('highlighted-lines')

/**
 * Allow using `{1,3-5}` in the code snippet meta to mark highlighted lines.
 */
export function transformerMetaHighlight(
  options: TransformerMetaHighlightOptions = {},
): ShikiTransformer {
  const {
    className = 'highlighted',
    zeroIndexed = false,
  } = options

  return {
    name: '@shikijs/transformers:meta-highlight',
    line(node, line) {
      if (!this.options.meta?.__raw) {
        return
      }
      ;(this.meta as any)[symbol] ||= parseMetaHighlightString(this.options.meta.__raw)
      const lines: number[] = (this.meta as any)[symbol] || []
      const lineIndex: number = zeroIndexed ? line - 1 : line
      if (lines.includes(lineIndex))
        this.addClassToHast(node, className)
      return node
    },
  }
}
