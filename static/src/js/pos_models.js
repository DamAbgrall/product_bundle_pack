odoo.define('product_bundle_pack.pos.models.name', function (require) {
"use strict";

var models = require('point_of_sale.models');
var utils = require('web.utils');
// var formats = require('web.formats');
var round_di = utils.round_decimals;
var round_pr = utils.round_precision;

// Extending order line
var _super_orderline = models.Orderline.prototype;
models.Orderline = models.Orderline.extend({
    initialize: function(attr, options) {
        _super_orderline.initialize.call(this, attr, options);
		this.pack=[];
		this.get_pack();
    },
	
	get_pack:function(){
		console.log(this);
		console.log(window.location.origin)
		var params = {
			"args":[],
			"kwargs":{
				"context":{"lang":"fr_FR","tz":false,"uid":1},
				"domain":[["id","=",this.product.product_tmpl_id]],
				"fields":["is_pack","pack_ids"],
			},
			"method":"search_read",
			"model":"product.template"
		};

		var url = window.location.origin+"/web/dataset/call_kw/";
		var thise = this;
		var oldPos = this.pos._previousAttributes;
		oldPos.rpc(url+"product.template/search_read",params).then(
			function(val) {
				console.log("promise1");
				console.log(val)
				if(val[0].is_pack == true){
					for(var i = 0;i< val[0].pack_ids.length;i++){
						console.log("boucle")
						var params2 = {
							"args":[],
							"kwargs":{
								"context":{"lang":"fr_FR","tz":false,"uid":1},
								"domain":[["id","=",val[0].pack_ids[i]]],
								"fields":["product_id"],
							},
							"method":"search_read",
							"model":"product.pack"
						};
						oldPos.rpc(url+"product.pack/search_read",params2).then(function(pack){
							console.log("promise2");
							console.log("pack")
							console.log(pack)
							thise.pack.push(pack[0].product_id[1]);
							console.log(thise.pack)
						});
					}
				}


			});
	},
	
});
});

