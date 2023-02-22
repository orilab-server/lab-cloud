import { User } from '@/features/auth/types/user';
import React from 'react';

export const UserContext = React.createContext<User | undefined>(undefined);
