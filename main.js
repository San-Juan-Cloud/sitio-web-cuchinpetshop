// Acá se conecta la API del sistema de gestión (CRM) de Cuchín Pet Shop.
// Reemplazar por la URL real del endpoint que recibe los leads del formulario.
const FORM_ENDPOINT = "https://TU-ENDPOINT-AQUI/api/leads";

document.addEventListener('DOMContentLoaded', function () {

  // Menú móvil
  (function () {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('menu-icon-open');
    var iconClose = document.getElementById('menu-icon-close');

    function closeMenu() {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }

    function openMenu() {
      menu.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
    }

    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  // Formulario de contacto
  (function () {
    var form = document.getElementById('contact-form');
    var submitBtn = document.getElementById('contact-submit');
    var submitLabel = document.getElementById('contact-submit-label');
    var spinner = document.getElementById('contact-spinner');
    var successBox = document.getElementById('contact-success');
    var errorBox = document.getElementById('contact-error');

    var PHONE_RE = /^[+]?[\d\s\-()]{8,20}$/;
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var fields = {
      name: { el: document.getElementById('field-name'), error: document.getElementById('error-name') },
      phone: { el: document.getElementById('field-phone'), error: document.getElementById('error-phone') },
      email: { el: document.getElementById('field-email'), error: document.getElementById('error-email') },
      message: { el: document.getElementById('field-message'), error: document.getElementById('error-message') },
      privacy: { el: document.getElementById('field-privacy'), error: document.getElementById('error-privacy') }
    };

    function setFieldError(field, message) {
      field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
      field.el.classList.toggle('border-coral-600', !!message);
      field.el.classList.toggle('border-coral-100', !message);
      field.error.textContent = message || '';
      field.error.classList.toggle('hidden', !message);
    }

    // Cada validador devuelve el mensaje de error (string) o '' si el campo es válido.
    // Se usan tanto al enviar el formulario como en el blur de cada campo.
    var validators = {
      name: function () {
        return fields.name.el.value.trim() ? '' : 'Contanos tu nombre completo.';
      },
      phone: function () {
        var val = fields.phone.el.value.trim();
        if (!val) return 'Dejanos un teléfono o WhatsApp de contacto.';
        if (!PHONE_RE.test(val)) return 'Revisá el formato: solo números, espacios, +, - o paréntesis (mínimo 8 dígitos).';
        return '';
      },
      email: function () {
        var val = fields.email.el.value.trim();
        if (val && !EMAIL_RE.test(val)) return 'Revisá el formato del email (ej: nombre@dominio.com).';
        return '';
      },
      message: function () {
        return fields.message.el.value.trim() ? '' : 'Contanos en qué te podemos ayudar.';
      },
      privacy: function () {
        return fields.privacy.el.checked ? '' : 'Necesitamos que aceptes la política de privacidad para continuar.';
      }
    };

    function validateField(key) {
      var message = validators[key]();
      setFieldError(fields[key], message);
      return !message;
    }

    // Validación on blur (no en cada tecla) para avisar temprano sin ser invasivos.
    Object.keys(validators).forEach(function (key) {
      var evt = key === 'privacy' ? 'change' : 'blur';
      fields[key].el.addEventListener(evt, function () {
        // Solo mostramos el error si el usuario ya había intentado escribir algo,
        // para no marcar en rojo un campo que todavía nadie tocó.
        if (fields[key].el.value.trim() || key === 'privacy') validateField(key);
      });
    });

    function validate() {
      var valid = true;
      var firstInvalid = null;

      Object.keys(validators).forEach(function (key) {
        var ok = validateField(key);
        if (!ok) {
          valid = false;
          firstInvalid = firstInvalid || fields[key].el;
        }
      });

      if (firstInvalid) firstInvalid.focus();
      return valid;
    }

    function setLoading(loading) {
      submitBtn.disabled = loading;
      spinner.classList.toggle('hidden', !loading);
      submitLabel.textContent = loading ? 'Enviando...' : 'Enviar consulta';
    }

    function showSuccess() {
      errorBox.classList.add('hidden');
      successBox.classList.remove('hidden');
      successBox.focus();
      form.reset();
    }

    function showError() {
      successBox.classList.add('hidden');
      errorBox.classList.remove('hidden');
      errorBox.focus();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successBox.classList.add('hidden');
      errorBox.classList.add('hidden');

      if (!validate()) return;

      // Honeypot: si un bot completó este campo oculto, fingimos éxito sin enviar nada al backend.
      var honeypot = document.getElementById('field-website').value;
      if (honeypot) {
        showSuccess();
        return;
      }

      var payload = {
        name: fields.name.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        email: fields.email.el.value.trim(),
        category: document.getElementById('field-category').value,
        message: fields.message.el.value.trim(),
        source: 'landing-cuchinpetshop',
        timestamp: new Date().toISOString()
      };

      setLoading(true);

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Respuesta no exitosa del servidor');
          showSuccess();
        })
        .catch(function () {
          showError();
        })
        .finally(function () {
          setLoading(false);
        });
    });
  })();

});
