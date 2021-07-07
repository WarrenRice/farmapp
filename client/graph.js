chartIt();

async function chartIt(){
    const ctx1 = document.getElementById('myChart1').getContext('2d');
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const ctx3 = document.getElementById('myChart3').getContext('2d');
    const ctx4 = document.getElementById('myChart4').getContext('2d');
    const ctx5 = document.getElementById('myChart5').getContext('2d');

    const data = await  getDataAPI();

    myChart1 = new Chart(ctx1, {
        
        type: 'line',

        data: {
            labels: data.xs,
            datasets: [{
                label: 'Temperature',
                data: data.ys1,
                fill: 0,
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1,
            }],
        },

        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toFixed(2) + '\u00B0C';
                        }
                    }
                }
            }
        }
    });

    const myChart2 = new Chart(ctx2, {
        
        type: 'line',

        data: {
            labels: data.xs,
            datasets: [{
                label: 'Humidity',
                data: data.ys2,
                fill: 0,
                backgroundColor: ['rgba(99, 255, 132, 0.2)'],
                borderColor: ['rgba(9, 255, 132, 1)'],
                borderWidth: 1,
            }],
        },

        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });

    const myChart3 = new Chart(ctx3, {
        
        type: 'line',

        data: {
            labels: data.xs,
            datasets: [{
                label: 'Light',
                data: data.ys3,
                fill: 0,
                backgroundColor: ['rgba(99, 99, 255, 0.2)'],
                borderColor: ['rgba(99,99, 255, 1)'],
                borderWidth: 1,
            }],
        },

        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toFixed(2) + 'lx';
                        }
                    }
                }
            }
        }
    });

    const myChart4 = new Chart(ctx4, {
        
        type: 'line',

        data: {
            labels: data.xs,
            datasets: [{
                label: 'Moisture',
                data: data.ys4,
                fill: 0,
                backgroundColor: ['rgba(99, 99, 99, 0.2)'],
                borderColor: ['rgba(99, 99, 99, 1)'],
                borderWidth: 1,
            }],
        },

        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value.toFixed(2);
                        }
                    }
                }
            }
        }
    });

    myChart5 = new Chart(ctx5, {
        
        type: 'line',

        data: {
            labels: data.xs,
            datasets: [{
                label: 'Pressure',
                data: data.ys5,
                fill: 0,
                backgroundColor: ['rgba(142, 68, 173, 0.2)'],
                borderColor: ['rgba(142, 68, 173, 1)'],
                borderWidth: 1,
            }],
        },

        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return value+'Pa';
                        }
                    }
                }
            }
        }
    });
};


function timeConverter(UNIX_timestamp){
    const a = new Date(UNIX_timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

async function getDataAPI() {
    const xs = [];
    const ys1 = [], ys2 = [], ys3 = [], ys4 = [], ys5 = [];

    const resp = await fetch('/api');
    const gdata = await resp.json();

    for (i=0;i<gdata.length;i++ ){

        xs.push(timeConverter(gdata[i].timestamp))
        ys1.push(gdata[i].temperature)
        ys2.push(gdata[i].humidity)
        ys3.push(gdata[i].light)
        ys4.push(gdata[i].water)
        ys5.push(gdata[i].pressure)
        
    }

    return {xs, ys1, ys2, ys3, ys4, ys5}
}
