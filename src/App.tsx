import { Player, PlayerAPI, PlayerEvent, SourceConfig } from 'bitmovin-player';
import React from 'react';
import './App.css';

interface State {
  isPlayingHtml5: boolean;
  errorHtml5: any;
  isPlayingBitmovin: boolean;
  errorBitmovin: any;
  warningBitmovin: any;
}

class App extends React.Component<{}, State> {
  private videoEl!: HTMLVideoElement;
  private bitmovinPlayer!: PlayerAPI;
  state = {
    isPlayingHtml5: false,
    errorHtml5: undefined,
    isPlayingBitmovin: false,
    errorBitmovin: undefined,
    warningBitmovin: undefined
  };
  playerConfig = {
    key: '',
    ui: false
  };
  playerSource: SourceConfig = {
    dash: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
    hls: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    progressive:
      'https://bitdash-a.akamaihd.net/content/MI201109210084_1/MI201109210084_mpeg-4_hd_high_1080p25_10mbits.mp4',
    poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
    thumbnailTrack: {
      url:
        'https://fs.telecinecloud.com/filmstrips/Telecine_-_Staging/42/317/1759378_54693445892_mp4_video_480x270_272000_all_audio_1.vtt'
    }
  };

  onRefVideo = (el: HTMLVideoElement) => {
    this.videoEl = el;
    this.playHtml5Video();
  };

  onRefBitmovinPlayer = (el: HTMLDivElement) => {
    this.bitmovinPlayer = new Player(el, this.playerConfig);
    this.bitmovinPlayer.on(PlayerEvent.Warning, error =>
      this.setState({
        warningBitmovin: error
      })
    );

    this.bitmovinPlayer.load(this.playerSource).then(
      () => {
        console.log('Successfully loaded source');
        this.playBitmovinVideo();
      },
      () => {
        console.log('Error while loading source');
      }
    );
  };

  private play = () => {
    this.playHtml5Video();
    this.playBitmovinVideo();
  };

  private playHtml5Video = () =>
    this.videoEl
      .play()
      .then(() =>
        this.setState({
          isPlayingHtml5: true,
          errorHtml5: undefined
        })
      )
      .catch((error: DOMException) =>
        this.setState({
          isPlayingHtml5: false,
          errorHtml5: {
            message: error.message,
            name: error.name
          }
        })
      );

  private playBitmovinVideo = () =>
    this.bitmovinPlayer
      .play()
      .then(() =>
        this.setState({
          isPlayingBitmovin: true,
          errorBitmovin: undefined,
          warningBitmovin: undefined
        })
      )
      .catch(error =>
        this.setState({
          isPlayingBitmovin: false,
          errorBitmovin: {
            message: error.message,
            name: error.name
          }
        })
      );

  render() {
    return (
      <div className="App">
        <p>
          Go to <code>chrome://flags/</code> and set the <code>Autoplay policy</code> to{' '}
          <code>Document user activation is required</code> to view the error (refresh the page)
        </p>
        <p>
          Info:
          <a href="https://developers.google.com/web/updates/2017/09/autoplay-policy-changes">
            https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
          </a>
        </p>

        <hr />

        <video
          ref={this.onRefVideo}
          width="620"
          poster="https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg"
        >
          <source src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4" type="video/mp4" />
          Your browser doesn't support HTML5 video tag.
        </video>

        <hr />

        <div id="bitMovinPlayer" ref={this.onRefBitmovinPlayer} />

        <hr />

        <button onClick={this.play}>Click me to Play the Video</button>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
