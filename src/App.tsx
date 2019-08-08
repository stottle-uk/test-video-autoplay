import React from 'react';
import './App.css';

interface State {
  isPlaying: boolean;
  error: any;
}

class App extends React.Component<{}, State> {
  private videoEl!: HTMLVideoElement;
  state = {
    error: undefined,
    isPlaying: false
  };

  onRefVideo = (el: HTMLVideoElement) => {
    this.videoEl = el;
    this.playVideo();
  };

  private playVideo = () => {
    this.videoEl
      .play()
      .then(() =>
        this.setState({
          isPlaying: true,
          error: undefined
        })
      )
      .catch((error: DOMException) =>
        this.setState({
          isPlaying: false,
          error: {
            message: error.message,
            name: error.name
          }
        })
      );
  };

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

        <button onClick={this.playVideo}>Click me to Play the Video</button>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
