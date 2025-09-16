// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { U32 } from '@polkadot/types-codec';

import { useCallback, useEffect, useState } from 'react';

import { useApi } from './useApi.js';

type AuxData = [AccountId32[], U32];

export function useBlockAuthor (header: HeaderExtended | undefined) {
  const [author, setAuthor] = useState<AccountId32 | undefined>(undefined);
  const [auxData, setAuxData] = useState<AuxData | undefined>();
  const { api } = useApi();

  // Load SPIN API data
  useEffect(() => {
    const loadSpinData = async () => {
      try {
        const data = await api.call.spinApi.auxData();

        setAuxData(data as unknown as AuxData);
      } catch (e) {
        console.error('Failed to load spinApi data:', e);
      }
    };

    loadSpinData().catch(console.error);
  }, [api.call.spinApi]);

  // Parse slot from PreRuntime digest
  const slot = header?.digest.logs
    .map((log) => {
      if (log.isPreRuntime) {
        const [_, data] = log.asPreRuntime;

        return api.createType('Slot', data);
      }

      return null;
    })
    .filter(Boolean);

  const extractAuthor = useCallback((): AccountId32 | undefined => {
    if (!auxData) {
      return undefined;
    }

    const [authorities, sessionLength] = auxData;
    const slotValue = slot?.[0];

    if (!slotValue || !authorities.length) {
      return undefined;
    }

    const slotNum = Number(slotValue);
    const sessionLengthNum = sessionLength.toNumber();

    // Calculate block author using SPIN consensus formula
    const virtualStep = Math.floor(slotNum / sessionLengthNum);
    const leaderIdx = virtualStep % authorities.length;
    const author = authorities[leaderIdx];

    return author;
  }, [auxData, slot]);

  useEffect(() => {
    const fetchAuthor = () => {
      try {
        const a = extractAuthor();

        if (a) {
          setAuthor(a);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchAuthor();
  }, [extractAuthor]);

  return author;
}
