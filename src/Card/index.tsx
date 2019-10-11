import React, { CSSProperties, ReactNode, FC } from 'react'
import * as Styled from './Card.styled'

export interface ICardProps {
  style?: CSSProperties
  title?: ReactNode
  subtitle?: ReactNode
  removeButton?: boolean
  renderHeader?: () => ReactNode
  onRemove?: () => void
}

const Card: FC<ICardProps> = (props) => {
  const header = props.renderHeader ? (
    props.renderHeader()
  ) : (
    <div>
      <Styled.Title>{props.title}</Styled.Title>
      <Styled.Subtitle>{props.subtitle}</Styled.Subtitle>
    </div>
  )

  return (
    <Styled.Container style={props.style}>
      <Styled.Header className="clearfix">
        {props.removeButton && (
          <Styled.RemoveButton className="btn btn-link btn-xs" onClick={() => props.onRemove}>
            <i className="fa fa-times text-danger" />
            <span className="sr-only">Remove</span>
          </Styled.RemoveButton>
        )}
        {header}
      </Styled.Header>
      <Styled.Body>{props.children}</Styled.Body>
    </Styled.Container>
  )
}

export default Card
