document.addEventListener('DOMContentLoaded', function() {
  // Load current settings
  browser.storage.local.get('postLimit').then(result => {
    document.getElementById('postLimit').value = result.postLimit || 5;
  });

  // Save settings
  document.getElementById('save').addEventListener('click', function() {
    const postLimit = parseInt(document.getElementById('postLimit').value);
    
    browser.storage.local.set({
      postLimit: postLimit
    }).then(() => {
      const status = document.getElementById('status');
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  });
});
