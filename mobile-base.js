// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var init = function (onSelectFeatureFunction) {

       var vector = new OpenLayers.Layer.Vector("現在地", {});

       var flood_yamatogawa = new OpenLayers.Layer.TMS( "大和川外水氾濫", "./maps/yamatogawa_od/",
       //var flood_yamatogawa = new OpenLayers.Layer.TMS( "大和川外水氾濫", "../osaka/maps/flood_yamatogawa/",
                {    url: '', serviceVersion: '.', layername: '.',
                        type: 'png',  alpha: true,
                        isBaseLayer: false,visibility: false, opacity:0.7, op:"flood_yamatogawa", legend:"flood_yamatogawa.png"
                });

       var style_tmp = new OpenLayers.StyleMap({
                pointRadius: 12,
                externalGraphic: "./img/tmp.png"
        });

        var tmp = new OpenLayers.Layer.Vector("一時避難所", {styleMap: style_tmp,
                    strategies: [new OpenLayers.Strategy.Fixed()],
                        protocol: new OpenLayers.Protocol.HTTP({
                        url: "./kml/tmp.kml",
                        format: new OpenLayers.Format.KML({
                        extractStyles: false,
                        extractAttributes: false,
                        maxDepth: 2,
                        internalProjection: sm,
                        externalProjection: gg
                        })
                        }),isBaseLayer: false,visibility: true,icon:"tmp.png"
        });

        var style_evacu = new OpenLayers.StyleMap({
                pointRadius: 12,
                externalGraphic: "./img/refugee.png"
        });

        var evacu = new OpenLayers.Layer.Vector("収容避難所", {styleMap: style_evacu,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                        url: "./kml/refugee.kml",
                        format: new OpenLayers.Format.KML({
                        extractStyles: false,
                        extractAttributes: false,
                        maxDepth: 2,
                        internalProjection: sm,
                        externalProjection: gg
                        })
                }),isBaseLayer: false,visibility: true,icon:"refugee.png"
        });


        var style_suisou = new OpenLayers.StyleMap({
                pointRadius: 8,
                externalGraphic: "./img/suisou.png"
        });

        var suisou = new OpenLayers.Layer.Vector("防火水槽・プール", {styleMap: style_suisou,
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                    url: "./kml/suisou.kml",
                    format: new OpenLayers.Format.KML({
                    extractStyles: false,
                    extractAttributes: false,
                    maxDepth: 2,
                    internalProjection: sm,
                    externalProjection: gg
                    })
                }),isBaseLayer: false,visibility: false,icon:"suisou.png"
        });



    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });



    var mapBounds = new OpenLayers.Bounds( 135.398469678, 34.5782937555, 135.520921157, 34.6564166624);
    var mapMinZoom = 8;
    var mapMaxZoom = 18;

    var mapDisplayArea = new OpenLayers.Bounds(135.49129, 34.58562, 135.52120, 34.60960);

 			// avoid pink tiles
                        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
                        OpenLayers.Util.onImageLoadErrorColor = "transparent";


    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
	displayProjection: gg,
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate
            //selectControl
        ],
        layers: [
            new OpenLayers.Layer.OSM("オープンストリートマップ", null, {
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Road",
                // custom metadata parameter to request the new map style - only useful
                // before May 1st, 2011
                metadataParams: {
                    mapVersion: "v1"
                },
                name: "Bing道路地図",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "Aerial",
                name: "Bing衛星画像",
                transitionEffect: 'resize'
            }),
            new OpenLayers.Layer.Bing({
                key: apiKey,
                type: "AerialWithLabels",
                name: "Bing衛星画像+ラベル",
                transitionEffect: 'resize'
            }),
	    new OpenLayers.Layer.XYZ("地理院地図(標準地図)", //XYZ形式（緯度、軽度、ズームレベル　レイヤ名を指定
		"http://cyberjapandata.gsi.go.jp/xyz/std/${z}/${x}/${y}.png", {　//地理院地図のタイルを指定
		attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>", //地理院地図の著作権表示
		maxZoomLevel: 19 //省略すると15になったので指定する
	    }),
	    new OpenLayers.Layer.XYZ("地理院地図(オルソ画像)", 
  		"http://cyberjapandata.gsi.go.jp/xyz/ort/${z}/${x}/${y}.jpg", {
    		attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",
    		maxZoomLevel: 18
	    }),
	    new OpenLayers.Layer.XYZ("地理院地図(土地利用2008)",
		"http://cyberjapandata.gsi.go.jp/xyz/lum4bl_kinki2008/${z}/${x}/${y}.png", {　
    		attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'>国土地理院</a>",
                maxZoomLevel: 16 
            }),
            vector,
	    flood_yamatogawa,
	    tmp, 
	    evacu, 
	    suisou

        ],
        center: new OpenLayers.LonLat(0, 0),
        zoom: 1
    });

//map.zoomToExtent( mapBounds.transform(map.displayProjection, map.projection ) );
map.zoomToExtent( mapDisplayArea.transform(map.displayProjection, map.projection ) );


    var style = {
        pointRadius: 22,
	fillOpacity: 0.6,
        fillColor: '#ffaaaa',
        strokeColor: '#ff0000',
        strokeOpacity: 1
    };
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 0,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });



};
