import * as React from 'react';

const cache: any = {};

export default function lazy<T extends React.ComponentType<any>>(
  fn: () => Promise<{ default: T }>
): T {
  const key = Symbol();
  cache[key] = {
    data: undefined,
    error: undefined,
    promise: fn().then(
      data => (cache[key].data = data.default),
      error => (cache[key].error = error)
    )
  };
  return function Lazy(props: any) {
    if (cache[key].error) {
      throw cache[key].error;
    }
    if (cache[key].data) {
      const Component: T = cache[key].data;
      return React.createElement(Component, props);
    }
    if (cache[key].promise) {
      throw cache[key].promise;
    }
    throw new Error();
  } as T;
}
