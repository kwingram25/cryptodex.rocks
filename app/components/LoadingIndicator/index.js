import React from 'react';
import { PulseLoader } from 'halogen';

import './index.less';

const color = '#76b5ec';

const LoadingIndicator = () => (
  <div className="loader">
    <PulseLoader color={color} />
  </div>
);

export default LoadingIndicator;
