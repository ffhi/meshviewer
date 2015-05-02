// preset
var pre_data = {
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

var weekdays = {};
weekdays["Mon"] = "Mo";
weekdays["Tue"] = "Di";
weekdays["Wed"] = "Mi";
weekdays["Thu"] = "Do";
weekdays["Fri"] = "Fr";
weekdays["Sat"] = "Sa";
weekdays["Sun"] = "So";

// try to get chart canvas
var checkExist = setInterval(function() {
    var canvas = $("#clientdiagram")[0];
    if (canvas != null) {
        clearInterval(checkExist);
        var ctx = canvas.getContext("2d");

        // add client statistics
        $.getJSON( "json/clienthistory.json", function(data) {
            // extract node id from url
            var node = window.location.hash.substring(4);
            var missing = [];
            // get maximum
            var max = 0;
            $.each(data[node], function(index, value) {
                if (value[1] > max) max = value[1];
	    });
            var steps = (max > 10 ? 10 : max);

            var chart = new Chart(ctx).Line(pre_data, {
                animation: false,
                tooltipTemplate: "<%= value %> Client(s)",
                scaleBeginAtZero: true,
                pointDot: false,
                scaleShowVerticalLines: false,
                showTooltips: false,
                scaleLabel: "<%= ' ' + value%>",
                scaleOverride: true,
                scaleSteps: steps,
                scaleStepWidth: Math.ceil(max / 10),
                scaleStartValue: 0
            });

            // clear labels
            chart.scale.xLabels = [];
            chart.update();

            $.each(data[node], function(index, value) {
                var hour = value[0].substring(16, 18);
                if (hour % 12 != 0) {
                    value[0] = "";
                } else {
                    value[0] = weekdays[value[0].substring(0, 3)]
                        + value[0].substring(3, 5) + value[0].substring(16);
                }
                if (value[1] == -1) {
                    value[1] = 0;
                    missing.push(index);
                }
		//alert(value[1]+": "+value[0]);
                chart.addData([value[1]], value[0]);
             });
             // marking missing data red
             $.each(missing, function(index, value) {
                 chart.datasets[0].points[value].fillColor = "#CC0000";
             });
             chart.update();
        });
    }
}, 200);

