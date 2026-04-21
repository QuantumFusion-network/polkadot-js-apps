// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsQfNetworkPNG } from '../ui/logos/chains/index.js';

export * from './testingRelayWestend.js';

export const mainChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-main',
    providers: {
      'QF Network': 'wss://mainnet.qfnode.net'
    },
    text: 'QF Mainnet',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const devChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-dev',
    providers: {
      'QF Network': 'wss://dev.qfnetwork.xyz'
    },
    text: 'QF Devnet',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const testChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-test',
    providers: {
      'QF Network': 'wss://testnet.qfnode.net'
    },
    text: 'QF Testnet',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const mainParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-main-para',
    providers: {
      'QF Network': 'wss://archive.para.mainnet.qfnode.net'
    },
    text: 'QF Mainnet Parachain (Polkadot)',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const devParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-dev-para',
    isDisabled: true,
    providers: {
      'QF Network': 'wss://para-dev.qfnetwork.xyz'
    },
    text: 'QF Devnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const testParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf-test-para',
    providers: {
      'QF Network': 'wss://para-test.qfnetwork.xyz'
    },
    text: 'QF Testnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];
