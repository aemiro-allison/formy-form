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
      'clear': () => void;
      'customValidators': Function;
      'getErrors': () => {};
      'getValues': () => {};
      'onSuccess': Function;
      'validate': (elements: any) => any;
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
    }
  }
}


declare global {

  namespace StencilComponents {
    interface MyComponent {
      'first': string;
      'last': string;
    }
  }

  interface HTMLMyComponentElement extends StencilComponents.MyComponent, HTMLStencilElement {}

  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };
  interface HTMLElementTagNameMap {
    'my-component': HTMLMyComponentElement;
  }
  interface ElementTagNameMap {
    'my-component': HTMLMyComponentElement;
  }
  namespace JSX {
    interface IntrinsicElements {
      'my-component': JSXElements.MyComponentAttributes;
    }
  }
  namespace JSXElements {
    export interface MyComponentAttributes extends HTMLAttributes {
      'first'?: string;
      'last'?: string;
    }
  }
}

declare global { namespace JSX { interface StencilJSX {} } }

export declare function defineCustomElements(window: any): void;