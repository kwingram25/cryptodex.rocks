import React from 'react';
import { FormattedMessage } from 'react-intl';

import './index.less';
import '../../global.css';

import cryptodexIcon from '../../static/img/cryptodex-icon.png';

import messages from './messages';

const imgProps = {
  id: 'cryptodex-icon',
  src: cryptodexIcon,
};

export default () => ((
  <div className="branding">
    <img alt="{messages.app_name}" {...imgProps} />
    <div>
      <h1 className="cryptodex-logo">
        <FormattedMessage {...messages.app_name} />
      </h1>
      <h3>
        <FormattedMessage {...messages.tagline} />
      </h3>
    </div>
  </div>
));
