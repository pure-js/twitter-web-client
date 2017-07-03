'use strict'

// console.log(tweets);

function leggedAuth() {
  let url = 'https://api.twitter.com/oauth/authorize';
  var oauthToken = '';
  var request = url + '?oauth_token=' + oauthToken;

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.status);
      console.log(xhr.statusText);
    }
  };

  xhr.open('GET', request, true);
  xhr.setRequestHeader('Authorization', authorizationValue);
  xhr.send();
}
