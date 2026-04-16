import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({ onLogout,userInfo }) => {
  return (
    <div className='flex items-center gap-2 sm:gap-3'>
      <div className='w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-slate-950 dark:text-slate-100 font-medium bg-slate-100 dark:bg-slate-700 transition-all text-xs sm:text-sm'>
        {getInitials(userInfo?.username)}
      </div>
      <div className='hidden md:block'>
        <p className='text-sm font-medium text-slate-800 dark:text-white'>{userInfo?.username}</p>
      </div>
      <button className='text-[11px] sm:text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all font-medium' onClick={onLogout}>
        Logout
      </button>
    </div>
    
  )
}

export default ProfileInfo
