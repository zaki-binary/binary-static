var Validate = (function(){

  //give DOM element of error to display
  function displayErrorMessage(error){
    error.setAttribute('style', 'display:block');
  }

  //give DOM element or error to hide
  function hideErrorMessage(error){
    error.setAttribute('style', 'display:none');
    var errorMessage = $('.error-message-password');
    if (errorMessage){
      errorMessage.remove();
    }
  }

  function handleError(error, text){
    var par = document.createElement('p'),
        re = new RegExp(text),
        allText = '';
    par.className = 'error-message-password';
    var parClass = $('.' + par.className);
    if (parClass.length > 1) {
      for (i = 0; i < parClass.length; i++){
        allText = allText + parClass[i].textContent;
      }
      if (!re.test(allText)){
        par.innerHTML = par.innerHTML + ' ' + text;
      }
    } else {
      par.innerHTML = text;
    }
    error.appendChild(par);
    displayErrorMessage(error);
  }

  //check validity of email
  function validateEmail(mail) {
    if (/^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return true;
    }
    return false;
  }

  //give error message for invalid email, needs DOM element of error and value of email
  function errorMessageEmail(email, error) {
    if (email === "") {
      error.textContent = Content.errorMessage('req');
      displayErrorMessage(error);
      return true;
    } else if (!validateEmail(email)) {
      error.textContent = Content.errorMessage('valid', Content.localize().textEmailAddress);
      displayErrorMessage(error);
      return true;
    }
    hideErrorMessage(error);
    return false;
  }

  //give error message for invalid password, needs value of password, repeat of password, and DOM element of error
  function errorMessagePassword(password, rPassword, error, rError) {
    hideErrorMessage(error);
    hideErrorMessage(rError);
    var errorCounter = 0;
    if (!/^.+$/.test(password)) {
      handleError(error, Content.errorMessage('req'));
      if (!/^.+$/.test(rPassword)) {
        rError.textContent = Content.errorMessage('req');
        displayErrorMessage(rError);
      }
      errorCounter++;
    }
    if (password !== rPassword) {
      rError.textContent = Content.localize().textPasswordsNotMatching;
      displayErrorMessage(rError);
      errorCounter++;
    }
    if (!/^[ -~]+$/.test(password)) {
      handleError(error, Content.errorMessage('valid', Content.localize().textPassword));
      errorCounter++;
    }
    if (password.length < 6) {
      handleError(error, Content.errorMessage('min', 6));
      errorCounter++;
    }
    if (testPassword(password)[0] < 30) {
      var tooltipPassword = document.getElementById('tooltip-password');
      tooltipPassword.innerHTML = testPassword(password)[1];
      tooltipPassword.setAttribute('title', text.localize('Try adding 3 or more numbers and 2 or more special characters.'));
      displayErrorMessage(error);
      errorCounter++;
    }
    if (errorCounter === 0){
      return true;
    }
    return false;
  }

  return {
    displayErrorMessage: displayErrorMessage,
    hideErrorMessage: hideErrorMessage,
    errorMessageEmail: errorMessageEmail,
    errorMessagePassword: errorMessagePassword
  };
}());
