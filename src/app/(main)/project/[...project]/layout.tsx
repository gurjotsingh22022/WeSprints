'use client'

import { IssueOpener } from '@/app/contexts/IssueOpener';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import React, { useContext, useState } from 'react'

const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <>
    <IssueOpener>
      {children}
    </IssueOpener>
    
    </>
  )
}

export default Layout;
