import lazy from '.';
import * as React from 'react';
import { cleanup, render, waitForDomChange } from '@testing-library/react';

describe('react-lazy', () => {
  afterEach(cleanup);

  it('should lazy import component right', async () => {
    const Item = lazy(() =>
      new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
        import('./Item')
      )
    );

    function App() {
      return (
        <React.Suspense fallback={<div>loading...</div>}>
          <Item value={666} />
        </React.Suspense>
      );
    }

    const { container } = render(<App />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          loading...
        </div>
      </div>
    `);

    /**
     * `react-test-renderer` 好像就没有这么好用的API
     */
    await waitForDomChange({ container });

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          666
        </div>
      </div>
    `);
  });

  /**
   * @todo test error
   */
});
