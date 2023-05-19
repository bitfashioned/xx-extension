// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { generateSleeve, waitReady } from '@xxnetwork/wasm-crypto';
import React, { useCallback, useState } from 'react';

import { bip39Generate, waitReady as waitReadyPolkadot } from '@polkadot/wasm-crypto';

import { Button } from '../../../components/index.js';
import { ButtonFooter } from '../ButtonFooter.js';

interface ElementProps {
  color: string;
  header: string;
  value: string;
  body?: string;
}

const Divider = (): React.ReactElement => (
  <hr style={{ borderTop: '3px solid black', margin: '1em 0' }} />
);

const DisplayWord = ({ color, index, word }: { color: string, index: number, word: string }): React.ReactElement => (
  <div style={{ gap: '0.25em' }}>
    <div
      style={{ backgroundColor: 'black',
        borderRadius: '7px 7px 0 0',
        color: 'white',
        display: 'flex',
        fontSize: '0.7em',
        justifyContent: 'center' }}
    >
      {index + 1}
    </div>
    <div
      style={{
        backgroundColor: color,
        borderRadius: '0 0 7px 7px',
        color: 'white',
        fontSize: '0.8em',
        marginBottom: '10px',
        padding: '2px',
        textAlign: 'center'
      }}
    >
      {word}
    </div>
  </div>
);

const WordTable = ({ color, mnemonic }: { color: string, mnemonic: string }): React.ReactElement => (
  <table style={{ width: '100%' }}>
    {mnemonic.split(' ').map((elem, index) => {
      return (
        <>
          <td
            key={index}
          >
            <DisplayWord
              color={color}
              index={index}
              word={elem}
            />
          </td>
          {(index + 1) % 6 === 0 && <tr />}
        </>
      );
    })}
  </table>
);

const Element = ({ body, color, header, value }: ElementProps): React.ReactElement => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <h3
      style={{ margin: 0, textTransform: 'uppercase' }}
    >{header}</h3>
    {body && <p style={{ fontSize: '0.9em', lineHeight: '1.5em' }}>{body}</p>}
    <div style={{ display: 'flex', flexFlow: 'wrap' }}>
      {value &&
      <WordTable
        color={color}
        mnemonic={value}
      />
      }
    </div>
  </div>
);

interface Props {
  setMnemonics: (mnemonics: string[]) => void;
  cancel: () => void;
  onFinish: () => void;
}

function Step1 ({ cancel, onFinish, setMnemonics }: Props): React.ReactElement {
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [standardMnemonic, setStandardMnemonic] = useState<string>('');
  const [quantumMnemonic, setQuantumMnemonic] = useState<string>('');
  const isStepValid = !!standardMnemonic && !!quantumMnemonic && isMnemonicSaved;

  const toggleMnemonicSaved = useCallback(
    () => setIsMnemonicSaved(!isMnemonicSaved),
    [isMnemonicSaved]
  );

  const generateWallet = useCallback(async () => {
    // first wait until the WASM has been loaded (async init)
    await waitReadyPolkadot();
    await waitReady();

    // generate quantum seed
    const quantum: string = bip39Generate(24);

    // generate standard seed
    const standard = generateSleeve(quantum);

    setQuantumMnemonic(quantum);
    setStandardMnemonic(standard);
    setMnemonics([standard, quantum] as string[]);
  }, [setMnemonics]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!standardMnemonic && !quantumMnemonic &&
      <Button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={generateWallet}
      >
        Generate New Wallet
      </Button>}
      {quantumMnemonic && (
        <>
          <Element
            body='This recovery phrase will only be used when the xx network consensus adopts quantum-secure signatures. Your standard recovery phrase is generated from this one.'
            color='blue'
            header='Quantum Mnemonic'
            value={quantumMnemonic}
          />
          <Divider />
        </>
      )}
      {standardMnemonic && (
        <Element
          body='This recovery phrase is used like any other cryptocurrency recovery phrase. If you lose your wallet or you want to setup a hardware wallet, you can recreate it using this recovery phrase.'
          color='green'
          header='Standard Mnemonic'
          value={standardMnemonic}
        />
      )}
      <Divider />
      <div style={{ fontSize: '0.85em', lineHeight: '1.5em', margin: 0 }}>
        NOT RECOMMENDED
        <ul style={{ margin: '0.5em 0.5em 1em', paddingLeft: '1.5em' }}>
          <li>Taking a screenshot or photo of this information</li>
          <li>Saving the information in an unencrypted text document</li>
          <li>Sharing this information with any person or application you do not trust with your coins
          </li>
        </ul>
        RECOMMENDED
        <ul style={{ margin: '0.5em 0.5em 1em', paddingLeft: '1.5em' }}>
          <li>Writing down on paper both recovery phrases, with the correct label, and indexes
          </li>
          <li>Keeping this information somewhere that is safe from theft and damage
          </li>
          <li>Using a hardware wallet</li>
        </ul>
      </div>
      {standardMnemonic && quantumMnemonic && (
        <div style={{ display: 'flex',
          gap: '1em',
          height: '2em',
          justifyContent: 'end',
          marginBottom: '1em' }}
        >
          <input
            checked={isMnemonicSaved}
            id='saveMnemonic'
            name='saveMnemonic'
            onChange={toggleMnemonicSaved}
            style={{ margin: 'auto 0' }}
            type='checkbox'
          />
          <p style={{ fontSize: '0.8em', margin: 'auto 0' }}>
                I have saved both my mnemonics safely and named them correctly!
          </p>
        </div>
      )}
      <ButtonFooter
        isDisabled={!isStepValid}
        next={onFinish}
        nextText={'Next'}
        prev={cancel}
        prevText={'Back'}
      />
    </div>
  );
}

export default Step1;
