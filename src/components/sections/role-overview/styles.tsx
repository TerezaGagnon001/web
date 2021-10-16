import styled from 'styled-components'

export const Container = styled.div`
  max-width: ${({ theme }) => theme.contentSize}px;
  margin: 0 auto;
`

export const RoleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 22px 0;
  border-bottom: 1px solid #f0f0f2;
`

export const RoleMetaWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 14px;
`

export const RoleRightWrapper = styled.div`
  display: flex;
  gap: 24px;
  text-align: right;
  a {
    text-decoration: none;
  }
`

export const RoleLogo = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: gray;
`
