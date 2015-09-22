var app = {
  init: function() {
    $(document).ready(function() {
      console.log('im in init');
      $('form').submit(function() {
        // console.log('im in summit function');
        var username = $('input').val();
        // console.log(username);
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
          //for each repo make a get request to get languages
          $ajax({
            url:'https://api.github.com/repos/' + username + '/' + repo.name + '/languages',
            type: 'GET',
            success: function(languages) {
              console.log('Success! We have retrieved languages for repo: ' + repo);
            },
            error: function(languages) {
              console.log('Error: unable to get languages for repo: ' + repo.name);
            }
          });
        });
      },
      error: function(repos) {
        console.log('Error: could not retrieve repos for user: ' + username);
      }
    });
  },

  // displayLang: function(repos, username, laguages) {
  //   _.each()
  // },


};
app.init();

