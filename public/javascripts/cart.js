document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async () => {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: button.dataset.id })
            });

            const data = await response.json();

            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            }

            if (data.success) alert('Product added to cart');
            else alert('Error adding product');
        });
    });

    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', async () => {
            console.log("Remove clicked");

            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: button.dataset.id })
            });

            const data = await response.json();

            if (data.success) {
                location.reload();
            } else {
                alert('Error removing item');
            }
        });
    });

});