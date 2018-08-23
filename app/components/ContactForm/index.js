import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Message, Modal, Button } from 'semantic-ui-react';

import './index.less'; // ES6

const defaultState = {
  loading: false,
  error: false,
  name: '',
  email: '',
  message: '',
  touched: {},
};


export default class ContactForm extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    open: false,
  }

  state = defaultState

  onEditField = (field) => (e, { value }) => {
    if (this.state.error) {
      this.setState({ error: false });
    }
    this.setState({
      [field]: value,
    });
  }

  onBlur = (field) => () => {
    this.setState({
      touched: {
        ...this.state.touched,
        [field]: true,
      },
    });
  }

  validateFields = () => {
    const errors = {
      name: (
        (
          this.state.name &&
          this.state.name !== ''
        ) || !this.state.touched.name
      ),
      email: (
        (
          this.state.email &&
          this.state.email !== ''
        ) || !this.state.touched.email
      ),
      message: (
        (
          this.state.message &&
          this.state.message !== ''
        ) || !this.state.touched.message
      ),
    };
    return {
      ...errors,
      hasErrors: Object.values(errors).reduce((p, c) => p || !c, false),
    };
  };

  submitForm = () => {
    const { hasErrors } = this.validateFields();

    if (hasErrors) {
      this.setState({ error: true });
      return;
    }

    this.setState({ loading: true });

    const { name, message, email } = this.state;

    fetch('/contact', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, message, email,
      }),
    }).then((res) => {
      const success = res.status === 200;
      this.props.onClose(success);

      this.setState(defaultState);
    });
  }

  render() {
    const {
      submitForm,
      validateFields,
      onBlur,
      onEditField,
      props: {
        open,
        onClose,
      },
      state: {
        name,
        email,
        message,
        loading,
        error,
      },
    } = this;

    const doClose = () => {
      onClose();
    };

    const { hasErrors, ...errors } = validateFields();

    const formProps = {
      loading,
      error: error ? true : null,
    };

    const nameProps = {
      value: name,
      required: true,
      inverted: true,
      label: 'Name',
      error: !errors.name,
      onBlur: onBlur('name'),
      onChange: onEditField('name'),
    };

    const emailProps = {
      value: email,
      required: true,
      inverted: true,
      label: 'Email',
      error: !errors.email,
      onBlur: onBlur('email'),
      onChange: onEditField('email'),
    };

    const messageProps = {
      value: message,
      required: true,
      label: 'Message',
      error: !errors.message,
      onBlur: onBlur('message'),
      onChange: onEditField('message'),
    };

    const formMessageProps = {
      error: true,
      header: 'Error',
      content: 'All fields are required',
    };

    const buttonProps = {
      color: 'blue',
      icon: 'send',
      labelPosition: 'right',
      content: 'Send',
      onClick: () => {
        submitForm();
      },
    };

    return (
      <Modal size="tiny" open={open} onClose={doClose}>
        <Modal.Header>Contact Us</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <p>Found a bug or have a feature request? Tell us about it!</p>
          </Modal.Description>
          <br />
          <Form {...formProps}>
            <Form.Group widths="equal">
              <Form.Input {...nameProps} />
              <Form.Input {...emailProps} />
            </Form.Group>
            <Form.TextArea {...messageProps} />
            <Message {...formMessageProps} />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button {...buttonProps} />
        </Modal.Actions>
      </Modal>
    );
  }

}
