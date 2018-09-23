/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */

import '@stencil/core';

declare global {
  namespace JSX {
    interface Element {}
    export interface IntrinsicElements {}
  }
  namespace JSXElements {}

  interface HTMLElement {
    componentOnReady?: () => Promise<this | null>;
  }

  interface HTMLStencilElement extends HTMLElement {
    componentOnReady(): Promise<this>;

    forceUpdate(): void;
  }

  interface HTMLAttributes {}
}


declare global {

  namespace StencilComponents {
    interface FormyForm {
      '$': (name: string) => HTMLInputElement;
      'clear': () => void;
      'customValidators': Function;
      'errors': () => {};
      'onSuccess': Function;
      'options': Object;
      'setField': (name: string, value: string) => void;
      'submit': () => Promise<Object>;
      'validate': (elements: any) => any;
      'values': () => {};
    }
  }

  interface HTMLFormyFormElement extends StencilComponents.FormyForm, HTMLStencilElement {}

  var HTMLFormyFormElement: {
    prototype: HTMLFormyFormElement;
    new (): HTMLFormyFormElement;
  };
  interface HTMLElementTagNameMap {
    'formy-form': HTMLFormyFormElement;
  }
  interface ElementTagNameMap {
    'formy-form': HTMLFormyFormElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'formy-form': JSXElements.FormyFormAttributes;
    }
  }
  namespace JSXElements {
    export interface FormyFormAttributes extends HTMLAttributes {
      'customValidators'?: Function;
      'onSuccess'?: Function;
      'options'?: Object;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;