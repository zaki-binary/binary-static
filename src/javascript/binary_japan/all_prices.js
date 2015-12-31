if(typeof is_japan === 'function'){
	JapanAllPrices = (function(){
		var $table;
		var $button;

		function init(){
			$table = $('<ul />',{id:"all_prices_table"});
			$button = $('<button />',{
				"text": 'Show'
			});
			$('#all_prices').append($button,$table);
			$button.click(function(){
				JapanAllPrices.showPrices();
			});	
		}

		function addRow(b1, b2){
			var id = b2 ? (b1 + '_' + b2) : b1; 
			var text = b2 ? (b1 + '-' + b2) : b1; 
			var $el = $('<li />',{'data-id':id}).append(
				$('<span />',{"class":'all_prices_name',text:text}),
				$('<span />',{"class":'all_prices_ask_top'}),
				$('<span />',{"class":'all_prices_bid_top'}),
				$('<span />',{"class":'all_prices_ask_bottom'}),
				$('<span />',{"class":'all_prices_bid_bottom'})
			);
			$table.append($el);
		}

		function cleanPrices(){
			$table.html('');
			$button.text('Show');
		}

		function showPrices(){
			cleanPrices();
			$button.text('Update prices');
			var barriers1 = Periods.barriers1();
			var barriers2 = Periods.barriers2();
			var proposals = [];

			var types = Contract.contractType()[Contract.form()];


			if(barriers2.length){
				for(var i=0; i<barriers2.length; i++){
					for(var j = 0; j < barriers1.length; j++){
						if(barriers1[j] > barriers2[i]){
							addRow(barriers2[i], barriers1[j]);
							for (var typeOfContract in types) {
							    if(types.hasOwnProperty(typeOfContract)) {
							    	var proposal = Price.proposal(typeOfContract);
							    	proposal['barrier2'] = barriers2[i];
							    	proposal['barrier'] = barriers1[j];
							    	proposal['subscribe'] = 0;
							    	if(typeof proposal["passthrough"] === 'undefined'){
							    		proposal["passthrough"] = {};
							    	}
							    	proposal["passthrough"]['form_id'] = 'japan_barriers';
							    	proposals.push(proposal);
							    }
							}
						}
					}
				}
			}
			else{
				for(var d=0; d<barriers1.length; d++){
					addRow(barriers1[d]);
					for (var typeOfContract2 in types) {
					    if(types.hasOwnProperty(typeOfContract2)) {
					    	var proposal2 = Price.proposal(typeOfContract2);
					    	proposal2['barrier'] = barriers1[d];
					    	if(typeof proposal2["passthrough"] === 'undefined'){
					    		proposal2["passthrough"] = {};
					    	}
					    	proposal2['subscribe'] = 0;
					    	proposal2["passthrough"]['form_id'] = 'japan_barriers';
					    	proposals.push(proposal2);
					    }
					}
				}
			}
			for(var s=0;s<proposals.length;s++){
				BinarySocket.send(proposals[s]);
			}
		}

		function processProposal(proposal){
			var $el;
			if(proposal.echo_req.barrier && proposal.echo_req.barrier2){
				$el = $table.find('li[data-id="'+proposal.echo_req.barrier2+'_'+proposal.echo_req.barrier+'"]');
			}
			else if(proposal.echo_req.barrier){
				$el = $table.find('li[data-id="'+proposal.echo_req.barrier+'"]');

			}
			if($el.length){
				var position = contractTypeDisplayMapping(proposal.echo_req.contract_type);
				console.log(proposal.proposal);
				$el.find('.all_prices_ask_'+position).text(proposal.proposal.ask_price);
				$el.find('.all_prices_bid_'+position).text(proposal.proposal.bid_price);
			}
		}

		return {
			init: init,
			showPrices: showPrices,
			process: processProposal
		};
	})();
	JapanAllPrices.init();
}