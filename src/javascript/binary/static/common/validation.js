var Validate = (function(){

  //give DOM element of error to display
  function displayErrorMessage(error){
    error.setAttribute('style', 'display:block');
  }

  //give DOM element or error to hide
  function hideErrorMessage(error){
    error.setAttribute('style', 'display:none');
    var errorMessage = $('#error-message-password');
    if (errorMessage){
      errorMessage.remove();
    }
  }

  function handleError(error, text){
    var span = document.createElement('span');
    span.id = 'error-message-password';
    span.innerHTML = text;
    error.appendChild(span);
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
        handleError(rError, Content.errorMessage('req'));
      }
      errorCounter++;
    }
    if (password !== rPassword) {
      handleError(rError, Content.localize().textPasswordsNotMatching);
      errorCounter++;
    }
    if (!/^[ -~]+$/.test(password)) {
      handleError(error, Content.errorMessage('valid', Content.localize().textPassword));
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
