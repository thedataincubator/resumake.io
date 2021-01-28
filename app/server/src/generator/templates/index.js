/**
 * @flow
 */

import { join } from 'path'
import tditemplate from './tditemplate'
import { TDITEMPLATE } from './constants'
import type { SanitizedValues, TemplateData } from '../../types'

/**
 * Generates the LaTeX document based on the selected template
 * as well as the necessary options needed for it to create a
 * pdf via node-latex.
 *
 * @param data - The sanitized form data from the request body.
 *
 * @return The generated LaTeX document as well as its additional opts.
 */

function getTemplateData(data: SanitizedValues): TemplateData {
  switch (data.selectedTemplate) {

    case TDITEMPLATE:
      return {
        texDoc: tditemplate(data),
        opts: {
          cmd: 'xelatex',
          inputs: join(__dirname, 'tditemplate', 'inputs'),
          fonts: join(__dirname, 'tditemplate', 'inputs')
        }
      }

    default:
      return {
        texDoc: tditemplate(data),
        opts: {
          cmd: 'xelatex',
          inputs: join(__dirname, 'tditemplate', 'inputs'),
          fonts: join(__dirname, 'tditemplate', 'inputs')
        }
      }
  }
}

export default getTemplateData
