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
  @Prop() addCustomValidators: Function;
  @Prop() options: Object = {};

  @State() invalidValues: Object = {};

  form: HTMLFormElement;

  defaultOptions: Object = {
    revalidate: 'onsubmit',
  };

  componentDidLoad() {
    this.form = this.el.querySelector('form');
    hyperform(this.form, {
      ...this.defaultOptions,
      ...this.options,
    });
  }

  @Method()
  public $(name: string): HTMLInputElement {
    const input = this.getInputs().filter(input => input.name === name);
    if (input.length === 1) {
      return input[0];
    }
  }

  private addInvalidValuesValidatorOnce(element, errorMsg): void {
    if (!this.invalidValues[element.name]) {
      hyperform.addValidator(element, el => {
        const invalidValues = this.invalidValues[el.name] || [el.value];
        const valid = !invalidValues.includes(el.value);
        const errorMessage = errorMsg || 'Invalid value';
        el.setCustomValidity(valid ? '' : errorMessage);
      });
    }
  }

  @Method()
  public clear(): void {
    this.getInputs().forEach(input => input.value = '');
  }

  @Method()
  public errors(): Object {
    let errors = {};
    this.getInputs().forEach(input => {
      const { name } = input;
      if (name) {
        errors[name] = input.validationMessage;
      }
    })
    return errors;
  }

  private getInputs(): Array<HTMLInputElement> {
    const inputs: Array<HTMLInputElement> = Array.from(
      this.el.querySelectorAll('input, select, textarea')
    );
    return inputs.filter(input => input.name && !input.disabled);
  }

  private getElements(): Object {
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
  public invalidate = (element, errorMsg): void => {
    this.addInvalidValuesValidatorOnce(element, errorMsg);
    this.updateInvalidValues(element);
    element.reportValidity();
  }

  @Method()
  public setField(name: string, value: string): void {
    if (typeof value === 'string') {
      const input = this.getInputs().filter(input => input.name === name);
      if (input.length === 1) {
        input[0].value = value;
      }
    }
  }

  @Method()
  public submit(): Promise<Object> {
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

  private updateInvalidValues(element): void {
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

  @Method()
  public validate(elements): boolean {
    // setup extra validators
    if (this.addCustomValidators) {
      this.addCustomValidators({
        elements,
        addValidator: hyperform.addValidator,
      });
    }
    const isValid = this.getInputs().reduce((acc, input) => {
      // @ts-ignore
      return acc && input.reportValidity();
    }, true);
    return isValid;
  }

  @Method()
  public values(): Object {
    return serialize(this.form, { hash: true });
  }

  render() {
    return (
      <form
        onSubmit={(e: Event) => {
          e.preventDefault();
          const isValid = this.validate(this.getElements());
          if (isValid) {
            if (this.onSuccess) {
              this.onSuccess(this.values(), {
                elements: this.getElements(),
                invalidate: this.invalidate,
              });
            } else {
              console.error('no onSuccess method was passed to formy-form');
            }
          }
        }}>
        <slot />
      </form >
    )
  }
}
