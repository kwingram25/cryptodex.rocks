/* eslint global-require: off, react/no-array-index-key: off */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';
import Halogen from 'halogen';
import { FormattedMessage } from 'react-intl';

import 'static/css/slick/slick.less';
import 'static/css/slick/slick-theme.less';

import './index.less';

import messages from './messages';

const demos = [
  'demo1',
  'demo2',
  'demo3',
  'demo4',
];

const PlayButton = ({ onClick }) => ((
  <a
    {...{
      className: 'controls',
      href: '#',
      onClick: (e) => {
        e.preventDefault();
        onClick();
      },
    }}
  >
    ▶
  </a>
));
PlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default class HomePageSlider extends Component {

  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isMobile: false,
  }

  state = {
    slide: 0,
    controls: false,
    buffering: false,
  }

  componentDidMount() {
    // console.log(this.players);
    this.players.forEach((player) => {
      player.getInternalPlayer().addEventListener('waiting', this.startBuffering);
      player.getInternalPlayer().addEventListener('playing', this.stopBuffering);
    });
  }

  componentWillUnmount() {
    this.players.forEach((player) => {
      player.getInternalPlayer().removeEventListener('waiting', this.startBuffering);
      player.getInternalPlayer().removeEventListener('playing', this.stopBuffering);
    });
  }

  sliderProps = {
    className: 'homepage-slider',
    fade: true,
    adaptiveHeight: true,
    beforeChange: async (oldIndex, newIndex) => {
      this.oldIndex = oldIndex;
      if (this.players[newIndex]) {
        await this.players[newIndex].seekTo(0);
      }
      if (this.state.slide !== newIndex) {
        this.setState({ slide: newIndex });
      }
        // if (this.players[oldIndex]) {
        //   this.players[oldIndex].seekTo(0);
        // }
    },
      // afterChange: () => {
      //   const {oldIndex} = this;
      //   if (this.players[oldIndex]) {
      //     this.players[oldIndex].seekTo(0);
      //   };
      // },
    ref: (slider) => {
      this.slider = slider;
    },
  };

  playerProps = {
    height: '100%',
    width: 'auto',
    onPlay: () => {
      // console.log('stopBuffering');
      this.setState({
        controls: false,
        buffering: false,
      });
    },
    onError: () => {
      this.setState({
        controls: true,
        buffering: false,
      });
    },
    // onBuffer: () => {
    //   this.setState({
    //     buffering: true,
    //     controls: false,
    //   });
    // },
    onEnded: async () => {
      const { slide } = this.state;
      const nextSlide = slide === demos.length
          ? 0
          : slide + 1;
      await this.setState({ slide: nextSlide });
      if (this.slider) {
        this.slider.slickNext();
      }
    },
  };

  startBuffering = () => {
    // console.log('startBuffering');
    this.setState({
      buffering: true,
      controls: false,
    });
  }

  stopBuffering = () => {
    // console.log('stopBuffering');
    this.setState({
      buffering: false,
      controls: false,
    });
  }

  render() {
    const {
        state: {
          slide,
          controls,
          buffering,
        },
        props: {
          isMobile,
        },
      } = this;

    const sliderProps = {
      ...this.sliderProps,
      ...(
        isMobile ?
        {
          dots: true,
          className: 'mobile',
          autoplay: true,
          autoplaySpeed: 8000,
        } :
        {
          className: 'desktop',
        }
      ),
    };

    return (
      <Slider {...sliderProps}>
        {
            demos.map((code, index) => {
              const key = `slide-${index}`;
              return (
                <div key={key} className="homepage-slide">
                  <h3>
                    <FormattedMessage {...messages[code]} />
                  </h3>
                  <div className={`wrapper ${isMobile ? 'image' : 'video'}`}>
                    {
                      isMobile ?
                        <div>
                          <img
                            alt={messages[code].defaultMessage}
                            src={require(`static/img/${code}.jpg`)}
                          />
                        </div> :
                      (() => {
                        const playerProps = {
                          ...this.playerProps,
                          url: require(`static/videos/${code}.webm`),
                          muted: true,
                          autoPlay: true,
                          // playing: false,
                          playing: slide === index,
                          ref: (player) => {
                            if (!this.players) {
                              this.players = [];
                            }
                            this.players[index] = player;
                          },
                        };

                        return [
                          <ReactPlayer key={`homepage-player-${index}`} {...playerProps} />,
                        ];
                      })()
                    }
                    {
                      (!isMobile && controls) && (
                        <PlayButton
                          onClick={async () => {
                            if (this.players[index]) {
                              this.players[index].seekTo(0);
                            // this.slider.slickGoTo(index + 1);
                            // this.forceUpdate();
                            // await this.slider.slickPrev();
                              this.slider.slickNext();
                            // this.slider.forceUpdate();
                            }
                          }}
                        />
                      )
                    }

                    <div style={(isMobile || !buffering) ? { display: 'none' } : {}} className="buffering">
                      <Halogen.ScaleLoader color="rgba(255, 255, 255, 0.6)" />
                    </div>


                  </div>
                </div>
              );
            })
          }
      </Slider>
    );
  }
}
