/*
    Core logic/payment flow for this comes from here:
    https://stripe.com/docs/payments/accept-a-payment

    CSS from here:
    https://stripe.com/docs/stripe-js
*/

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("payment-form");
    var cardElementContainer = document.getElementById("card-element");
    var errorDiv = document.getElementById("card-errors");
    var submitButton = document.getElementById("submit-button");
    var stripePublicKeyNode = document.getElementById("id_stripe_public_key");
    var clientSecretNode = document.getElementById("id_client_secret");
    var shippingCountry = "CH";
    var shippingCity = "Zurich";
    var shippingState = "Zurich";

    if (!form || !cardElementContainer || !errorDiv || !submitButton) {
        return;
    }

    var showError = function (message) {
        errorDiv.innerHTML = `
            <span class="icon" role="alert">
                <i class="fas fa-times"></i>
            </span>
            <span>${message}</span>
        `;
    };

    var resetFormState = function () {
        $("#payment-form").fadeIn(100);
        $("#loading-overlay").fadeOut(100);
        card.update({disabled: false});
        submitButton.removeAttribute("disabled");
    };

    if (!window.Stripe) {
        showError("Stripe.js did not load, so the card field is unavailable.");
        return;
    }

    if (!stripePublicKeyNode || !clientSecretNode) {
        showError("Stripe configuration is missing from this page.");
        return;
    }

    var stripePublicKey = JSON.parse(stripePublicKeyNode.textContent);
    var clientSecret = JSON.parse(clientSecretNode.textContent);

    if (!stripePublicKey || !clientSecret) {
        showError("Stripe test keys or the payment intent client secret are missing.");
        return;
    }

    var stripe = Stripe(stripePublicKey);
    var elements = stripe.elements();
    var style = {
        base: {
            color: "#000",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#dc3545",
            iconColor: "#dc3545"
        }
    };
    var card = elements.create("card", {
        style: style,
        hidePostalCode: true
    });

    card.mount("#card-element");

    // Handle realtime validation errors on the card element
    card.addEventListener("change", function (event) {
        if (event.error) {
            showError(event.error.message);
        } else {
            errorDiv.textContent = "";
        }
    });

    // Handle form submit
    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        card.update({disabled: true});
        submitButton.setAttribute("disabled", true);
        $("#payment-form").fadeToggle(100);
        $("#loading-overlay").fadeToggle(100);

        var saveInfo = Boolean($("#id-save-info").prop("checked"));
        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        var postData = {
            csrfmiddlewaretoken: csrfToken,
            client_secret: clientSecret,
            save_info: saveInfo
        };
        var url = "/checkout/cache_checkout_data/";

        $.post(url, postData).fail(function (jqXHR) {
            console.warn("Checkout cache step failed:", jqXHR.responseText);
        });

        stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: $.trim(form.full_name.value),
                    phone: $.trim(form.phone_number.value),
                    email: $.trim(form.email.value),
                    address: {
                        line1: $.trim(form.street_address1.value),
                        line2: $.trim(form.street_address2.value),
                        city: shippingCity,
                        state: shippingState,
                        country: shippingCountry,
                        postal_code: $.trim(form.postcode.value)
                    }
                }
            },
            shipping: {
                name: $.trim(form.full_name.value),
                phone: $.trim(form.phone_number.value),
                address: {
                    line1: $.trim(form.street_address1.value),
                    line2: $.trim(form.street_address2.value),
                    city: shippingCity,
                    state: shippingState,
                    country: shippingCountry,
                    postal_code: $.trim(form.postcode.value)
                }
            }
        }).then(function (result) {
            if (result.error) {
                showError(result.error.message);
                resetFormState();
            } else if (result.paymentIntent.status === "succeeded") {
                form.submit();
            }
        }).catch(function (error) {
            showError(error.message || "We couldn't confirm the payment. Please check your card details and try again.");
            resetFormState();
        });
    });
});
