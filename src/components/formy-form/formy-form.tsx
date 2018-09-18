import { Component, Element, State, Prop, Method } from '@stencil/core';
import hyperform from 'hyperform';

@Component({
  tag: 'formy-form',
  styleUrl: 'formy-form.css',
})
export class FormyForm {
  @Element() el: HTMLFormElement;

  @Prop() onSuccess: Function;
  @Prop() customValidators: Function;

  @State() inputs: Array<HTMLInputElement>;

  hyperform = hyperform;

  componentDidLoad() {
    this.hyperform(window, {
      revalidate: 'onblur',
    });
    this.inputs = Array.from(this.el.querySelectorAll('input, select, textarea'));
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
  setField(name: string, value: string): void {
    if (typeof value === 'string') {
      const input = this.inputs.filter(input => input.name === name);
      if (input.length === 1) {
        input[0].value = value;
      }
    }
  }

  @Method()
  $(name: string) {
    const input = this.inputs.filter(input => input.name === name);
    if (input.length === 1) {
      return input[0];
    }
  }

  @Method()
  values() {
    const types = ['radio', 'checkbox'];
    let values = {};
    this.inputs.forEach(input => {
      const { name, value, type, checked } = input;
      if (name) {
        values[name] = value;
      }
      if (types.includes(type)) {
        values[name] = checked;
      }
    });
    return values;
  }

  @Method()
  errors() {
    let errors = {};
    this.inputs.forEach(input => {
      const { name } = input;
      if (name && input.classList.contains('hr-validated')) {
        errors[name] = input.validationMessage;
      }
    })
    return errors;
  }

  @Method()
  validate(elements) {
    // setup extra validators
    this.customValidators &&
      this.customValidators({
        elements,
        addValidator: this.hyperform.addValidator,
      });
    const isValid = this.inputs.reduce((acc, input) => {
      // @ts-ignore
      return acc && input.reportValidity();
    }, true);
    return isValid;
  }

  @Method()
  clear(): void {
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
            this.onSuccess && this.onSuccess(this.values(), {
              elements: this.getFormData(),
              addValidator: this.hyperform.addValidator,
            });
          }
        }}>
        <slot />
      </form >
    )
  }
}
