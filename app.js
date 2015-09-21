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
      success: function(data) {
        console.log('Success! We have retrieved all repos for user: ' + username);
        console.log(data);
      },
      error: function(data) {
        console.log('Error: could not retrieve repos for user: ' + username);
      }
    });
  }
};
app.init();

