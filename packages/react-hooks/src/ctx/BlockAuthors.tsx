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
  useEffect((): void => {
    if (!isApiReady) {
      console.log('API not ready yet, skipping subscription setup');

      return;
    }

    console.log('Starting subscription setup, api.isReady:', api.isReady);

    api.isReady
      .then(async (): Promise<void | (() => void)> => {
        let lastHeaders: HeaderExtended[] = [];
        let lastBlockAuthors: string[] = [];
        let lastBlockNumber = '';

        // First check if we can get the current best block
        try {
          const bestNumber = await api.derive.chain.bestNumber();

          console.log('Current best block number:', bestNumber.toString());

          const block = await api.rpc.chain.getBlock(await api.rpc.chain.getBlockHash(bestNumber));

          // Check if we can get the author from the block's extrinsics
          if (block?.block?.extrinsics?.length > 0) {
            const firstExtrinsic = block.block.extrinsics[0];

            console.log('Initial block author:', firstExtrinsic.signer?.toString());
          }
        } catch (error) {
          console.error('Error getting initial block data:', error);
        }

        if (!api.derive.chain?.subscribeFinalizedHeads) {
          console.error('subscribeFinalizedHeads not available on api.derive.chain');

          return;
        }

        console.log('Setting up finalized heads subscription...');

        const unsub = api.derive.chain.subscribeFinalizedHeads(async (header: HeaderExtended): Promise<void> => {
          try {
            if (header?.number) {
              const blockNumber = header.number.unwrap();
              let thisBlockAuthor = '';

              // Try to get the author from the block's extrinsics
              try {
                const block = await api.rpc.chain.getBlock(header.hash);

                // Try to get the author from the first extrinsic
                if (block?.block?.extrinsics?.length > 0) {
                  const firstExtrinsic = block.block.extrinsics[0];

                  thisBlockAuthor = firstExtrinsic.signer?.toString() || '';
                  console.log(`Block #${blockNumber.toString()}: Author ${thisBlockAuthor}`);
                }
              } catch (error) {
                console.error('Error getting block author:', error);
              }

              if (thisBlockAuthor) {
                const thisBlockNumber = formatNumber(blockNumber);

                byAuthor[thisBlockAuthor] = thisBlockNumber;

                if (thisBlockNumber !== lastBlockNumber) {
                  lastBlockNumber = thisBlockNumber;
                  lastBlockAuthors = [thisBlockAuthor];
                } else {
                  lastBlockAuthors.push(thisBlockAuthor);
                }

                lastHeaders = lastHeaders
                  .filter((old, index) => index < MAX_HEADERS && old.number.unwrap().lt(blockNumber))
                  .reduce((next, header): HeaderExtended[] => {
                    next.push(header);

                    return next;
                  }, [header])
                  .sort((a, b) => b.number.unwrap().cmp(a.number.unwrap()));

                setState({ byAuthor, eraPoints, lastBlockAuthors: lastBlockAuthors.slice(), lastBlockNumber, lastHeader: header, lastHeaders });
              }
            }
          } catch (error) {
            console.error('Error processing new header:', error);
          }
        });

        console.log('Subscription setup complete');

        return () => {
          console.log('Cleaning up subscription');
          // @ts-expect-error UnsubscribePromise handling
          undefined && unsub?.then((unsubFn) => unsubFn());
        };
      })
      .catch((error) => {
        console.error('Error in subscription setup:', error);
      });
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
