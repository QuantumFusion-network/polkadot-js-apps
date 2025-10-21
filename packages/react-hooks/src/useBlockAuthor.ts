// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { AccountId32 } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import { useApi } from './useApi.js';

interface SpinModule {
  blockAuthor: (header: HeaderExtended) => Promise<AccountId32 | undefined>;
}

export function useBlockAuthor (header: HeaderExtended | undefined) {
  const [author, setAuthor] = useState<AccountId32 | undefined>(undefined);
  const { api } = useApi();

  useEffect(() => {
    if (!header) {
      return;
    }

    // DEBUG: Check if our code is loaded
    console.log('🔥 SPIN DEBUG:', {
      api: (api.derive.spin as SpinModule | undefined) ? 'SPIN module exists' : 'No SPIN module',
      blockAuthor: (api.derive.spin as SpinModule | undefined)?.blockAuthor ? 'blockAuthor exists' : 'No blockAuthor',
      header: header.hash.toHex()
    });

    // Temporary stub
    setAuthor(undefined);
  }, [api, header]);

  return author;
}
