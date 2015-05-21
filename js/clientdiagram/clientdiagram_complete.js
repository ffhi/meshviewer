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
        var missing = [];
        $.each(data[node], function(index, value) {
            if (index % 12 != 0) {
                value[0] = "";
            }
             if (value[1] == -1) {
                value[1] = 0;
                missing.push(index);
            }
            chart.addData([value[1]], value[0]);
        });
        // marking missing data red
        $.each(missing, function(index, value) {
            chart.datasets[0].points[value].fillColor = "#CC0000";
            chart.datasets[0].points[value].display = true;
        });
        chart.update();
    });
}
