// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { useApi } from '@polkadot/react-hooks';


type NetworkGroup = 'main' | 'test' | 'dev' | 'unknown';

const MAIN_INFO = new Set(['qf-main', 'qf-main-para']);
const TEST_INFO = new Set(['qf-test', 'qf-test-para']);
const DEV_INFO = new Set(['qf-dev', 'qf-dev-para']);

function getNetworkGroup (info?: string): NetworkGroup {
  if (!info) {
    return 'unknown';
  }

  if (MAIN_INFO.has(info)) {
    return 'main';
  }

  if (TEST_INFO.has(info)) {
    return 'test';
  }

  if (DEV_INFO.has(info)) {
    return 'dev';
  }

  return 'unknown';
}

function NetworkNotice (): React.ReactElement | null {
  const { apiEndpoint } = useApi();

  const group = useMemo(
    () => getNetworkGroup(apiEndpoint?.info),
    [apiEndpoint?.info]
  );

  if (group === 'unknown') {
    return null;
  }

  if (group === 'main') {
    return (
      <div className='apps--notice'>
        <strong>QF Network is under active development.</strong>
        Use at your own risk.
      </div>
    );
  }

  return (
    <div className='apps--notice'>
      <strong>QF Network test networks are under active development.</strong>
      - RPC connection may be unstable. <br />
      - The chain may reset from genesis at any time.
    </div>
  );
}

export default React.memo(NetworkNotice);
