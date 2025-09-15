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
    if (api?.call?.spinApi) {
      console.log('👉 spinApi methods:', Object.keys(api.call.spinApi));
    }
  }, [api]);
  

  useEffect(() => {
    const loadSpinData = async () => {
      try {
        // загружаем auxData
        const data = await api.call.spinApi.auxData();

        setAuxData(data as unknown as AuxData);

        // загружаем slotDuration
        const duration = await api.call.spinApi.slotDuration();
        console.log('✅ auxData:', data.toString());
        console.log('⏱ spinApi.slotDuration =', duration.toString());
      } catch (e) {
        console.error('Failed to load spinApi data:', e);
      }
    };
  
    loadSpinData().catch(console.error);
  }, [api.call.spinApi]);
  

  // 🔍 Логируем digest полностью
  console.log('📦 Full digest logs (toHuman):', header?.digest.toHuman());

  // 🔍 Логируем каждый digest item
  header?.digest.logs.forEach((log, i) => {
    if (log.isPreRuntime) {
      const [engineId, data] = log.asPreRuntime;

      console.log(`⚙️ [${i}] PreRuntime log`);
      console.log('   engineId:', engineId.toString());
      console.log('   raw data hex:', data.toHex());
      console.log('   raw data u8a:', data.toU8a());
    } else if (log.isSeal) {
      console.log(`🔐 [${i}] Seal log:`, log.asSeal.toHuman());
    } else {
      console.log(`ℹ️ [${i}] Other log:`, log.toHuman());
    }
  });

  // 🔍 Парсим slot из PreRuntime
  const slot = header?.digest.logs
    .map((log) => {
      if (log.isPreRuntime) {
        const [_, data] = log.asPreRuntime;

        return api.createType('U64', data.toU8a());
      }

      return null;
    })
    .filter(Boolean);


  console.log('✅ Parsed slot array:', slot.map((s) => s?.toString()));

  // 🔍 Дополнительно выводим весь header
  console.log('🆚 header extended (raw):', header?.toHuman());

  const extractAuthor = useCallback(async (): Promise<AccountId32 | undefined> => {
    if (!auxData) {
      console.log('❌ auxData is not loaded yet');

      return undefined;
    }

    const [authorities, sessionLength] = auxData;

    console.log('✅ ++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log('✅ authorities:', authorities.map((a) => a.toString()));
    console.log('✅ sessionLength:', sessionLength.toNumber());

    const slotValue = slot?.[0];

    console.log('✅ raw slotValue from digest:', slotValue?.toString());

    if (!slotValue || !authorities.length) {
      console.log('❌ slotValue missing or no authorities');

      return undefined;
    }

    const slotNum = Number(slotValue);

    console.log('➡️ slotNum (as number):', slotNum);
    const SLOT_STEP_SIZE = 256;

    const realSlotNum = slotNum / SLOT_STEP_SIZE
    
    console.log('➡️ realSlotNum:', Math.floor(realSlotNum));

    // const sessionLengthNum = sessionLength.toNumber();
    const sessionLengthNum = 100;

    console.log('➡️ sessionLengthNum:', sessionLengthNum);


    console.log('➡️ SLOT_STEP_SIZE:', SLOT_STEP_SIZE);

    // вычисляем виртуальный шаг
    const virtualStep = Math.floor(realSlotNum / (sessionLengthNum));

    console.log('🔢 virtualStep = Math.floor(realSlotNum / sessionLengthNum) =', virtualStep);

    // вычисляем индекс лидера
    const leaderIdx = virtualStep % authorities.length;

    console.log('👑 leaderIdx = virtualStep % authorities.length =', leaderIdx);

    // выбираем валидатора по индексу
    const author = authorities[leaderIdx];

    console.log('✅ Selected author:', author.toString());
    console.log('✅ --------------------------------------------------');

    return author;
  }, [auxData, slot]);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const a = await extractAuthor();
        if (a) {
          setAuthor(a);
        }
      } catch (e) {
        console.error(e);
      }
    };

    void fetchAuthor();
  }, [extractAuthor]);

  return author;
}
