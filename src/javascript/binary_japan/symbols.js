if(typeof is_japan === 'function'){
	Symbols._details = Symbols.details.bind({});

	Object.defineProperties(Symbols,{
		details:{
			value:function(data){
				var active_symbols = [];

				data.active_symbols.forEach(function(symbol){
					if(symbol.market==='forex' && symbol.submarket==='major_pairs'){
						active_symbols.push(symbol);
					}
				});

				data.active_symbols = active_symbols;
				return Symbols._details(data);
			}
		}
	});
}