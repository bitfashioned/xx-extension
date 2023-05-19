// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { ButtonFooter } from '../ButtonFooter.js';

const NUM_CONFIRMATIONS = 5;

interface MnemonicGridProps {
  mnemonic: string[];
  indexes: number[];
  onValid: () => void;
  cancel: () => void;
}

const getRandomSet = (array: number[], n: number): number[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};

const MnemonicGrid = ({ cancel,
  indexes,
  mnemonic,
  onValid }: MnemonicGridProps): React.ReactElement => {
  const [words, setWords] = useState<string[]>(indexes.map(() => ''));

  const onSetWord = useCallback(
    (index: number) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      const copy = words.slice();

      copy[index] = evt.target.value;
      setWords(copy);
    },
    [words]
  );

  const isValid = useMemo(() => {
    const valid = indexes.every((elem, index) => mnemonic.indexOf(words[index]) === elem);

    return valid && words.length === indexes.length;
  }, [indexes, mnemonic, words]);

  const result = useMemo(
    () => (
      <>
        {indexes.map((idx, index) => {
          return (
            <input
              id={`Word #${idx + 1}`}
              key={idx}
              onChange={onSetWord(index)}
              placeholder={`Word #${idx + 1}`}
              style={{ margin: '0.5em 0.5em 1em', padding: '0.5em' }}
              type='text'
            />
          );
        })}
      </>
    ),
    [indexes, onSetWord]
  );

  return (
    <>
      <div style={{ width: '5em' }}>
        {result}
      </div>
      <ButtonFooter
        isDisabled={!isValid}
        next={onValid}
        nextText={'Next'}
        prev={cancel}
        prevText={'Cancel'}
      />
    </>
  );
};

interface Props {
  mnemonics: string[];
  cancel: () => void;
  onFinish: () => void;
}

function Step2 ({ cancel, mnemonics, onFinish }: Props): React.ReactElement {
  const [onStage2, setOnStage2] = useState<boolean>(false);
  const standard = mnemonics[0].split(' ').map((elem) => elem);
  const quantum = mnemonics[1].split(' ').map((elem) => elem);
  const [standardIndexes] = useState(
    getRandomSet(Array.from(Array(standard.length).keys()), NUM_CONFIRMATIONS)
  );
  const [quantumIndexes] = useState(
    getRandomSet(Array.from(Array(quantum.length).keys()), NUM_CONFIRMATIONS)
  );

  const onSetReady = useCallback(() => {
    setOnStage2(true);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      {!onStage2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <h3 style={{ margin: 0 }}>
            Confirm <b>QUANTUM</b> mnemonic
          </h3>
          <MnemonicGrid
            cancel={cancel}
            indexes={quantumIndexes}
            mnemonic={quantum}
            onValid={onSetReady}
          />
        </div>
      )}
      {onStage2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <h3 style={{ margin: 0 }}>
            Confirm <b>STANDARD</b> mnemonic
          </h3>
          <MnemonicGrid
            cancel={cancel}
            indexes={standardIndexes}
            mnemonic={standard}
            onValid={onFinish}
          />
        </div>
      )}
    </div>
  );
}

export default Step2;
