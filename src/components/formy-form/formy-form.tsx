import { Component, Element, State, Prop, Method } from '@stencil/core';

@Component({
  tag: 'formy-form',
  styleUrl: 'formy-form.css',
})
export class FormyForm {
  @Element() el: HTMLFormElement;

  @Prop() onSuccess: Function;
  @Prop() customValidators: Function;

  @State() inputs: Array<HTMLInputElement>;

  componentDidLoad() {
    const form: HTMLFormElement = this.el.querySelector('form');
    this.inputs = Array.from(form.querySelectorAll('input, select, textarea, radio'));
  }


  getFormData() {
    let elements = {};
    this.inputs.forEach((input) => {
      const { name } = input;
      if (name) {
        elements[name] = input;
      }
    });
    return elements;
  }

  @Method()
  getValues() {
    let values = {};
    this.inputs.forEach(input => {
      const { name, value } = input;
      if (name) {
        values[name] = value;
      }
    });
    return values;
  }

  @Method()
  getErrors() {
    let errors = {};
    this.inputs.forEach(input => {
      const { name } = input;
      if (name) {
        errors[name] = input.validationMessage;
      }
    })
    return errors;
  }

  @Method()
  validate(elements) {
    // setup extra validators
    this.customValidators(elements);
    const isValid = this.inputs.reduce((acc, input) => {
      // @ts-ignore
      return acc && input.reportValidity();
    }, true);
    return isValid;
  }

  @Method()
  clear() {
    this.inputs.forEach(input => input.value = '');
  }

  render() {
    return (
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          // controls validation
          const isValid = this.validate(this.getFormData());
          console.log('isValid', isValid);
          if (isValid) {
            // onSuccess validation
            this.onSuccess(this.getValues(), this.getFormData());
          }
        }}>
        <slot />
      </form >
    )
  }
}
