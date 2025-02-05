import { CreatePagesArgs } from 'gatsby'
import { resolve } from 'path'
import { Project, Event, Opportunity } from './generated/graphql-types'

const PROJECT_TEMPLATE_RELATIVE_PATH = './src/templates/project/index.tsx'
const SUPPORTED_LANGUAGES = ['cs']

export function getProjectUrl(args: { lang: string; slug: string }): string {
  return args.lang === 'cs'
    ? `/projekty/${args.slug}`
    : `/${args.lang}/projects/${args.slug}`
}

export async function generateProjectPages({
  graphql,
  actions: { createPage },
}: CreatePagesArgs): Promise<void> {
  const result = await graphql<{ allProject: { nodes: Project[] } }>(`
    query GenerateProjectPages {
      allProject {
        nodes {
          lang
          slug
          id
        }
      }
    }
  `)

  result?.data?.allProject.nodes
    .filter((node) => SUPPORTED_LANGUAGES.includes(node.lang))
    .forEach((node: Project) => {
      const projectUrl = getProjectUrl(node)
      createPage({
        path: projectUrl,
        component: resolve(PROJECT_TEMPLATE_RELATIVE_PATH),
        context: {
          id: node.id,
        },
      })
    })
}

export async function generateEventPages({
  graphql,
  actions: { createPage },
}: CreatePagesArgs): Promise<void> {
  const result = await graphql<{ allEvent: { nodes: Event[] } }>(`
    query GenerateEventPages {
      allEvent(filter: { status: { in: ["live", "unlisted"] } }) {
        nodes {
          id
          name
          slug
        }
      }
    }
  `)

  result?.data?.allEvent.nodes.forEach((node: Event) => {
    createPage({
      path: `/events/${node.slug}`,
      component: resolve('./src/templates/event/index.tsx'),
      context: {
        id: node.id,
      },
    })
  })
}

export async function generateRolePages({
  graphql,
  actions: { createPage },
}: CreatePagesArgs): Promise<void> {
  const result = await graphql<{ allOpportunity: { nodes: Opportunity[] } }>(`
    query GenerateRolePages {
      allOpportunity(filter: { status: { in: ["live", "unlisted"] } }) {
        nodes {
          id
          name
          slug
        }
      }
    }
  `)

  result?.data?.allOpportunity.nodes.forEach((node: Opportunity) => {
    createPage({
      path: `/roles/${node.slug}`,
      component: resolve('./src/templates/roles/index.tsx'),
      context: {
        id: node.id,
      },
    })
  })
}
