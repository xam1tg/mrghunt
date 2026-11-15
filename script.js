(function () {
  var form = document.getElementById('subscribe-form');
  var emailInput = document.getElementById('subscribe-email');
  var button = document.getElementById('subscribe-btn');
  var statusEl = document.getElementById('subscribe-status');

  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'subscribe-status ' + (type || '');
  }

  function setLoading(isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Отправка...' : 'Подписаться';
  }

  emailInput.addEventListener('input', function () {
    emailInput.classList.remove('invalid');
    setStatus('', '');
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var email = emailInput.value.trim();

    if (!email) {
      emailInput.classList.add('invalid');
      setStatus('Введите адрес электронной почты.', 'error');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      emailInput.classList.add('invalid');
      setStatus('Введите корректный адрес почты.', 'error');
      return;
    }

    setLoading(true);
    setStatus('', '');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (response) {
      if (response.ok) {
        setStatus('Спасибо! Вы успешно подписались.', 'success');
        form.reset();
        return;
      }
      return response.json().catch(function () { return {}; }).then(function (data) {
        var message = (data.errors && data.errors.length)
        ? data.errors.map(function (e) { return e.message; }).join(', ')
        : 'Не удалось отправить. Попробуйте позже.';
        setStatus(message, 'error');
      });
    })
    .catch(function () {
      setStatus('Ошибка сети. Проверьте подключение и попробуйте снова.', 'error');
    })
    .then(function () {
      setLoading(false);
    });
  });
})();
