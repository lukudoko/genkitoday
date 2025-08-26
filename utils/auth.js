// utils/auth.js
import { signOut } from "next-auth/react";
import { clearAllCache } from '@/utils/cache';

export const signOutAndClearCache = async () => {
  clearAllCache();
  //console.log('Cache cleared due to user logout');
  await signOut();
};