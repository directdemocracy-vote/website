window.addEventListener("load", function() {
  let checkout;
  document.getElementById('donate-button').addEventListener('click', async function(event) {
    const button = event.currentTarget;
    button.classList.add('is-loading');
    const stripe = Stripe('pk_test_51ONAiHJ8bitZPVQT83mvU9hsFgAcXYctJa6wFynuQ7ZieWQHLeFmmdNlJMpECaIkVz87vBHnbBgW9q48qc9fdvcr00oudVLpYM');
    const response = await fetch('/stripe/checkout.php', {method: 'POST'});
    const {clientSecret} = await response.json();
    checkout = await stripe.initEmbeddedCheckout({clientSecret});
    document.getElementById('donate-explanation').classList.add('is-hidden');
    document.getElementById('donate-form').classList.add('is-hidden');
    document.getElementById('donate-checkout').classList.remove('is-hidden');
    document.getElementById('donate-back').classList.remove('is-hidden');
    button.classList.remove('is-loading');
    checkout.mount('#donate-checkout');
  });
  document.getElementById('donate-back').addEventListener('click', async function(event) {
    checkout.unmount();
    checkout.destroy();
    document.getElementById('donate-explanation').classList.remove('is-hidden');
    document.getElementById('donate-form').classList.remove('is-hidden');
    document.getElementById('donate-checkout').classList.add('is-hidden');
    document.getElementById('donate-back').classList.add('is-hidden');    
  });
});
