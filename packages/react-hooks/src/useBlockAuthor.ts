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

  useEffect(() => {
    const loadAuxData = async () => {
      try {
        const data = await api.call.spinApi.auxData();

        setAuxData(data as unknown as AuxData);
      } catch (e) {
        console.error('Failed to load auxData:', e);
      }
    };

    loadAuxData().catch(console.error);
  }, [api.call.spinApi]);

  const slot = header?.digest.logs.map((log) => {
    if (log.isPreRuntime) {
      const [_, data] = log.asPreRuntime;

      return api.createType('U64', data.toU8a());
    }

    return undefined;
  }).filter(Boolean);

  const extractAuthor = useCallback(async (): Promise<AccountId32 | undefined> => {
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

    const virtualStep = Math.floor(slotNum / (sessionLengthNum * 256));
    const leaderIdx = virtualStep % authorities.length;

    const result = await Promise.resolve(authorities[leaderIdx]);

    return result;
  }, [auxData, slot]);

  useEffect(() => {
    extractAuthor()
      .then((a) => {
        if (a) {
          setAuthor(a);
        }
      })
      .catch((e) => console.error(e));
  }, [extractAuthor]);

  return author;
}
