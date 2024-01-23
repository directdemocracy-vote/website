window.addEventListener("load", function() {
  let checkout = null;
  let step = 1;
  let frequency = 'one-time';
  let amount = 5;
  const amounts = [5, 10, 20, 50, 100, 200, 500, 1000];
  let isOrganization = false;
  let display = false;
  document.getElementById('donate-button').addEventListener('click', async function(event) {
    if (!document.getElementById('donate-email').reportValidity())
      return;
    const button = event.currentTarget;
    button.classList.add('is-loading');
    const stripe = Stripe('pk_test_51ONAiHJ8bitZPVQT83mvU9hsFgAcXYctJa6wFynuQ7ZieWQHLeFmmdNlJMpECaIkVz87vBHnbBgW9q48qc9fdvcr00oudVLpYM');
    const currency = document.querySelectorAll('input[name="donation-currency"]:checked')[0].value;
    const response = await fetch(`/stripe/checkout.php?amount=${amount}&frequency=${frequency}&currency=${currency}`, {method: 'POST'});
    const {clientSecret, paymentId} = await response.json();
    const handleComplete = async function() {
      checkout.unmount();
      checkout.destroy();
      checkout = null;
      console.log('onComplete data for client ' + paymentId);
      // fetch client data from database
      document.getElementById('donate-checkout').classList.add('is-hidden');
      document.getElementById('donate-complete').classList.remove('is-hidden');
      document.getElementById('donate-2').textContent = 'circle';
      document.getElementById('donate-3').textContent = 'circle_fill';
      // const details = await retrievePurchaseDetails();
      // showPurchaseSummary(details);
    }
    checkout = await stripe.initEmbeddedCheckout({clientSecret, onComplete: handleComplete});
    document.getElementById('donate-explanation').classList.add('is-hidden');
    document.getElementById('donate-form').classList.add('is-hidden');
    document.getElementById('donate-checkout').classList.remove('is-hidden');
    document.getElementById('donate-back').classList.remove('is-hidden');
    document.getElementById('donate-1').textContent = 'circle';
    document.getElementById('donate-2').textContent = 'circle_fill';
    button.classList.remove('is-loading');
    checkout.mount('#donate-checkout');
    step = 2;
  });
  document.getElementById('donate-back').addEventListener('click', async function(event) {
    if (checkout) {
      checkout.unmount();
      checkout.destroy();
      checkout = null;
    }
    document.getElementById('donate-explanation').classList.remove('is-hidden');
    document.getElementById('donate-form').classList.remove('is-hidden');
    document.getElementById('donate-checkout').classList.add('is-hidden');
    document.getElementById('donate-back').classList.add('is-hidden');
    document.getElementById('donate-1').textContent = 'circle_fill';
    document.getElementById('donate-2').textContent = 'circle';
    document.getElementById('donate-3').textContent = 'circle';
    step = 1;
  });
  document.getElementById('donate-one-time').addEventListener('click', function(event) {
    if (frequency === 'one-time')
      return;
    event.currentTarget.classList.add('is-info');
    document.getElementById(frequency === 'monthly' ? 'donate-monthly' : 'donate-annually').classList.remove('is-info');
    frequency = 'one-time';
  });
  document.getElementById('donate-monthly').addEventListener('click', function(event) {
    if (frequency === 'monthly')
      return;
    event.currentTarget.classList.add('is-info');
    document.getElementById(frequency === 'one-time' ? 'donate-one-time' : 'donate-annually').classList.remove('is-info');
    frequency = 'monthly';
  });
  document.getElementById('donate-annually').addEventListener('click', function(event) {
    if (frequency === 'annually')
      return;
    event.currentTarget.classList.add('is-info');
    document.getElementById(frequency === 'one-time' ? 'donate-one-time' : 'donate-monthly').classList.remove('is-info');
    frequency = 'annually';
  });
  for(const a of amounts) {
    document.getElementById(`donate-${a}`).addEventListener('click', function(event) {
      if (amount === a)
        return;
      event.currentTarget.classList.add('is-info');
      document.getElementById(`donate-${amount}`).classList.remove('is-info');
      amount = a;
    });
  }
  document.getElementById('donate-comment-checkbox').addEventListener('click', function(event) {
    const classList = document.getElementById('donate-comment-field').classList;
    const donateDisplayText = document.getElementById('donate-display-text');
    if (event.currentTarget.checked) {
      donateDisplayText.textContent = 'Display donation and comment';
      classList.remove('is-hidden');
    } else {
      donateDisplayText.textContent = 'Display donation';
      classList.add('is-hidden');
    }
  });
  document.getElementById('donate-display-checkbox').addEventListener('click', function(event) {
    const firstName = document.getElementById('donate-display-first-name-field').classList;
    const hideAmount = document.getElementById('donate-hide-amount-field').classList;
    if (event.currentTarget.checked) {
      if (!isOrganization)
        firstName.remove('is-hidden');
      hideAmount.remove('is-hidden');
      display = true;
    } else {
      firstName.add('is-hidden');
      hideAmount.add('is-hidden');
      display = false;
    }
  });
  document.getElementById('donate-organization-checkbox').addEventListener('click', function(event) {
    const classList = document.getElementById('donate-organization-field').classList;
    const displayFirstName = document.getElementById('donate-display-first-name-field').classList;
    const name = document.getElementById('donate-name-field').classList;
    if (event.currentTarget.checked) {
      isOrganization = true;
      classList.remove('is-hidden');
      name.add('is-hidden');
      if (display)
        displayFirstName.add('is-hidden');
    } else {
      isOrganization = false;
      classList.add('is-hidden');
      name.remove('is-hidden');
      if (display)
        displayFirstName.remove('is-hidden');
    }
  });
});
