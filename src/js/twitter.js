export function leggedAuth() {
  let url = 'https://api.twitter.com/oauth/authorize';
  var oauthToken = '10168638-cjQDsZbNSEvGOih33pBpdz2Bw4u2aj4UzItQ07i';
  var request = url + '?oauth_token=' + oauthToken;

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.status);
      console.log(xhr.statusText);
    }
  };

  xhr.open('GET', request, true);
  xhr.setRequestHeader('Authorization', authorizationValue);
  xhr.send();
}
