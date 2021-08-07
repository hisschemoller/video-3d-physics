import setup from './app/enable3d';
import render from './app/render';

const urlSearchParams = new URLSearchParams(window.location.search);
if (urlSearchParams.get('mode') === 'render') {
  render();
} else {
  setup();
}
