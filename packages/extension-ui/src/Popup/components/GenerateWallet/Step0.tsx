// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ButtonFooter } from '../ButtonFooter.js';

interface Props {
  onFinish: () => void;
}

function Step0 ({ onFinish }: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.9em', gap: '1em', lineHeight: 'normal' }}>
        <p style={{ margin: 0 }}>
          Sleeve is the novel Wallet generation algorithm used by xx network. With Sleeve, a backup quantum secure Wallet is embedded into a standard non quantum secure Wallet.
        </p>
        <p
          style={{ margin: '0', textAlign: 'justify' }}
        >
          The uniqueness of Sleeve means that during the Wallet generation procedure two recovery phrases are created:
          <ul>
            <li style={{ paddingBottom: '1em' }}><u>Quantum Mnemonic</u>: derives the quantum-secure wallet, which is not currently used, but will be necessary in the future in order to rollover existing non quantum secure wallets into quantum secure wallets.</li>
            <li><u>Standard Mnemonic</u>: currently used to generate standard non quantum secure Wallets. This phrase can be generated from the quantum secure phrase, so keeping the first one safe will always be of utmost importance.</li>
          </ul>
        </p>
      </div>
      {/* <a
        href='https://github.com/xx-labs/sleeve'
        rel='noopener noreferrer'
        style={{ color: '#00A2D6', cursor: 'pointer', fontSize: '0.9em', textDecoration: 'underline' }}
        target='_blank'
      >
        <span>
          Learn more about our quantum-ready wallets
        </span>
      </a> */}
      <ButtonFooter
        next={onFinish}
        start={true}
      />
    </div>
  );
}

export default Step0;
