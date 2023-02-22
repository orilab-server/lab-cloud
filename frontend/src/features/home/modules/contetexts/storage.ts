import React from 'react';
import { StorageItem } from '../../types/storage';

export const StorageContext = React.createContext<
  { fileNames: StorageItem[]; important: boolean } | undefined
>(undefined);
