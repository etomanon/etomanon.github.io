var data = {
    "value": [25, 28, 29, 31, 34, 36, 37, 38, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 223],
    "count": [1, 1, 3, 2, 1, 1, 2, 1, 2, 1, 3, 2, 4, 1, 6, 5, 3, 18, 26, 49, 67, 65, 73, 76, 66, 42, 52, 73, 80, 84, 133, 131, 129, 153, 154, 184, 189, 170, 174, 186, 191, 211, 203, 210, 250, 262, 274, 309, 255, 313, 279, 310, 317, 347, 344, 381, 371, 393, 456, 407, 441, 475, 552, 615, 718, 759, 880, 952, 1005, 1192, 1344, 1478, 1649, 1830, 1892, 2183, 2368, 2559, 2843, 3086, 3486, 3975, 4461, 4992, 5902, 7098, 8258, 9839, 11250, 13340, 15124, 16896, 18929, 19394, 22431, 21317, 21011, 20089, 18801, 16769, 14782, 13303, 11997, 10859, 9923, 8800, 7905, 7075, 6587, 6155, 5345, 4932, 4652, 4321, 4134, 3800, 3466, 3348, 3095, 2777, 2747, 2456, 2315, 2125, 2028, 1878, 1821, 1584, 1529, 1455, 1452, 1325, 1306, 1219, 1211, 1092, 1076, 969, 971, 918, 840, 791, 726, 731, 674, 656, 599, 582, 534, 480, 440, 362, 360, 290, 263, 215, 197, 182, 162, 128, 126, 113, 122, 83, 94, 88, 84, 76, 67, 62, 53, 50, 65, 53, 55, 43, 33, 17, 17, 14, 8, 17, 8, 8, 6, 1, 1, 1]
}

lab = []
pubs = []

var mina = 119
var maxa = 145

for (var p = 0; p < data.value.length; p++) {

    var fet = data.value[p]
    if (fet <= mina) {
        lab.push(fet)
        var fets = data.count[p]
        pubs.push(fets)
    }
}

lab1 = []
pubs1 = []

for (var p = 0; p < data.value.length; p++) {

    var fet1 = data.value[p]
    if (fet1 >= maxa) {
        lab1.push(fet1)
        var fets1 = data.count[p]
        pubs1.push(fets1)
    }
}

var decrease = 0
var increase = 0
var stable = 0


for (var p = 0; p < data.value.length; p++) {

    var fet2 = data.value[p]
    if (fet2 >= maxa) {
        var fets1 = data.count[p]
        increase += fets1
    }
    if (fet2 <= mina) {
        var fets1 = data.count[p]
        decrease += fets1
    }
    if (fet2 > mina && fet2 < maxa) {
        var fets1 = data.count[p]
        stable += fets1
    }
}

var total = decrease + stable + increase
decrease = Math.round(decrease / (total / 100))
increase = Math.round(increase / (total / 100))
stable = Math.round(stable / (total / 100))

ctx = $("#cart");
cte = $("#cart1");
cto = $("#cart2");

data = {
    labels: lab,
    datasets: [{
        label: "Pixel count",
        fill: true,
        lineTension: 0,
        backgroundColor: "rgba(254,30,30,.4)",
        borderColor: "rgba(254,30,30,1)",
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
        pointHitRadius: 5,
        data: pubs,
        spanGaps: true,
    }]
};

myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {


            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false,
                position: "right",
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }
            }]
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItems, data) {
                    return 'Pixel value: ' + tooltipItems[0].xLabel;
                }
            }
        },
    }
});




data1 = {
    labels: lab1,
    datasets: [{
        label: "Pixel count",
        fill: true,
        lineTension: 0,
        backgroundColor: "rgba(45, 160, 226,.4)",
        borderColor: "rgba(45, 160, 226 ,1)",
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
        pointHitRadius: 5,
        data: pubs1,
        spanGaps: true,
    }]
};

myLineChart = new Chart(cte, {
    type: 'line',
    data: data1,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        scales: {


            xAxes: [{
                display: false
            }],
            yAxes: [{
                display: false,
                position: "right",
                scaleLabel: {
                    display: true,
                    labelString: 'value'
                }
            }]
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItems, data) {
                    return 'Pixel value: ' + tooltipItems[0].xLabel;
                }
            }
        },
    }
});



var data2 = {
    labels: [
        "Decrease",
        "Increase",
        "Stable",
    ],
    datasets: [{
        data: [decrease, increase, stable],
        backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
        ],
        hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
        ]
    }]
};

var myDoughnutChart = new Chart(cto, {
    type: 'doughnut',
    data: data2,
    animation: {
        animateScale: true
    },
    options: {
        legend: {
            display: false
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    return data.labels[tooltipItem.index] + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + ' %';
                }
            },
        }
    }
});