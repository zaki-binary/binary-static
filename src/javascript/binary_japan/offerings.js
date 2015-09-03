if(typeof JAPAN === 'function'){
	var Offerings = Object.create(Offerings);
	Object.defineProperties(Offerings,{
		contractForms:{
			value:function(){
				parent = Object.getPrototypeOf(this);
				var forms = parent.contractForms();
				delete forms['risefall']
				return forms
			}
		},
		getOfferings: {
			value:function(underlying){
				var params = { 
					offerings: 1,
					market: 'Forex',
					submarket: 'Major Pairs',
					start_type: 'spot'
		    	}
				TradeSocket.send(params);
			}
		}
	})
}