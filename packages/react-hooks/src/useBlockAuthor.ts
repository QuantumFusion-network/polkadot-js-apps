// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { AccountId32 } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi } from './useApi.js';

export function useBlockAuthor (header: HeaderExtended | undefined) {
  const [author, setAuthor] = useState<AccountId32 | undefined>(undefined);
  const { api } = useApi();

  useEffect(() => {
    if (!header) {
      return;
    }

    // Use our new derive function
    const sub = api.derive.spin?.blockAuthor(header).subscribe((newAuthor?: AccountId32) => {
      console.log('🔥 SPIN: New block author:', newAuthor?.toString());
      setAuthor(newAuthor);
    });

    return () => sub?.unsubscribe();
  }, [api, header]);

  return author;
}
