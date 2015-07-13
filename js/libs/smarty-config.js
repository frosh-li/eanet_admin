(function() {
"use strict";

var app = angular.module("angular-smarty-config", []);

app.service("smartyConfig", ["$http", "$filter", function($http, $filter) {
    /* The default getSmartySuggestions function makes a request to requestUrl with the given
     * requestParams and expects an array of JSON objects in return, e.g. [{Name: suggestion1},
     * {Name: suggestion2}]
     */
    var requestUrl = "/api/items/suggest",
        requestParams = {};
    var func = null;

    /* getSmartySuggestions should return a promise.  See the demo for an example of how to
     * construct an Angular promise.
     */
    function getSmartySuggestions(prefix) {
        requestParams["query"] = escape(prefix.toLowerCase());
        var promise = $http.get(requestUrl,
            {
                params: requestParams,
                cache: true
            }
        )
        .then(function(response) {
            /* response.data is an the array of JSON objects where Name is the key used to identify
             * a suggestion
             */
             //console.log(response.data.data);
             return $filter("limitTo")(response.data.data, 10).map(function(item) {
                if(item.good_id){

                    return item.good_id+"|"+item.good_name+"|"+item.good_cp+"|"+item.good_gg;
                }else{
                    return item.id + "|" +item.name;
                }
             });
        });
        return promise;
    }

    return {
        getSmartySuggestions: getSmartySuggestions,
        setConfig: function(option){
            if(option.requestUrl){
                requestUrl = option.requestUrl;
            }
            if(option.params){
                requestParams = option.params;
            }
            if(option.func){
                func = func;
            }
        }
    }
}]);

app.service("smartySuggestor", ["smartyConfig", function(smartyConfig) {
    var getSmartySuggestions = smartyConfig.getSmartySuggestions;

    return {
        getSmartySuggestions: getSmartySuggestions,
        setConfig : smartyConfig.setConfig
    };
}]);

})();
