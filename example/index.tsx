import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Cursor } from '../src/index';

const App = () => {
  return (
    <div>
      <h1>Hello World!</h1>
      <Cursor />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
