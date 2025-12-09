// Copyright 2025 QF Network
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function SecureFinalized ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const secureUpTo = useCall<u32>(api.query.spinAnchoring?.secureUpTo);

  return (
    <div className={`${className} ${secureUpTo ? '' : '--tmp'}`}>
      {label || ''}{
        <span className='--digits'>{formatNumber(secureUpTo || 0)}</span>
      }{children}
    </div>
  );
}

export default React.memo(SecureFinalized);
