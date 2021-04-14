/**
 * @flow
 */

import { stripIndent, source } from 'common-tags'
import type { SanitizedValues, Generator } from '../../../types'

const generator: Generator = {
  profileSection(basics) {
    if (!basics) {
      return ''
    }

    const { name = '', email, phone, location = {}, website, visa } = basics
    const info = [location.address, phone, this.href(email, 'mailto:'), this.href(website), visa].filter(Boolean)

    return stripIndent`
      % Personal
      % -----------------------------------------------------
      \\textcolor{tdi}{\\fontsize{\\sizemast}{\\sizemast}\\selectfont ${name}}
      \\\\
      \\vspace{-0.74em}
      \\textcolor{tdi}{\\hrule height 1pt}
      \\vspace{0.74em}
      {\\raggedright
      ${info.map(x => `\\mbox{${x}}`).join('\\discretionary{}{}{\\mbox{ | }}')}\\par
      }
    `
  },

  educationSection(education, heading) {
    if (!education) {
      return ''
    }

    return source`
      % Chapter: Education
      % ------------------

      \\chap{${heading || 'Education'}}{
        \\begin{nobullets}

      ${education.map(school => {
        const {
          institution = '',
          area = '',
          studyType = '',
          startDate = '',
          endDate = ''
        } = school

        const degreeLine = [studyType, area].filter(Boolean).join(' in ')
        let dateRange = ''

        if (startDate && endDate) {
          dateRange = `${startDate} – ${endDate}`
        } else if (startDate) {
          dateRange = `${startDate} – Present`
        } else {
          dateRange = endDate
        }

        const schoolItems = [degreeLine, institution, dateRange].filter(Boolean)

        return `\\item \\textbf{${schoolItems.join(' | ')}}`
      })}
      \\end{nobullets}
      }
    `
  },

  workSection(work, heading) {
    if (!work) {
      return ''
    }

    return source`
      % Chapter: Work Experience
      % ------------------------
      \\chap{${heading || 'Experience'}}{

      ${work.map(job => {
        const {
          company = '',
          position = '',
          location = '',
          startDate = '',
          endDate = '',
          highlights = []
        } = job

        let dateRange = ''
        let dutyLines = ''

        if (startDate && endDate) {
          dateRange = `${startDate} – ${endDate}`
        } else if (startDate) {
          dateRange = `${startDate} – Present`
        } else {
          dateRange = endDate
        }

        if (highlights.length) {
          dutyLines = source`
            \\begin{newitemize}
              ${highlights.map(duty => `\\item {${duty}}`)}
            \\end{newitemize}
            `
        }

        return stripIndent`
          \\job
            {${company}}
            {${dateRange}}
            {${position}}
            {${location}}
            {${dutyLines}}
        `
      })}
    }
    `
  },

  skillsSection(skills, heading) {
    if (!skills) {
      return ''
    }

    return source`
      % Chapter: Skills
      % ------------------------

      \\chap{${heading || 'Technical Skills'}}{
      \\begin{nobullets}
        ${skills.map(skill => {
          const { name = '', keywords = [] } = skill

          let item = ''

          if (name) {
            item += `\\textbf{\\MakeUppercase{${name}:}} `
          }

          if (keywords.length > 0) {
            item += keywords.join(' | ')
          }

          return `\\item ${item}`
        })}
      \\end{nobullets}
      }
    `
  },

  projectsSection(projects, heading) {
    if (!projects) {
      return ''
    }

    return source`
      % Chapter: Projects
      % ------------------------

      \\chap{${heading || 'Projects'}}{

        ${projects.map(project => {
          const {
            name = '',
            description = '',
            keywords = [],
            url = ''
          } = project

          let desc = ''
          let inlist = false
          for (const line of description.split('\n')) {
            if (line.startsWith('-')) {
              if (!inlist) {
                desc += '\\begin{newitemize}\n'
                inlist = true
              }
              desc += `\\item ${line.slice(1)}\n`
            } else {
              if (inlist) {
                desc += '\\end{newitemize}\n'
                inlist = false
              }
              desc += `${line}\n`
            }
          }
          if (inlist)
            desc += '\\end{newitemize}\\vspace{-\\sizefive}\n'
            // Both new itemize and project add space at end; this undoes one
          else if (desc)
            desc += '\n'  // Make sure next thing starts as new para

          return stripIndent`
            \\project
              {${name}}
              {${keywords.join(', ')}}
              {${this.href(url)}}
              {${desc}}
          `
        })}
      }
    `
  },

  href(url, protocol='http://') {
    if (!url)
      return ''
    if (url.search('://') > -1)
      return `\\href{${url}}{${url.replace('//', '/$\\!$/')}}`
    return `\\href{${protocol}${url}}{${url}}`
  }
}

function tditemplate(values: SanitizedValues) {
  const { headings = {} } = values

  return stripIndent`
    \\documentclass[11pt]{article}
    \\usepackage[english]{babel}
    \\input{config/minimal-resume-config}
    \\begin{document}
    ${values.sections
      .map(section => {
        switch (section) {
          case 'profile':
            return generator.profileSection(values.basics)

          case 'education':
            return generator.educationSection(
              values.education,
              headings.education
            )

          case 'work':
            return generator.workSection(values.work, headings.work)

          case 'skills':
            return generator.skillsSection(values.skills, headings.skills)

          case 'projects':
            return generator.projectsSection(values.projects, headings.projects)

          default:
            return ''
        }
      })
      .join('\n')}
    \\end{document}
  `
}

export default tditemplate
