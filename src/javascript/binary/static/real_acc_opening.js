pjax_config_page("realws", function(){
	
	return {
		onLoad: function() {
			Content.populate();
			RealAccOpeningUI.setLabel();
			setTitles('title');
			generateBirthDate('dobdd', 'dobmm', 'dobyy');
		}
	}
});