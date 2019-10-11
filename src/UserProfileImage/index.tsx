import React, { FC } from 'react'
import * as Styled from './UserProfileImage.styled'
export interface IUserProfileImageProps {
  profileImageUrl?: string
}

const UserProfileImage: FC<IUserProfileImageProps> = ({ profileImageUrl }) =>
  profileImageUrl ? (
    <Styled.Image src={profileImageUrl} />
  ) : (
    <strong className="fa fa-user-o fa-2x" />
  )

export default UserProfileImage
