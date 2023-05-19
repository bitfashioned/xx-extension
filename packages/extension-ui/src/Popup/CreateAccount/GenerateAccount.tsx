// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import Step0 from '../components/GenerateWallet/Step0.js';
import Step1 from '../components/GenerateWallet/Step1.js';
import Step2 from '../components/GenerateWallet/Step2.js';

interface Props {
  step: number,
  nextStep: () => void,
  setStep: (step: number) => void,
  setSeed: (seed: string) => void,
}

function GenerateWallet ({ nextStep, setSeed, setStep, step }: Props): React.ReactElement<Props> {
  const [mnemonics, setMnemonics] = useState<string[]>(['', '']);

  const onMnemonicsFinish = useCallback((): void => {
    setSeed(mnemonics[0]);
    nextStep();
  }, [mnemonics, nextStep, setSeed]);

  const cancel = useCallback(() => {
    setStep(1);
    setMnemonics(['', '']);
  }, [setStep]);

  return (
    <div
      style={{ margin: '0 1em', maxHeight: '500px', maxWidth: '500px', overflowY: 'auto' }}
    >
      {step === 1 && <Step0 onFinish={nextStep} />}
      {step === 2 &&
      <Step1
        cancel={cancel}
        onFinish={nextStep}
        setMnemonics={setMnemonics}
      />
      }
      {step === 3 &&
      <Step2
        cancel={cancel}
        mnemonics={mnemonics}
        onFinish={onMnemonicsFinish}
      />
      }
    </div>
  );
}

export default GenerateWallet;
