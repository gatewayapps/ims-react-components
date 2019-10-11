import React, { CSSProperties, FC } from 'react'
import { I_v_UserAccount } from '@gatewayapps/ims-hub-services'
import moment from 'moment'
import * as Styled from './PersonCard.styled'
import * as CardStyled from '../Card/Card.styled'
import Card, { ICardProps } from '../Card'
import UserProfileImage from '../UserProfileImage'
import DisplayName from '../DisplayName'
import NodePath from '../NodePath'

export interface IPersonCardProps extends ICardProps {
  person: I_v_UserAccount
  showPositionStartDate?: boolean
  showHireDate?: boolean
  style: CSSProperties
}

const PersonCard: FC<IPersonCardProps> = ({
  person,
  showHireDate,
  showPositionStartDate,
  ...props
}) => {
  const hireDate =
    showHireDate && person.hireDate ? (
      <span>Hired {moment(person.hireDate).format('M/D/YYYY')}</span>
    ) : null

  const positionDate =
    showPositionStartDate && person.positionStartDate ? (
      <span>Position {moment(person.positionStartDate).format('M/D/YYYY')}</span>
    ) : null

  const renderHeader = () => (
    <Styled.HeaderContainer>
      <Styled.HeaderLeftContainer>
        <UserProfileImage profileImageUrl={person.profileImageUrl} />
      </Styled.HeaderLeftContainer>
      <Styled.HeaderRightContainer>
        <CardStyled.Title>
          <DisplayName user={person} />
        </CardStyled.Title>
        <Styled.Subtitle double={showHireDate || showPositionStartDate}>
          <Styled.TextEllipsis title={person.positionPath || undefined}>
            <NodePath path={person.positionPath || undefined} removeFirst />
          </Styled.TextEllipsis>
          <div>
            {hireDate} {positionDate}
          </div>
        </Styled.Subtitle>
      </Styled.HeaderRightContainer>
    </Styled.HeaderContainer>
  )

  return <Card renderHeader={renderHeader} {...props} />
}

export default PersonCard
