// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Icon from '../Icon.js';
import { styled } from '../styled.js';

interface Props {
  className?: string;
  isPaused?: boolean;
  onPause?: () => void;
  onPlay?: () => void;
  onSwitchOrderBy?: () => void;
  orderByOldToNew?: boolean;
}

function PlayPanel ({ className = '', isPaused, onPause, onPlay, onSwitchOrderBy, orderByOldToNew }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv
      className={`${className} playPanel`}
      id='playPanel'
    >
      {/* Play Icon */}
      <button
        disabled={!isPaused}
        onClick={onPlay}
      >
        <Icon
          color={isPaused ? 'customGreen' : 'customGray'}
          icon='play'
        />
      </button>
      {/* Pause Icon */}
      <button
        disabled={isPaused}
        onClick={onPause}
      >
        <Icon
          color={isPaused ? 'customGray' : 'customGreen'}
          icon='pause'
        />
      </button>
      {/* Sort Icons */}
      <button
        disabled={!isPaused}
        onClick={onSwitchOrderBy}
      >
        <Icon
          color={orderByOldToNew ? 'customGray' : 'customGreen'}
          icon='sort-up'
        />
        <Icon
          color={orderByOldToNew ? 'customGreen' : 'customGray'}
          icon='sort-down'
        />
      </button>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: absolute;
  top: 11px;
  right: 11px;
  display: flex;
  align-items: center;
  border: 1px solid #FFF;
  border-radius: 6px;
  z-index: 1000;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    width: 36px;
    background: transparent;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;

    .ui--Icon {
      transform: scale(1.5);
    }

    &:hover:not(:disabled) {
      background: #FFF;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
`;

export default React.memo(PlayPanel);
