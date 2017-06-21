$("#chartContainer").animate({
	width: "0%"
}, 100);

ctx = $("#cart");

if ($(window).width() > 1150) {
	sirka = "88%"
}
else {
	sirka = "79%"
}

$(window).resize(checkWidth);

function checkWidth () {
	if ($(window).width() > 1150) {
	sirka = "88%"
}
else {
	sirka = "79%"
}

$("#chartContainer").css("width", sirka)
}

var chartWidth = sirka

function updateChart(day) {

	$("#chartContainer").animate({
		width: "0%"
	}, 500);

	if (!hid) {setTimeout(function () {
		$("#chartContainer").animate({
			width: sirka
		}, 1000);
	}, 800);}
	else {
		$("#chartContainer").animate({
			width: "98%"
		}, 1000);
	}
	lab = [];
	pubs = [];
	pubs1 = []

	for (var i = 0; i < timely[day - 1].features.length; i++) {
		var dateds = new Date(timely[day - 1].features[i].properties.stav_cas);
		var formates = moment(dateds).format('HH:mm');
		lab.push(formates)


	};

	for (var yj = 0; yj <= 287; yj++) {
		eval("var datedy" + yj + " = 0")
		eval("var datedyz" + yj + " = 0")
	}

	for (var p = 0; p < dayly[day - 1].features.length; p++) {

		var fet = dayly[day - 1].features[p]


		for (var j = 0; j <= 287; j++) {
			if (parseInt(fet.properties.usek) <= 30) {
				var formt = 'stav_' + (j + 1)

				eval("datedy" + j + " += parseInt(fet.properties." + formt + ")");
			}
			if (parseInt(fet.properties.usek) > 30) {
				var formt = 'stav_' + (j + 1)
				eval("datedyz" + j + " += parseInt(fet.properties." + formt + ")");
			}
		};



	};
	for (var yji = 0; yji <= 287; yji++) {
		eval("datedyk = parseInt(datedy" + yji + " / 30)")
		pubs.push(datedyk);
		eval("datedykz = parseInt(datedyz" + yji + " / 30)")
		pubs1.push(datedykz);

	}

	data = {
		labels: lab,
		datasets: [{
			label: "Průměrná rychlost [km/h]",
			fill: false,
			tension: 0,
			backgroundColor: "rgba(45, 160, 226,1)",
			borderColor: "rgba(45, 160, 226,1)",
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'round',
			pointBorderColor: "rgba(75,192,192,1)",
			pointBackgroundColor: "#fff",
			pointBorderWidth: 0,
			pointHoverRadius: 0,
			pointHoverBackgroundColor: "rgba(75,192,192,1)",
			pointHoverBorderColor: "rgba(220,220,220,1)",
			pointHoverBorderWidth: 0,
			pointRadius: 0,
			pointHitRadius: 10,
			data: pubs,
			spanGaps: true,
		}, {
			label: "Průměrná rychlost [km/h]",
			fill: false,
			tension: 0,
			backgroundColor: "rgba(	226, 111, 45 ,1)",
			borderColor: "rgba(	226, 111, 45 ,1)",
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'round',
			pointBorderColor: "rgba(75,192,192,1)",
			pointBackgroundColor: "#fff",
			pointBorderWidth: 0,
			pointHoverRadius: 0,
			pointHoverBackgroundColor: "rgba(75,192,192,1)",
			pointHoverBorderColor: "rgba(220,220,220,1)",
			pointHoverBorderWidth: 0,
			pointRadius: 0,
			pointHitRadius: 10,
			data: pubs1,
			spanGaps: true,
		}]
	};


	setTimeout(function () {
		if (typeof myLineChart != "undefined") {
			myLineChart.destroy();
		}
		myLineChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false,
					position: 'right'
				},
				scales: {


					xAxes: [{
						gridLines: {
							display: false
						},
						display: true,
						ticks: {
							autoSkip: true,
							maxTicksLimit: 12
						}
					}],
					yAxes: [{

						gridLines: {
							display: false
						},
						display: true,
						ticks: {
							autoSkip: true,
							maxTicksLimit: 5,
							max: 130
						},
						position: "right",
						scaleLabel: {
							display: true,
							labelString: ' Rychlost [km/h]',
							stacked: true

						}
					}]
				}
			}
		});
	}, 600);
}


