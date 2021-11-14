import { Layout, SectionContent, Section } from 'components/layout'
import RolesPaging from 'page-components/portal-dobrovolnika/roles/roles-paging'
import * as Typography from 'components/typography'
import { Opportunity } from 'generated/graphql-types'
import React, { useState } from 'react'
import styled from 'styled-components'
import RoleItem from '../../../components/sections/role-overview'
import { CompetencyFilterLabel, CompetencyFilterCheckbox } from '../styles'

interface RolesProps {
  data: {
    roles: { nodes: Opportunity[] }
  }
  page: number
  selectedSkills: { id: number; key: string }[]
}

const RolesCountSpan = styled.span`
  color: gray;
`
const PAGE_SIZE = 15

const Roles: React.FC<RolesProps> = (props) => {
  const [currentPage, setPage] = useState(props.page || 1)
  const [selectedSkills, updateSelectedSkills] = useState(
    props.selectedSkills || []
  )
  const onPageSelected = (index: number) => {
    setPage(index)
  }

  function handleSkillSelectionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newSelectedSkills = [...selectedSkills]
    if (
      e.target.checked &&
      !newSelectedSkills.find((s) => s.id.toString() === e.target.name)
    ) {
      const skillToAdd:
        | { id: number; key: string }
        | undefined = allSkills.find((s) => s.id.toString() === e.target.name)
      if (skillToAdd) newSelectedSkills.push(skillToAdd)
    }
    if (
      !e.target.checked &&
      newSelectedSkills.find((s) => s.id.toString() === e.target.name)
    )
      newSelectedSkills.splice(
        newSelectedSkills.map((s) => s.id.toString()).indexOf(e.target.name),
        1
      )

    updateSelectedSkills(newSelectedSkills)

    // If the selection changed, we go to first page, because it makes sense - if we stayed at a later page, different set of entries would be on the previous ones.
    if (currentPage > 1 && newSelectedSkills.length !== selectedSkills.length)
      setPage(1)
  }

  function filterRoles() {
    if (selectedSkills.length === 0) filteredRoles = allRoles
    else {
      filteredRoles = []
      selectedSkills.forEach((s) => {
        allRoles.forEach((r) => {
          r.skills.some((rs) => {
            if (rs === s.key) {
              filteredRoles.push(r)
            }
          })
        })
      })
    }
    paginatedRoles = filteredRoles.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    )
  }

  function getSkills() {
    let toReturn: { id: number; key: string }[] = []
    let i = 0
    allRoles.forEach((r) => {
      r.skills &&
        r.skills.forEach((s) => {
          if (!toReturn.find((f) => f.key === s))
            toReturn.push({ id: i++, key: s })
        })
    })

    // We sort; "Other" goes to the end
    toReturn = toReturn.sort((a, b) => {
      if (a.key === 'Other') return 1
      else if (b.key === 'Other') return -1
      else if (a.key < b.key) return -1
      else if (a.key > b.key) return 1
      else return 0
    })

    return toReturn
  }

  const allRoles = props.data.roles.nodes
  const allSkills = getSkills()
  let filteredRoles: Opportunity[] = [],
    paginatedRoles: Opportunity[] = []
  filterRoles()

  return (
    <Layout
      crumbs={[
        { label: 'Portál dobrovolníka', path: '../portal-dobrovolnika' },
        { label: 'Volné pozice' },
      ]}
      seo={{
        title: 'Volné pozice - Portál dobrovolníka',
        description: 'Volné pozice - Portál dobrovolníka',
      }}
    >
      <Section>
        <SectionContent>
          <Typography.Heading1>Filtr dle kompetencí</Typography.Heading1>
          {allSkills.map((s) => [
            <CompetencyFilterLabel key={'competencyLabel' + s.id}>
              {s.key}
            </CompetencyFilterLabel>,
            <CompetencyFilterCheckbox
              key={'competencyInput' + s.id}
              type="checkbox"
              name={s.id.toString()}
              onChange={handleSkillSelectionChange}
            />,
          ])}
        </SectionContent>
      </Section>
      <Section>
        <SectionContent>
          <Typography.Heading1>
            Volné pozice <RolesCountSpan>{filteredRoles.length}</RolesCountSpan>
          </Typography.Heading1>
        </SectionContent>
      </Section>
      <Section>
        <SectionContent>
          {paginatedRoles.map((r) => (
            <RoleItem
              key={r.id}
              id={r.id}
              name={r.name}
              skills={r.skills}
              project={r.project}
              timeRequirements={r.timeRequirements}
              slug={r.slug}
            />
          ))}
        </SectionContent>
      </Section>
      <Section>
        <SectionContent>
          <RolesPaging
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRoles.length / PAGE_SIZE)}
            onPageSelected={onPageSelected}
          />
        </SectionContent>
      </Section>
    </Layout>
  )
}

export default Roles
