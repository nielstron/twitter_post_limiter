(function () {
const postIndexMap = new Map();
let currentIndex = 1;
let postLimit = 5; // Default value

// Load the post limit from storage
browser.storage.local.get('postLimit').then(result => {
  if (result.postLimit) {
    postLimit = result.postLimit;
  }
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.postLimit) {
    postLimit = changes.postLimit.newValue;
    // Reapply numbering to existing posts
    document.querySelectorAll('article[data-testid="tweet"][data-numbered]').forEach(post => {
      post.dataset.numbered = false;
    });
    numberPosts();
  }
});

function numberPosts() {
  const posts = document.querySelectorAll('article[data-testid="tweet"]:not([data-numbered])');

  posts.forEach(post => {
    const postId = post.innerText; // or any other unique identifier
    if (!postIndexMap.has(postId)) {
      postIndexMap.set(postId, currentIndex);
      currentIndex++;
    }

    const containerDiv = document.createElement('div');
    const numberDiv = document.createElement('div');
    const postIndex = postIndexMap.get(postId);
    const inTheRed = postIndex > postLimit;
    containerDiv.style.position = 'absolute';
    containerDiv.style.top = '10px';
    containerDiv.style.left = '10px';
    containerDiv.style.display = 'flex';
    containerDiv.style.justifyContent = 'center';
    containerDiv.style.alignItems = 'center';
    containerDiv.style.flexDirection = 'row';
    containerDiv.style.zIndex = '1';
    containerDiv.style.padding = '5px';
    containerDiv.style.borderRadius = '15px';
    if (inTheRed) {
      containerDiv.style.width = (post.offsetWidth-20)+'px';
      containerDiv.style.height = (post.offsetHeight-20)+'px';
      containerDiv.style.backdropFilter = 'blur(10px)';
      containerDiv.style.fontSize = '64px';
      containerDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    }
    else {
      containerDiv.style.width = '15px';
      containerDiv.style.height = '15px';
      containerDiv.style.fontSize = '14px';
      containerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }

    numberDiv.textContent = inTheRed ? `${postIndex} (past your limit!)` : postIndex;
    numberDiv.style.color = 'white';
    numberDiv.style.fontWeight = 'bold';
    numberDiv.style.textAlign = 'center';

    containerDiv.prepend(numberDiv);
    post.prepend(containerDiv);
    post.dataset.numbered = true; // Mark the post as numbered
  });
}

// Initial call to number the posts
window.addEventListener('load', function() {
  let interval = 0;
  interval = setInterval(function() {
    if (document.querySelector('article[data-testid="tweet"]')) {
      clearInterval(interval);
      numberPosts();
    }
  }, 10);
})

// Listen for scroll events
window.addEventListener('scroll', numberPosts);
})();
