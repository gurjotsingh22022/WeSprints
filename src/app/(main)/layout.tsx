"use client"

import React from 'react'
import SideBar from '../dashboard/page';
import { OrgContext, useOrgInfoContext } from '../contexts/orgContext';
import { getCookie } from 'cookies-next/client';
import { getJwtCookie } from '@/actions/cookies';
import { IsProChanged } from '../contexts/isProChangedContext';

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {

    
  return (
    <>
    <IsProChanged>
      <SideBar>
        {children}
    </SideBar>
    
    
    </IsProChanged>
    </>
  )
}

export default Layout;