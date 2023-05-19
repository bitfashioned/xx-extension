// Copyright 2019-2023 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '../../components/index.js';

interface Props {
  start?: boolean;
  end?: boolean;
  prevText?: string;
  nextText?: string;
  prev?: () => void;
  next?: () => void;
  isDisabled?: boolean;
}

export function ButtonFooter ({ end = false, isDisabled = false, next, nextText = 'Next', prev, prevText = 'Back', start = false }: Props): React.ReactElement<Props> {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      {<div style={{ visibility: start ? 'hidden' : 'visible' }}>
        <Button
          onClick={prev}
        >
          {prevText}
        </Button>
      </div>}
      {!end && <div>
        <Button
          isDisabled={isDisabled}
          onClick={next}
        >
          {nextText}
        </Button>
      </div>}
    </div>
  );
}
