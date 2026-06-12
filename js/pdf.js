// Gerar PDF do pedido
document.addEventListener('DOMContentLoaded', () => {
    const pdfBtn = document.getElementById('pdfBtn');
    if (!pdfBtn) return;
    pdfBtn.addEventListener('click', generatePDF);
});

function generatePDF() {
    if (!window.html2pdf || typeof window.html2pdf !== 'function') {
        alert('O gerador de PDF não está disponível no momento.');
        return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.color = '#333';

    const logoUrl = 'img/eurea.png';
    const restaurantInfo = menuData.restaurant;
    const total = getCartTotal();

    element.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #d4af37; margin: 0;">EUREKA LOUNGE</h1>
            <p style="margin: 5px 0; color: #666;">Menu Digital</p>
        </div>

        <div style="border-top: 2px solid #d4af37; border-bottom: 2px solid #d4af37; padding: 15px 0; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; color: #d4af37;">Seu Pedido</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <th style="text-align: left; padding: 8px; color: #d4af37;">Produto</th>
                        <th style="text-align: center; padding: 8px; color: #d4af37;">Qtd</th>
                        <th style="text-align: right; padding: 8px; color: #d4af37;">Preço Unit.</th>
                        <th style="text-align: right; padding: 8px; color: #d4af37;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px;">${item.name}</td>
                            <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                            <td style="text-align: right; padding: 8px;">${item.price.toLocaleString('pt-AO')} Kz</td>
                            <td style="text-align: right; padding: 8px; font-weight: bold;">${(item.price * item.quantity).toLocaleString('pt-AO')} Kz</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="text-align: right; margin: 20px 0;">
            <h3 style="color: #d4af37; margin: 0;">Total: ${total.toLocaleString('pt-AO')} Kz</h3>
        </div>

        <div style="border-top: 2px solid #d4af37; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>📍 Localização:</strong> ${restaurantInfo.location}</p>
            <p style="margin: 5px 0;"><strong>📞 Telefone:</strong> ${restaurantInfo.phone}</p>
            <p style="margin: 5px 0;"><strong>🕐 Horário:</strong> ${restaurantInfo.hours}</p>
            <p style="margin: 5px 0;"><strong>📱 Instagram:</strong> ${restaurantInfo.instagram}</p>
            <p style="margin: 10px 0 0 0; text-align: center; color: #999;">
                Gerado em: ${new Date().toLocaleString('pt-PT')}
            </p>
        </div>
    `;

    const opt = {
        margin: 10,
        filename: `Eureka-Pedido-${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}
