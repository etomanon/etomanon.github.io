var data = {
    "value": [1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015],
    "count": [3.734135851,3.455980682,3.792388545,4.249211203,3.317386205,3.166391341,2.965976035,2.712197204,2.594460773,2.620296441,2.797129456,2.796982749,2.607484732,2.50731113,2.467583236,2.334169913,2.150007566,2.028296565,1.998862624,2.003478085,1.977071605,2.090557829,1.949930449,1.888399817,1.954439128,2.001184106,2.102175753,2.11094535]

}

lab = []
pubs = []
ctx = $("#cart");

for (var p = 0; p < data.value.length; p++) {

    var fet = data.value[p]

        lab.push(fet)
        var fets = data.count[p]
        pubs.push(fets)

}

function createChart(legen){

datas = {
	                        labels: lab,
	                        datasets: [{
	                            label: legen,
	                            fill: true,
	                            lineTension: 0,
	                            backgroundColor: "rgba(45, 160, 226,0.4)",
	                            borderColor: "rgba(45, 160, 226,1)",
	                            borderCapStyle: 'butt',
	                            borderDash: [],
	                            borderDashOffset: 0.0,
	                            borderJoinStyle: 'round',
	                            pointBorderColor: "rgba(75,192,192,1)",
	                            pointBackgroundColor: "#fff",
	                            pointBorderWidth: 0,
	                            pointHoverRadius: 5,
	                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
	                            pointHoverBorderColor: "rgba(220,220,220,1)",
	                            pointHoverBorderWidth: 0,
	                            pointRadius: 5,
	                            pointHitRadius: 15,
	                            data: pubs,
	                            spanGaps: true,
	                        }]
	                    };
						
						myLineChart = new Chart(ctx, {
	                        type: 'line',
	                        data: datas,
	                        options: {
	                            responsive: true,
	                            maintainAspectRatio: false,
	                            legend: {
	                                display: false
	                            },
	                            scales: {


	                                xAxes: [{
	                                    display: true,
										ticks: {
											autoSkip:true,
											maxTicksLimit:10
										}
	                                }],
	                                yAxes: [{
	                                    display: false,
	                                    position: "right",
	                                    scaleLabel: {
	                                        display: true,
	                                        labelString: 'Mean [%]'
	                                    }
	                                }]
	                            }
	                        }
	                    });
						
						
	
						
						
		
};
createChart("World mean [%]");