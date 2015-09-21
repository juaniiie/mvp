// YOUR CODE HERE:

var app = {
  init: function() {
    $(document).ready(function() {
      
      //on click event listeners
      //other actions to be done when app loads
  
    });
  },

  send: function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function() {
    $.ajax({
      url:'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      success: function(data) {
        app.displayMessages(data);
        app.displayChatroomsMenu(data);
        // console.log(data['results']);
      },
      error: function(data) {
      }
    });
  },



};

app.init() ;