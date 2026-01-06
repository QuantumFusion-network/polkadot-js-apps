// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EndpointOption } from './types.js';

import { chainsQfNetworkPNG } from '../ui/logos/chains/index.js';

export * from './testingRelayWestend.js';

export const mainChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'quantum-fusion-main',
    providers: {
      'QF Network': 'wss://main.qfnetwork.xyz'
    },
    text: 'QF Network',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const devChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'quantum-fusion-dev',
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
    info: 'quantum-fusion-test',
    providers: {
      'QF Network': 'wss://test.qfnetwork.xyz'
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
    info: 'quantum-fusion-para-main',
    providers: {
      'QF Network': 'wss://para.main.qfnetwork.xyz'
    },
    text: 'QF Network',
    ui: {
      color: '#000000',
      logo: chainsQfNetworkPNG
    }
  }
];

export const devParaChains: Omit<EndpointOption, 'teleport'>[] = [
  {
    info: 'quantum-fusion-para-dev',
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
    info: 'quantum-fusion-para-test',
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
