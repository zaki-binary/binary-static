pjax_config_page("new_account/realws", function(){
	
	return {
		onLoad: function() {
			Content.populate();
			var error = document.getElementById('client_message');
			error.setAttribute('style', 'display:none');

			if ($.cookie('residence')) {
				setResidence('residence');
				RealAccOpeningUI.setLabel();
				setTitles('title');

				var dobdd = document.getElementById('dobdd'),
				    dobmm = document.getElementById('dobmm'),
				    dobyy = document.getElementById('dobyy');

				RealAccOpeningUI.setValues(dobdd, dobmm, dobyy);

				var errorBirthdate = document.getElementById('error-birthdate');

				$('#real-form').submit(function(evt) {
					evt.preventDefault();

					if ($.cookie('residence')) {
						if(!isValidDate(dobdd.value, dobmm.value, dobyy.value)) {	
							errorBirthdate.innerHTML = Content.localize().textErrorBirthdate;
							errorBirthdate.setAttribute('style', 'display:block');
						} else {
							errorBirthdate.setAttribute('style', 'display:none');
						}
					} else {
						RealAccOpeningUI.showError(error);
					}
				});
			} else {
				RealAccOpeningUI.showError(error);
			}
		}
	}
});