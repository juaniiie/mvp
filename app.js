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
              console.log('dataset:', app.pie(languages));
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
    $('<div class="repo" id="chart">' + repoName + '</div>').appendTo($('.stats'));
    //
    //appending text and percentages
    _.each(languages, function(bytes, langName, languages) {
      var ratio = ((bytes / totalBytes) * 100).toFixed(1);
      $('<div class="langName">' + langName + ':' + ratio + '%' + '</div>')
        .appendTo($('.repo:last-child'));

        app.createPie(languages);
    });
  },

  createPie: function(languages) {
    var dataset = [];
    _.each(languages, function(bytes, langName) {
      dataset.push({label: langName, count: bytes});
    });

    var width = 360;
    var height = 360;
    var radius = Math.min(width, height) / 2;
    var color = d3.scale.category20b();
    var donutWidth = 75;
    
    var svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');

    var arc = d3.svg.arc()
    .innerRadius(radius - donutWidth) 
    .outerRadius(radius);

    var pie = d3.layout.pie()
    .value(function(d) { return d.count; })
    .sort(null);

    var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function(d, i) {
      return color(d.data.label);
    });

    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = svg.selectAll('.legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -2 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
    });

    legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', color)
    .style('stroke', color);

    legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });
  },

  clearDisplay: function() {
    $('#repos').children().remove();
  }
};

app.init();

