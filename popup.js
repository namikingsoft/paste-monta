document.addEventListener('DOMContentLoaded', () => {
  const background = chrome.extension.getBackgroundPage();
  background.load(({ montas, styles }) => {
    document.querySelector('#montas').value = montas;
    document.querySelector('#styles').value = styles;
  });
}, false);

window.addEventListener('unload', () => {
  const montas = document.querySelector('#montas').value;
  const styles = document.querySelector('#styles').value;
  const background = chrome.extension.getBackgroundPage();
  background.save({ montas, styles });
}, false);
