var app = {
  init: function() {
    $(document).ready(function() {
      // console.log('im in init');
      $('form').submit(function() {
        var username = $('input').val();
        event.preventDefault();
        $('input').val('');
        app.get(username);
      });
    });
  },

  get: function(username) {
    // console.log('im in get');
    $.ajax({
      url:'https://api.github.com/users/' + username + '/repos',
      type: 'GET',
      success: function(repos) {
        console.log('Success! We have retrieved all repos for user: ' + username);
        // console.log(repos);
        _.each(repos, function(repo) {
          var repoName = repo.name;
          // console.log('I am inside the each function');
          //for each repo make a get request to get languages
          $.ajax({
            url:'https://api.github.com/repos/' + username + '/' + repoName + '/languages',
            type: 'GET',
            success: function(languages) {
              console.log('Success! We have retrieved languages for repo: ' + repoName);
              // console.log(languages);
              app.display(repoName, languages);

            },
            error: function(languages) {
              console.log('Error: unable to get languages for repo: ' + repoName);
            }
          });
        });
      },
      error: function(repos) {
        console.log('Error: could not retrieve repos for user: ' + username);
      }
    });
  },

  display: function(repoName, languages) {
    var totalBytes = 0;
    _.each(languages, function(bytes) {
      totalBytes += bytes;
    });
    _.each(languages, function(bytes, langName) {
      var ratio = Math.floor(bytes / totalBytes) * 100 ;
      $('<div><div>' + repoName + '</div><div>' + langName + ':' + ratio + '%' + '</div></div>')
        .appendTo($('#child:last-child'));
    });
  },

  clearDisplay: function() {

  }
};
app.init();

