"use client";

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const UserAvatar = ({user}:{user:{imageUrl:string, name:string}}) => {

  return (
    <>
        <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.name} />
            <AvatarFallback className="capitalize">
            {user ? user.name : "?"}
            </AvatarFallback>
        </Avatar>
        <span className="text-xs text-gray-500">
            {user ? user.name : "Unassigned"}
        </span>
    </>
  )
}

export default UserAvatar