var TradePage = (function(){
	
	var trading_page = 0;

	var onLoad = function(){
		trading_page = 1;
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
		}		
		BinarySocket.init({
			onmessage: function(msg){
				Message.process(msg);
			},
			onclose: function(){
				processMarketUnderlying();
			}
		});
		Price.clearFormId();
		TradingEvents.init();
		Content.populate();
		
		if(sessionStorage.getItem('currencies')){
			displayCurrencies();
			Symbols.getSymbols(1);
		}
		else {
			BinarySocket.send({ payout_currencies: 1 });
		}
		
		if (document.getElementById('websocket_form')) {
		    addEventListenerForm();
		}

		// Introduction Tour
		if($.cookie('hide_guide') === 'true'){
			$('#introBtn').remove();
			return;
		}

		var btnNext = {className: "button", html: '<span>' + text.localize('Next') + '</span>'};
		var enjoyhint_script_data = [
			{
				selector	: '#contract_markets',
				event_type  : 'next',
				description : '<h1>Step 1</h1>Select your market',
          		nextButton  : btnNext,
				showSkip    : false
			},
			{
				selector	: '#underlying',
				event_type  : 'next',
				description : '<h1>Step 2</h1>Select your underlying asset',
          		nextButton  : btnNext,
				showSkip    : false
			},
			{
				selector    : '#contract_form_name_nav',
				event_type  : 'next',
				description : '<h1>Step 3</h1>Select your trade type',
          		nextButton  : btnNext,
				showSkip    : false
			},
			{
				selector    : '#websocket_form',
				event_type  : 'next',
				description : '<h1>Step 4</h1>Adjust trade parameters',
          		nextButton  : btnNext,
				showSkip    : false
			},
			{
				selector    : '#contracts_list',
				event_type  : 'next',
				description : '<h1>Step 5</h1>Predict the direction<br />and purchase',
				nextButton  : {className: "button btnFinish", html: '<span>' + text.localize('Finish') + '</span>'},
				showSkip    : false
			}
		];

		$('#introBtn a').click(function(){
			var enjoyhint_instance = null;
			enjoyhint_instance = new EnjoyHint({});
			enjoyhint_instance.setScript(enjoyhint_script_data);
			enjoyhint_instance.runScript();
		});
		// Close button
		$('#introBtn span').click(function(){
			$.cookie('hide_guide', 'true');
			$('#introBtn').remove();
		});
		// Blink
		var blinkClass = 'highlight',
			inDelay    = 200,
			outDelay   = 200,
			times      = 5;
		var blink = function(){
			$('#introBtn').addClass(blinkClass).delay(inDelay).queue(function(){
				$(this).removeClass(blinkClass).delay(outDelay).dequeue();
			});
		}
		$(document).ready(function(){
			var i = setInterval(blink, (inDelay + outDelay));
			setTimeout(function(){ clearInterval(i); }, (inDelay + outDelay) * times);
		});
	};

	var onUnload = function(){
		trading_page = 0;
		forgetTradingStreams();
		BinarySocket.clear();
	};

	return {
		onLoad: onLoad,
		onUnload : onUnload,
		is_trading_page: function(){return trading_page;}
	};
})();