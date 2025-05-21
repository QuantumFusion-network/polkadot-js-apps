// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { EraRewardPoints } from '@polkadot/types/interfaces';
import type { BlockAuthors } from './types.js';

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children: React.ReactNode;
}

const MAX_HEADERS = 75;

const byAuthor: Record<string, string> = {};
const eraPoints: Record<string, string> = {};

const EMPTY_STATE: BlockAuthors = { byAuthor, eraPoints, lastBlockAuthors: [], lastHeaders: [] };

export const BlockAuthorsCtx = React.createContext<BlockAuthors>(EMPTY_STATE);

export function BlockAuthorsCtxRoot ({ children }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const queryPoints = useCall<EraRewardPoints>(isApiReady && api.derive.staking?.currentPoints);
  const [state, setState] = useState<BlockAuthors>(EMPTY_STATE);

  // No unsub, global context - destroyed on app close
  useEffect((): (() => void) => {
    let unsub: (() => void) | undefined;

    const setupSubscription = async () => {
      try {
        unsub = await api.rpc.chain.subscribeNewHeads(async (header) => {
          if (header?.number) {
            const blockNumber = header.number.unwrap();
            let thisBlockAuthor = '';

            try {
              const block = await api.rpc.chain.getBlock(header.hash);

              if (block?.block?.extrinsics?.length > 0) {
                const firstExtrinsic = block.block.extrinsics[0];

                thisBlockAuthor = firstExtrinsic.signer?.toString() || '';
              }
            } catch (error) {
              console.error('Error getting block author:', error);
            }

            if (thisBlockAuthor) {
              const thisBlockNumber = formatNumber(blockNumber);

              setState((prevState) => {
                byAuthor[thisBlockAuthor] = thisBlockNumber;

                if (thisBlockNumber !== prevState.lastBlockNumber) {
                  const lastBlockAuthors = [thisBlockAuthor];
                  const lastHeaders = prevState.lastHeaders
                    .filter((old, index) => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
                    .reduce((next, header): HeaderExtended[] => {
                      next.push(header);

                      return next;
                    }, [header as HeaderExtended])
                    .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

                  return {
                    byAuthor,
                    eraPoints,
                    lastBlockAuthors: lastBlockAuthors.slice(),
                    lastBlockNumber: thisBlockNumber,
                    lastHeader: header as HeaderExtended,
                    lastHeaders
                  };
                } else {
                  const lastBlockAuthors = [...prevState.lastBlockAuthors, thisBlockAuthor];
                  const lastHeaders = prevState.lastHeaders
                    .filter((old, index) => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
                    .reduce((next, header): HeaderExtended[] => {
                      next.push(header);

                      return next;
                    }, [header as HeaderExtended])
                    .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

                  return {
                    byAuthor,
                    eraPoints,
                    lastBlockAuthors,
                    lastBlockNumber: thisBlockNumber,
                    lastHeader: header as HeaderExtended,
                    lastHeaders
                  };
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Error setting up subscription:', error);
      }
    };

    setupSubscription().catch(console.error);

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [isApiReady, api]);

  useEffect((): void => {
    if (queryPoints) {
      const entries = [...queryPoints.individual.entries()]
        .map(([accountId, points]) => [accountId.toString(), formatNumber(points)]);
      const current = Object.keys(eraPoints);

      // we have an update, clear all previous
      if (current.length !== entries.length) {
        current.forEach((accountId): void => {
          delete eraPoints[accountId];
        });
      }

      entries.forEach(([accountId, points]): void => {
        eraPoints[accountId] = points;
      });
    }
  }, [queryPoints]);

  return (
    <BlockAuthorsCtx.Provider value={state}>
      {children}
    </BlockAuthorsCtx.Provider>
  );
}
