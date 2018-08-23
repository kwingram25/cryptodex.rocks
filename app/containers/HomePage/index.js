/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Grid, Container } from 'semantic-ui-react';
import { detect } from 'detect-browser';

import Branding from 'components/Branding';
import GetButtons from 'components/GetButtons';
import HomePageSlider from 'components/HomePageSlider';
import Footer from 'components/Footer';

import './index.less';
import '../../global.css';

const mobile = [
  'iOS',
  'Android OS',
  'BlackBerry OS',
  'Windows Mobile',
];

const isReleased = true;

// let isReleased;
// if (process.env.NODE_ENV === 'production') {
//   isReleased = process.env.RELEASED === 'true';
// } else {
//   isReleased = true;
// }

const browser = detect();

// console.log({browser, os});

const isChrome = browser && browser.name === 'chrome';
const isMobile = browser && mobile.includes(browser.os);

export default () => ((
  <section>
    <Helmet>
      <title>Cryptocurrency address book for Chrome</title>
      <meta name="description" content="Your all-in-one cryptocurrency address book for Google Chrome" />
    </Helmet>
    <Container>
      <Grid className="home-grid" verticalAlign="middle" stackable columns={2}>
        <Grid.Row>
          <Grid.Column className="left">
            <Branding />
            <GetButtons {...{ isChrome, isMobile, isReleased }} />
          </Grid.Column>
          <Grid.Column className="right">
            <HomePageSlider {...{ isMobile }} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <Footer />
  </section>
));
