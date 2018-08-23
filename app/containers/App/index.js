/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import 'static/fonts/stylesheet.css';
import '../../../theme/semantic.less'; // ES6
import '../../global.css';
import './index.css';

export default function App() {
  return (
    <div>
      <Helmet
        titleTemplate="Cryptodex - %s"
        defaultTitle="Cryptodex"
      >
        <meta name="description" content="Your all-in-one cryptocurrency address book for Google Chrome" />
      </Helmet>
      {/* }<Header />*/}
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      {/* }<Footer />*/}
    </div>
  );
}
