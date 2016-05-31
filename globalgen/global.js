/**
 * Created by canals on 02/02/2016.
 */


var fs = require('fs');

var global = (function () {

    var loadedConfig ;
    var options ;


    var loadConfig = function (file) {
                var data = fs.readFileSync(file);
                try {
                    loadedConfig = JSON.parse(data);
                }
                catch (err) {
                    console.log('error parsing config file : '+file);
                    console.log(err);
                }
            };
    var getDomaine = function(d) {
                return loadedConfig.domaine[d];
             };

    var getCible = function(c) {
        return loadedConfig.cible[c];
    };
    var getEsprit = function(e) {
                return loadedConfig.esprit[e];
            };
    var getSvgDir = function() {
                return loadedConfig.svgdir ;
            };
    var getWidth = function() {
                return loadedConfig.width;
            };
    var getHeight = function() {
                return loadedConfig.height;
            };


     return  {
            init : function ( file, opt ) {

                loadConfig(file);
                options= {
                    output : 'output',
                    texte : 'yo man',
                    domaine : getDomaine('defaut'),
                    cible : getCible('defaut'),
                    esprit : getEsprit('defaut'),
                    config : 'config.json'

                };
                if (opt.output != undefined) options.output= opt.output;
                if (opt.texte != undefined) options.texte= opt.texte;
                if (opt.domaine != undefined) {
                    var d = getDomaine(opt.domaine);
                    if (d === undefined) throw 'valeur pour domaine ('+opt.domaine+') non reconnue';
                    options.domaine = d;
                }
                if (opt.cible != undefined) {
                    var c = getCible(opt.cible);
                    if (c === undefined) throw 'valeur pour cible ('+opt.cible+') non reconnue';
                    options.cible = c;
                }
                if (opt.esprit != undefined) {
                    var e = getEsprit(opt.esprit);
                    if (e === undefined) throw 'valeur pour esprit ('+opt.esprit+') non reconnue';
                    options.esprit= e;
                }


            },
            do : function () {
                var x=getWidth() / 2;
                var y=getHeight() / 2;
                var text='<text id="text" x="'+x+'" y="'+y+'" text-anchor="middle" style="font-size:40;font-family:'
                        +options.esprit+';fill:'+options.cible.typo+'">'+options.texte+'</text>\n';
                var bandofile = getSvgDir()+'/'+options.esprit ;
                var bando = fs.readFileSync(bandofile, 'utf8')
                    .match(/<g id="bando">([^]*)<\/g>[^]*<\/g>/g)[0]
                    .replace(/fill:#ffffff/g, 'fill:'+options.cible.bando)
                    .replace(/fill:#000000/g, 'fill:'+options.cible.typo)
                    .replace(/stroke:#[abcdef\d]+/g, 'stroke:'+options.cible.typo)
                    .replace(/@@@@@@/, options.texte)
                    .replace(/style="font-weight/, 'style= \"fill:'+options.cible.typo
                                                                        +';font-weight');



                //console.log(bandofile);
                //console.log(bando);
                console.log(bando);


                var svg = fs.readFileSync(getSvgDir()+'/'+options.domaine, 'utf8')
                            .replace(/fill:#[abcdef\d]+/g , 'fill:' + options.cible.picto)
                            .replace(/<\/g>[^]*<\/g>/g, '</g>\n' +bando);

                fs.writeFile(options.output + '.svg', svg, function (err) {
                        if (err) {
                        console.log('error writing output file :');
                        console.log(err.message);
                        }
                });

            }



    }

}) ();


exports.global = global ;

