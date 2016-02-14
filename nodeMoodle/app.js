try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('./lib/spooky');
}
var cursosValue = [];
var tareasValue = [];
var estadoEntrega = "";
var estadoCalificacion = "";
var fechaEntrega = "";
var nota = "";
var titulo = "";

var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: false
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

    spooky.start('http://moodle.iesmontilivi.net/login/', function () {
        this.fill('form[id="login"]', {
            'username': 'y1071248z',
            'password': 'bq9255'
        }, true);
        this.waitForSelector("#frontpage-course-list", function () {
            console.log('estoy Dentro');
            this.capture('dentro.png');
            cursosValue = this.evaluate(function () {
                var anosValues = document.querySelectorAll('#frontpage-course-list > div > div > div.info > h3 > a');
                return Array.prototype.map.call(anosValues, function (e) {
                    return e.getAttribute('href');
                })
            });
            for (var i = 0; i < cursosValue.length; i++) {
                //console.log("Numero de Links: " + cursosValue[i]);
                this.thenOpen((cursosValue[i]), function () {
                    console.log(this.getTitle()); // display the title of page
                    tareasValue= this.evaluate(function() {
                        var anosValues = document.querySelectorAll('.activityinstance a');
                        return Array.prototype.map.call(anosValues, function (e) {
                            return e.getAttribute('href');
                        })
                    })
                    for (var j = 0; j < tareasValue.length; j++) {
                        var url = tareasValue[j];
                        if (url.indexOf('assign') > -1) {
                            this.thenOpen((url), function () {
                                //this.capture("algo.png");
                                console.log(this.getCurrentUrl()); // display the title of page 
                                titulo= this.evaluate(function () {
                                    var titulo = document.querySelector('#region-main > div > div > h2').innerText;
                                    return titulo;
                                });
                                estadoEntrega = this.evaluate(function() {
                                    var estadoEntrega = document.querySelector('tr:nth-child(1) > td.submissionstatussubmitted.cell.c1.lastcol').innerText;
                                    return estadoEntrega;
                                });

                                estadoCalificacion = this.evaluate(function() {
                                    var estadoCalificacion = document.querySelector('tr:nth-child(2) > td.submissionnotgraded.cell.c1.lastcol').innerText;
                                    return estadoCalificacion;
                                });

                                nota = this.evaluate(function() {
                                    var nota = document.querySelector('#region-main > div > div > div.feedback > div > table > tbody > tr:nth-child(1) > td.cell.c1.lastcol').innerText;
                                    return nota;
                                });
                                fechaEntrega = this.evaluate(function() {
                                    var fechaEntrega = document.querySelector('tr:nth-child(3) > td.cell.c1.lastcol').innerText;
                                    return fechaEntrega;
                                });
                                console.log(titulo);
                                if (estadoEntrega == null) estadoEntrega = 'No entregado';
                                console.log("Estado de la entrega: " + estadoEntrega);
                                if (estadoCalificacion == null) estadoCalificacion = "Calificado";
                                console.log("Estado de la Calificacion: " + estadoCalificacion);
                                console.log("Fecha Entrega " + fechaEntrega);
                                if (nota == null) nota = "no tiene nota";
                                console.log(nota);
                            });
                        
                        }

                    };
                });

            };
        });
      });
        spooky.run();
    });

    
spooky.on('console', function (line) {
    console.log(line);
});