// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext, useEffect, useState } from 'react';

import AccountNamePasswordCreation from '../../components/AccountNamePasswordCreation.js';
import { ActionContext, Address, Dropdown, Loading } from '../../components/index.js';
import useGenesisHashOptions from '../../hooks/useGenesisHashOptions.js';
import useMetadata from '../../hooks/useMetadata.js';
import useTranslation from '../../hooks/useTranslation.js';
import { createAccountSuri, validateSeed } from '../../messaging.js';
import { HeaderWithSteps } from '../../partials/index.js';
import { styled } from '../../styled.js';
import { DEFAULT_TYPE } from '../../util/defaultType.js';
import useStepper from '../hooks/useStepper.js';
import GenerateWallet from './GenerateAccount.js';

const xxnetworkGenesisHash = '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa';

interface Props {
  className?: string;
}

function CreateAccount ({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [address, setAddress] = useState<null | string>(null);
  const [seed, setSeed] = useState<null | string>(null);
  const [type, setType] = useState(DEFAULT_TYPE);
  const [name, setName] = useState('');
  const options = useGenesisHashOptions();
  const [genesisHash, setGenesis] = useState(xxnetworkGenesisHash);
  const chain = useMetadata(genesisHash, true);
  const [step, nextStep, prevStep, setStep] = useStepper();

  useEffect((): void => {
    if (seed) {
      const type = chain && chain.definition.chainType === 'ethereum'
        ? 'ethereum'
        : DEFAULT_TYPE;

      setType(type);
      validateSeed(seed, type)
        .then(({ address }) => setAddress(address))
        .catch(console.error);
    }
  }, [seed, chain]);

  const _onCreate = useCallback(
    (name: string, password: string): void => {
      // this should always be the case
      if (name && password && seed) {
        setIsBusy(true);

        createAccountSuri(name, password, seed, type, genesisHash)
          .then(() => onAction('/'))
          .catch((error: Error): void => {
            setIsBusy(false);
            console.error(error);
          });
      }
    },
    [genesisHash, onAction, seed, type]
  );

  const _onChangeNetwork = useCallback(
    (newGenesisHash: string) => setGenesis(newGenesisHash),
    []
  );

  return (
    <>
      <HeaderWithSteps
        step={step}
        text={t<string>('Create an account')}
      />
      <GenerateWallet
        nextStep={nextStep}
        setSeed={setSeed}
        setStep={setStep}
        step={step}
      />
      <Loading>
        <div style={{ marginTop: '1em' }}>
          <Address
            address={address}
            genesisHash={genesisHash}
            name={name}
          />
        </div>
        {seed && step > 3 && (
          <>
            <Dropdown
              className={className}
              label={t<string>('Network')}
              onChange={_onChangeNetwork}
              options={options}
              value={genesisHash}
            />
            <AccountNamePasswordCreation
              buttonLabel={t<string>('Add the account with the generated seed')}
              isBusy={isBusy}
              onBackClick={prevStep}
              onCreate={_onCreate}
              onNameChange={setName}
            />
          </>
        )
        }
      </Loading>
    </>
  );
}

export default styled(CreateAccount)`
  margin-bottom: 16px;

  label::after {
    right: 36px;
  }
`;
