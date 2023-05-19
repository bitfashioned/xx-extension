// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChangeEvent } from 'react';

import { useCallback, useState } from 'react';

type OnChangeType = (e: ChangeEvent<HTMLInputElement>) => void;

const useInput = (initValue = '') => {
  const [value, setValue] = useState(initValue);
  const [touched, setTouched] = useState(false);

  const handler = useCallback<OnChangeType>((e) => {
    setTouched(true);
    setValue(e.target.value);
  }, []);

  return [value, handler, setValue, touched] as [string, OnChangeType, typeof setValue, boolean];
};

export default useInput;
