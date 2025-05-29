// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';

import React, { useCallback, useRef, useState } from 'react';

import { PlayPanel, styled, Table } from '@polkadot/react-components';

import BlockHeader from './BlockHeader.js';
import { useTranslation } from './translate.js';

interface Props {
  headers: HeaderExtended[];
  playPanel: boolean;
}

function BlockHeaders ({ headers, playPanel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);
  const [orderByOldToNew, setOrderByOldToNew] = useState(true);
  const [frozenHeaders, setFrozenHeaders] = useState<HeaderExtended[]>([]);

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('recent blocks'), 'start', 3]
  ]);

  const pauseBlockUpdates = useCallback(() => {
    setIsPaused(true);
    // Capture current headers and limit to 75 items when pausing
    setFrozenHeaders(headers.slice(0, 75));
  }, [headers]);

  const resumeBlockUpdates = useCallback(() => {
    setIsPaused(false);
    setFrozenHeaders([]);
  }, []);

  const switchOrderBy = useCallback(() => {
    setOrderByOldToNew(!orderByOldToNew);
    setFrozenHeaders([...frozenHeaders].reverse());
  }, [orderByOldToNew, frozenHeaders]);

  // Use frozen headers when paused, otherwise use live headers
  const displayHeaders = isPaused ? frozenHeaders : headers;

  return (
    <StyledWrapper>
      {playPanel &&
        <PlayPanel
          isPaused={isPaused}
          onPause={pauseBlockUpdates}
          onPlay={resumeBlockUpdates}
          onSwitchOrderBy={switchOrderBy}
          orderByOldToNew={orderByOldToNew}
        />
      }
      <Table
        bs={'5px'}
        empty={t('No blocks available')}
        header={headerRef.current}
      >
        {displayHeaders
          .filter((header) => !!header)
          .map((header): React.ReactNode => (
            <BlockHeader
              key={header.number.toString()}
              value={header}
            />
          ))}
      </Table>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: relative;
`;

export default React.memo(BlockHeaders);
