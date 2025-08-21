// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {EndpointOption} from './types.js';

import {
  chainsQFNetworkPNG,
} from '../ui/logos/chains/index.js';

export * from './testingRelayWestend.js';

export const mainChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf2',
    providers: {
      'QF Network': 'wss://main.qfnetwork.xyz'
    },
    text: 'QF Network',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  }
];

export const devChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'QF Network': 'wss://dev.qfnetwork.xyz'
    },
    text: 'QF Devnet',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  },
];

export const testChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'QF Network': 'wss://test.qfnetwork.xyz'
    },
    text: 'QF Testnet',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  }
];


export const mainParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'QF Network': 'wss://para.main.qfnetwork.xyz'
    },
    text: 'QF Network',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  }
];

export const devParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'QF Network': 'wss://para-dev.qfnetwork.xyz'
    },
    isDisabled: true,
    text: 'QF Devnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  }
];

export const testParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'qf',
    providers: {
      'QF Network': 'wss://para-test.qfnetwork.xyz'
    },
    text: 'QF Testnet Parachain (Paseo)',
    ui: {
      color: '#000000',
      logo: chainsQFNetworkPNG
    }
  }
];
