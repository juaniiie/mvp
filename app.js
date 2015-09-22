var app = {
  init: function() {
    $(document).ready(function() {
      $('form').submit(function() {
        var username = $('input').val();
        event.preventDefault();
        $('input').val('');
        app.get(username);
        app.clearDisplay();
      });
    });
  },

  get: function(username) {
    $.ajax({
      url:'https://api.github.com/users/' + username + '/repos',
      type: 'GET',
      success: function(repos) {
        console.log('Success! We have retrieved all repos for user: ' + username);
        //for each repo make another ajax request for languages
        _.each(repos, function(repo) {
          var repoName = repo.name;
          $.ajax({
            url:'https://api.github.com/repos/' + username + '/' + repoName + '/languages',
            type: 'GET',
            success: function(languages) {
              console.log('Success! We have retrieved languages for repo: ' + repoName);
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
    $('<div class="repo" id="repoName">' + repoName + '</div>').appendTo($('.stats'));
    //
    //appending text and percentages
    _.each(languages, function(bytes, langName) {
      var ratio = ((bytes / totalBytes) * 100).toFixed(1);
      $('<div id="langName" >' + langName + ':' + ratio + '%' + '</div>')
        .appendTo($('.repo:last-child'));
    });
    //end of each

    //from tutorial
    // var dataset = _.map(languages)

    // [
    // { label: 'Abulia', count: 10 },
    // { label: 'Betelgeuse', count: 20 },
    // { label: 'Cantaloupe', count: 30 },
    // { label: 'Dijkstra', count: 40 }
    // ];


  },

  clearDisplay: function() {
    $('#repos').children().remove();
  }
};

app.init();

