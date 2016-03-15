var got = {};

got.customLeaflet = {
    crs: L.Util.extend({}, L.CRS, {
        projection: L.Projection.LonLat,
        transformation: new L.Transformation(1, 0, 1, 0)
    })
};

L.Map = L.Map.extend({
    // Rounding removed
    latLngToLayerPoint: function(latLng) {
        var projectedPoint = this.project(L.latLng(latLng));

        return projectedPoint._subtract(this.getPixelOrigin());
    },

    _getBoundsOffset: function (pxBounds, maxBounds, zoom) {
        var swOffset = this.project(maxBounds.getSouthWest(), zoom).subtract(pxBounds.min),
            neOffset = this.project(maxBounds.getNorthEast(), zoom).subtract(pxBounds.max),

            dx = this._rebound(swOffset.x, - neOffset.x),
            dy = this._rebound(swOffset.y, - neOffset.y);

        return L.point(dx, dy);
    }
});

L.Circle = L.Circle.extend({
    _getLatRadius: function() {
        return this._mRadius;
    },
    _getLngRadius: function () {
        return this._mRadius;
    }
});

got.Map = function(settings) {
    var that = this;
    this.tileLayer = L.tileLayer(
        '',
        {
            noWrap: true,
            updateWhenIdle: false
        }
    );

    this.map = new L.map(
        'leaflet-map',
        {
            crs: got.customLeaflet.crs,
            center: [0, 0],
            attributionControl: false,
            inertia: false,
            zoom: 0,
            maxZoom: 5

        }
    );

    this.pointToLatLng = function(x, y) {
        var point = L.point(x, y);

        return this.map.unproject(point,  0);
    };

    this.map.addLayer(this.tileLayer);

    var bounds = L.latLngBounds(
        this.pointToLatLng(0, 0),
        this.pointToLatLng(500, 500)
    );

    var bounds2 = L.latLngBounds(
        this.pointToLatLng(0, 0),
        this.pointToLatLng(10, 10)
    );

    var border = L.rectangle(bounds);
    var rect = L.rectangle(bounds2);

    rect.addTo(this.map);

    border.addTo(this.map);

    var test = L.circle(
        that.pointToLatLng(0, 0),
        5,
        {
            fillColor: 'red'
        }
    );

    var test2 = L.circle(
        that.pointToLatLng(10, 1),
        1,
        {
            fillColor: 'red'
        }
    );

    test.addTo(this.map);
    test2.addTo(this.map);
};

$(function() {
    new got.Map({});
});
