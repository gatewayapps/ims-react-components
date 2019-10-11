import React, { FC } from 'react'
import { I_v_UserAccount } from '@gatewayapps/ims-hub-services'

export interface IDisplayNameProps {
  user: I_v_UserAccount
}

const DisplayName: FC<IDisplayNameProps> = (props) => {
  const { user, ...spanProps } = props
  if (!user) {
    return null
  } else if (user.displayName) {
    return <span {...spanProps}>{user.displayName}</span>
  } else {
    return (
      <span {...spanProps}>
        {user.firstName} {user.lastName}
      </span>
    )
  }
}

export default DisplayName
