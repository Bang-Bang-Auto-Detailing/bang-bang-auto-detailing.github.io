(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const phone = form.querySelector('#contact-phone');
  const email = form.querySelector('#contact-email');

  // Keep an email-required fallback if JavaScript is unavailable. With this
  // enhancement, either contact method is sufficient; the name stays required.
  email.required = false;

  function validateContactMethod() {
    const hasContactMethod = phone.value.trim() || email.value.trim();
    phone.setCustomValidity(hasContactMethod ? '' :
      'Please enter your phone number or email address so we can reply.');
  }

  form.addEventListener('input', validateContactMethod);
  form.addEventListener('change', validateContactMethod);
  // Refresh before the browser checks validity, including autofilled values.
  form.addEventListener('click', validateContactMethod);
  form.addEventListener('submit', (event) => {
    validateContactMethod();
    if (!form.reportValidity()) event.preventDefault();
  });
  form.addEventListener('reset', () => queueMicrotask(validateContactMethod));
  window.addEventListener('pageshow', validateContactMethod);
  validateContactMethod();
})();
