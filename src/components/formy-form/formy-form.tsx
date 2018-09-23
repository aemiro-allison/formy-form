import { Component, Element, State, Prop, Method } from '@stencil/core';
import hyperform from 'hyperform';
import serialize from 'form-serialize';

@Component({
  tag: 'formy-form',
  styleUrl: 'formy-form.css',
})
export class FormyForm {
  @Element() el: HTMLFormElement;

  @Prop() onSuccess: Function;
  @Prop() customValidators: Function;
  @Prop() options: Object = {};

  @State() inputs: Array<HTMLInputElement>;
  @State() invalidValues: Object = {};

  form: HTMLFormElement;

  defaultOptions: Object = {
    revalidate: 'onsubmit',
  };

  componentDidLoad() {
    // have hyperform manage HTML5 Constraint API for all inputs under where formy-form is used.
    this.form = this.el.querySelector('form');
    hyperform(this.form, {
      ...this.defaultOptions,
      ...this.options,
    });
    this.getInputs();
  }

  getInputs(): Array<HTMLInputElement> {
    const inputs: Array<HTMLInputElement> = Array.from(
      this.el.querySelectorAll('input, select, textarea')
    );
    // only interested in inputs with valid name attribute and is not disabled.
    this.inputs = inputs.filter(input => input.name && !input.disabled);
    return this.inputs;
  }

  getElements(): Object {
    let elements = {};
    this.getInputs().forEach((input) => {
      const { name } = input;
      if (name) {
        elements[name] = input;
      }
    });
    return elements;
  }

  @Method()
  $(name: string) {
    const input = this.getInputs().filter(input => input.name === name);
    if (input.length === 1) {
      return input[0];
    }
  }

  @Method()
  values(): Object {
    return serialize(this.form, { hash: true });
  }

  @Method()
  errors(): Object {
    let errors = {};
    this.getInputs().forEach(input => {
      const { name } = input;
      if (name) {
        errors[name] = input.validationMessage;
      }
    })
    return errors;
  }

  @Method()
  validate(elements): boolean {
    // setup extra validators
    this.customValidators &&
      this.customValidators({
        elements,
        addValidator: hyperform.addValidator,
      });
    const isValid = this.getInputs().reduce((acc, input) => {
      // @ts-ignore
      return acc && input.reportValidity();
    }, true);
    return isValid;
  }

  updateInvalidValues(element): void {
    const { name, value } = element;
    if (this.invalidValues[name]) {
      this.invalidValues = {
        ...this.invalidValues,
        [name]: [...this.invalidValues[name], value],
      };
    } else {
      this.invalidValues = {
        ...this.invalidValues,
        [name]: [value],
      }
    }
  }

  addInvalidValuesValidatorOnce(element, errorMsg): void {
    if (!this.invalidValues[element.name]) {
      hyperform.addValidator(element, el => {
        const invalidValues = this.invalidValues[el.name] || [el.value];
        console.log('invalidValues', invalidValues);
        const valid = !invalidValues.includes(el.value);
        const errorMessage = errorMsg || 'Something went wrong.';
        el.setCustomValidity(valid ? '' : errorMessage);
      });
    }
  }

  @Method()
  invalidate = (element, errorMsg): void => {
    this.addInvalidValuesValidatorOnce(element, errorMsg);
    this.updateInvalidValues(element);
    element.reportValidity();
  }

  @Method()
  setField(name: string, value: string): void {
    if (typeof value === 'string') {
      const input = this.getInputs().filter(input => input.name === name);
      if (input.length === 1) {
        input[0].value = value;
      }
    }
  }

  @Method()
  clear(): void {
    this.getInputs().forEach(input => input.value = '');
  }

  @Method()
  submit(): Promise<Object> {
    const options = {
      elements: this.getElements(),
      invalidate: this.invalidate,
    };

    return new Promise((resolve, reject) => {
      const isValid = this.validate(this.getElements());
      if (isValid) {
        resolve({ values: this.values(), ...options });
      } else {
        reject({ errors: this.errors(), ...options });
      }
    })
  }

  render() {
    return (
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          const isValid = this.validate(this.getElements());
          // console.log('isValid', isValid);
          if (isValid) {
            this.onSuccess && this.onSuccess(this.values(), {
              elements: this.getElements(),
              invalidate: this.invalidate,
            });
            if (!this.onSuccess) console.error('no onSuccess method was passed to formy-form');
          }
        }}>
        <slot />
      </form >
    )
  }
}
