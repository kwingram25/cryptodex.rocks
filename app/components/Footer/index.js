/* eslint react/no-array-index-key: off */
import React from 'react';
import ContactForm from 'components/ContactForm';
import { Message } from 'semantic-ui-react';

import './index.less';

const items = [
  '(c) 2018',
];

export default class Footer extends React.Component {

  state = {
    contactFormOpen: false,
    contactSuccess: undefined,
  };

  render() {
    const {
      contactFormOpen,
      contactSuccess,
    } = this.state;

    const contactFormProps = {
      open: contactFormOpen,
      onClose: (success) => {
        this.setState({
          contactFormOpen: false,
        });

        if (success !== undefined) {
          this.setState({
            contactSuccess: success,
          });
        }
      },
    };

    const linkProps = {
      href: '#',
      onClick: (e) => {
        e.preventDefault();
        this.setState({
          contactFormOpen: true,
        });
      },
    };

    const showMessage = contactSuccess !== undefined;

    const contact = (
      <a {...linkProps}>
        Contact
      </a>
    );

    return (
      <div className="footer">
        <ul>
          {
              [
                ...items,
                contact,
              ].map((item, index) => ((
                <li key={`footer-${index}`}>
                  {item}
                </li>
              )))
            }
        </ul>
        <ContactForm {...contactFormProps} />
        {
          showMessage && (() => {
            const messageProps = {
              className: 'contact-form-message',
              onDismiss: () => {
                clearTimeout(window.hideContactMessage);
                this.setState({
                  contactSuccess: undefined,
                });
              },
              ...(
                contactSuccess ?
                {
                  success: true,
                  header: 'Success!',
                  content: 'Thank you for your message',
                } :
                {
                  error: true,
                  header: 'Error',
                  content: 'Please try sending your message again later',
                }
              ),
            };

            window.hideContactMessage = setTimeout(() => {
              this.setState({
                contactSuccess: undefined,
              });
            }, 5000);

            return <Message {...messageProps} />;
          })()
        }

      </div>
    );
  }
}
