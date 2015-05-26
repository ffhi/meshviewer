// preset
var data = {
    labels: [],
    datasets: [
        {
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: []
        }
    ]
};

// try to get chart canvas
var canvas = $("#clientdiagram")[0];
if (canvas != null && canvas.className != "used") {
    canvas.className = "used";
    var ctx = canvas.getContext("2d");
    var chart = new Chart(ctx).Line(data, {
        animation: false,
        tooltipTemplate: "<%= value %> Client(s)",
        scaleBeginAtZero: true,
        pointDot: false,
        scaleShowVerticalLines: false,
        showTooltips: false,
        scaleLabel: "<%= ' ' + value%>"
    });

    // clear labels
    chart.scale.xLabels = [];
    chart.update();

    // add client statistics
    $.getJSON( "json/clienthistory_complete.json", function(data) {
        // extract node id from url
        var node = window.location.hash.substring(4);
	var nodes = []
	if (node != "") {
		nodes.push(node);
	} else if (window.location.hash == "#all") {
		$.each(data, function(index, value) {
			nodes.push(index);
		});
	} else {
		$("body").prepend("Kein Knoten ausgewählt - ");
	}

	var summedNodes = {};

	// sum up node values
	$.each(nodes, function(i, node) {
		$.each(data[node], function(k, timeClients) {
			var time = timeClients[0];
			var clients = timeClients[1];
			if (time in summedNodes) {
				if (clients > 0) summedNodes[time] += clients;
			} else {
				summedNodes[time] = clients;
			}
		});
	});

	var missing = [];
	var i = 0;
	$.each(summedNodes, function(time, clients) {
		if (i % 12 != 0) {
			time = "";
		}
		if (clients == -1) {
			clients = 0;
			missing.push(i);
		}
		chart.addData([clients], time);
		i++;
	});
	  // marking missing data red
	$.each(missing, function(index, value) {
		chart.datasets[0].points[value].fillColor = "#CC0000";
		chart.datasets[0].points[value].display = true;
	});
	chart.update();
    });
}
