---
---

google.charts.load('current', { 'packages': ['corechart'] });

window.lazyFunctions = {
  googleRenderLeaguePosition : function() {
    google.charts.setOnLoadCallback(drawLeaguePosition);
  },
  googleRenderPremierLeaguePosition : function() {
    google.charts.setOnLoadCallback(drawPremierLeaguePosition);
  },
  googleRenderWinLossDrawChart : function() {
    google.charts.setOnLoadCallback(drawWinLossDrawChart);
  }
}

function renderChart(type, id, options, data){

    var element = document.getElementById(id);
    if (element === null) {
        return;
    }

    var chart;
    switch (type) {
        case "LineChart":
            chart = new google.visualization.LineChart(element);
            break;
        case "ScatterChart":
            chart = new google.visualization.ScatterChart(element);
            break;
        case "PieChart":
            chart = new google.visualization.PieChart(element);
            break;
    }

     chart.draw(data, options);
}


function drawLeaguePosition() {
    var data = google.visualization.arrayToDataTable([
        ['Season', 'Position'],
        {% for data in site.data.season-finishes %}
        ['{{data.Season}}/{{data.Season | plus: 1}}', {{data.Position }}],
        {% endfor %}
    ]);

    var options = {
        title: 'Season finishes (1893 - present)',
        curveType: 'function',
        legend: { position: 'bottom' },
        series: {
            0: { color: '#EA323D' },
        },
        vAxis: {
            direction: -1, 
            minValue: 1,
            maxValue: 20,
            interval: 1,
            viewWindow: {
                min: 1,
                max: 20,
                interval : 1
            },
           ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
        }
    };

    renderChart('ScatterChart','scatter_chart', options, data);
}

function drawPremierLeaguePosition() {
    var data = google.visualization.arrayToDataTable([
        ['Season', 'Position'],
        {% assign seasonfinishes = site.data.season-finishes | where_exp: 'item', 'item.Season >= 1992' %}
        {% for data in seasonfinishes %}
        ['{{data.Season}}/{{data.Season | plus: 1}}', {{data.Position }}],
        {% endfor %}
    ]);

    var options = {
        title: 'Season finishes in premier league (1992 - present)',
        curveType: 'function',
        legend: { position: 'bottom' },
        series: {
            0: { color: '#EA323D' },
        },
        vAxis: {
            direction: -1, 
            minValue: 1,
            maxValue: 20,
            interval: 1,
            viewWindow: {
                min: 1,
                max: 20,
                interval : 1
            },
           ticks: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
        }
    };

    renderChart('ScatterChart','scatter_chart_premier_league', options, data);
}

  {% for data in site.seasons %} 
     {% for match in data.Matches %}
     {% if match.Competition == "League" %}
      {% capture oppositionWins %}
        {% if match.OppositionScore > match.ArsenalScore %}
          {{ oppositionWins | plus: 1 }}
        {% else %}
          {{ oppositionWins | plus: 0 }}
        {% endif %} 
      {% endcapture %}
      {% capture arsenalWins %}
        {% if match.OppositionScore < match.ArsenalScore %}
          {{ arsenalWins | plus: 1 }}
        {% else %}
          {{ arsenalWins | plus: 0 }}
        {% endif %} 
      {% endcapture %}
      {% capture draws %}
        {% if match.OppositionScore == match.ArsenalScore %}
          {{ draws | plus: 1 }} 
        {% else %}
          {{ draws | plus: 0 }}
        {% endif %} 
      {% endcapture %} 
      {% endif %}   
      {% endfor %}
  {% endfor %}

function drawWinLossDrawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Results', 'Def'],
        ['Wins', {{arsenalWins }}],
        ['Draws', {{draws }}],
        ['Losses', {{oppositionWins }}],
    ]);

    var options = {
        title: 'Win/Draw/Loss record since 1893 in the League',
        curveType: 'function',
        legend: { position: 'bottom' },
        is3D: true,
    };

    renderChart('PieChart','pie_chart', options, data);
}

window.addEventListener('resize', function(){
  drawLeaguePosition();
  drawPremierLeaguePosition();
  drawWinLossDrawChart();
});

function executeLazyFunction(element) {
  var lazyFunctionName = element.getAttribute(
    "data-lazy-function"
  );
  var lazyFunction = window.lazyFunctions[lazyFunctionName];
  if (!lazyFunction) return;
  lazyFunction(element);
}

var ll = new LazyLoad({
  unobserve_entered: true, // <- Avoid executing the function multiple times
  callback_enter: executeLazyFunction // Assigning the function defined above
});