// Integração WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (!whatsappBtn) return;
    whatsappBtn.addEventListener('click', sendToWhatsApp);
});

function sendToWhatsApp() {
    if (!Array.isArray(cart) || cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    if (!menuData || !menuData.restaurant) {
        alert('Os dados do restaurante não estão disponíveis.');
        return;
    }

    const restaurantInfo = menuData.restaurant;
    const total = getCartTotal();

    // Montar mensagem
    let message = `*PEDIDO EUREKA LOUNGE*\n\n`;
    message += `📋 *Itens do Pedido:*\n`;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `• ${item.name}\n`;
        message += `  Qtd: ${item.quantity} x ${item.price.toLocaleString('pt-AO')} Kz = ${itemTotal.toLocaleString('pt-AO')} Kz\n\n`;
    });

    message += `💰 *Total: ${total.toLocaleString('pt-AO')} Kz*\n\n`;
    message += `📍 Local: ${restaurantInfo.location}\n`;
    message += `📞 Telefone: ${restaurantInfo.phone}\n`;
    message += `🕐 Horário: ${restaurantInfo.hours}\n\n`;
    message += `_Pedido realizado via Menu Digital Eureka_`;

    // Codificar mensagem
    const encodedMessage = encodeURIComponent(message);

    // Extrair número do WhatsApp (remover caracteres especiais)
    const phoneNumber = restaurantInfo.phone.replace(/\D/g, '');

    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}
