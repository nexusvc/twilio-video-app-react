import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.
const connectionOptions: ConnectOptions = {
  bandwidthProfile: {
    video: {
      mode: 'grid',
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 90, width: 160 },
        low: { height: 90, width: 160 },
      },
    },
  },
  audio: false,
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

const VideoApp = () => {
  const { error, setError } = useAppState();
  const { AccessToken, UserID } = useParams();
  console.log(AccessToken, UserID);
  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

class NexusvcMonitor extends React.Component {
  constructor(props: any) {
    super(props);

    this.state = {
      theme: theme,
      user: {},
      session: this,
    };
  }

  componentDidMount() {
    console.log('did mount');
  }

  componentDidUpdate() {
    console.log('did update');
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppStateProvider>
            <Switch>
              <PrivateRoute exact path="/">
                <VideoApp />
              </PrivateRoute>
              <PrivateRoute path="/room/:URLRoomName/:UserID/:admin?">
                <VideoApp />
              </PrivateRoute>
              <Route path="/">
                <LoginPage />
              </Route>
              <Redirect to="/" />
            </Switch>
          </AppStateProvider>
        </Router>
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(<NexusvcMonitor />, document.getElementById('root'));
