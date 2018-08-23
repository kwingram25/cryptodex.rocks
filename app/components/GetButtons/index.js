/* eslint no-undef: "off", no-console: "off" */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import './index.less';
import chromeLogo from '../../static/img/chrome.svg';

import messages from './messages';

const appId = 'pbfbaeobcojdjfgplolbofdjlahhclkc';
const webstoreUrl = `https://chrome.google.com/webstore/detail/cryptodex/${appId}`;

const UNRELEASED = 'UNRELEASED';
const NOT_CHROME = 'UNAVAILABLE';
const CAN_INSTALL = 'CAN_INSTALL';
const IS_INSTALLED = 'IS_INSTALLED';


export default class GetButtons extends Component {

  static propTypes = {
    isChrome: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isReleased: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isChrome: false,
    isMobile: false,
    isReleased: true,
  }

  constructor(props) {
    super(props);

    const {
      isChrome,
      isMobile,
      isReleased,
    } = props;

    let status;
    if (!isReleased) {
      status = UNRELEASED;
    } else if (isChrome) {
      if (isMobile) {
        status = NOT_CHROME;
      } else {
        status = CAN_INSTALL;
      }
    } else {
      status = NOT_CHROME;
    }

    // console.log(status);

    this.state = {
      status,
    };
  }

  componentDidMount() {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(
        appId,
        { method: 'homepage' },
        (res) => {
          if (res && res.isInstalled) {
            console.log('already installed!');
            this.setState({
              status: IS_INSTALLED,
            });
          }
        }
      );
    }
  }


  buttonProps = {
    className: 'get-button-primary',
    inverted: true,
  }

  secondaryProps = {
    className: 'get-button-secondary',
    target: '_blank',
  }

  doInlineInstall = () => {
    if (typeof chrome === 'object') {
      chrome.webstore.install(
        null,
        () => {
          this.setState({
            status: IS_INSTALLED,
          });
        },
        () => {

        }
      );
    }
  };

  render() {
    const {
      doInlineInstall,
    } = this;

    const {
      status,
    } = this.state;


    const containerProps = {
      className: 'get-buttons',
    };

    let buttonText;
    let secondaryText;

    const buttonProps = this.buttonProps;
    const secondaryProps = this.secondaryProps;


    switch (status) {
      case UNRELEASED:
        buttonText = messages.coming_soon;

        break;
      case NOT_CHROME:
        buttonText = messages.available;
        Object.assign(buttonProps, {
          as: 'a',
          href: webstoreUrl,
          target: '_blank',
        });
        break;

      case CAN_INSTALL:
        buttonText = messages.direct_download;
        Object.assign(buttonProps, {
          onClick: (e) => {
            e.preventDefault();
            doInlineInstall();
          },
        });

        secondaryText = messages.webstore;
        Object.assign(secondaryProps, {
          href: webstoreUrl,
        });
        break;

      case IS_INSTALLED:
        buttonText = messages.already_installed;
        break;

      default:
        break;
    }

    return (
      <div {...containerProps}>
        <Button {...buttonProps}>
          {
            status === IS_INSTALLED ?
              <Icon
                circular
                inverted
                color="green"
                size="large"
                name="check"
              /> :
              <img alt="Chrome" src={chromeLogo} />
          }
          <span>
            <FormattedMessage {...buttonText} />
          </span>
        </Button>
        {
        secondaryProps.href && (
          <a {...secondaryProps}>
            <FormattedMessage {...secondaryText} />
          </a>
        )
      }
      </div>
    );
  }
}
