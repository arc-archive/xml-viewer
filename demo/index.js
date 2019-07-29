import '@advanced-rest-client/arc-demo-helper/arc-demo-helper.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '../xml-viewer.js';

function load(file) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file);
  xhr.withCredentials = false;
  xhr.send();
  xhr.addEventListener('load', function(e) {
    document.getElementById('viewer').xml = e.target.response;
  });
  xhr.addEventListener('error', function() {
    const toast = document.querySelector('paper-toast');
    toast.text = 'Unable to load the XML file.';
    toast.opened = true;
  });
}

document.getElementById('theme').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});
document.getElementById('styled').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.body.classList.add('styled');
  } else {
    document.body.classList.remove('styled');
  }
});
document.getElementById('narrow').addEventListener('change', (e) => {
  const { checked } = e.target;
  const nodes = document.querySelectorAll('xml-viewer');
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (checked) {
      node.setAttribute('narrow', '');
    } else {
      node.removeAttribute('narrow');
    }
  }
});
document.getElementById('xmlSelect').addEventListener('change', (e) => {
  const file = e.target.value;
  load(file);
});
document.getElementById('viewer').addEventListener('action-link-change', (e) => {
  const toast = document.querySelector('paper-toast');
  toast.text = 'Selected URL: ' + e.detail.url;
  toast.opened = true;
});

const select = document.getElementById('xmlSelect');
load(select.value);
