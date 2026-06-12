// Gerar QR Code
function openQRModal() {
    const modal = document.getElementById('qrModal');
    const qrCodeContainer = document.getElementById('qrCode');

    if (!modal || !qrCodeContainer || !window.QRCode) {
        alert('O QR Code não está disponível no momento.');
        return;
    }

    // Limpar container anterior
    qrCodeContainer.innerHTML = '';

    // Gerar URL do menu (GitHub Pages)
    const menuUrl = window.location.href;

    // Criar QR Code
    new QRCode(qrCodeContainer, {
        text: menuUrl,
        width: 250,
        height: 250,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    modal.classList.add('active');
}

// Fechar modal QR
function closeQRModal() {
    const modal = document.getElementById('qrModal');
    modal.classList.remove('active');
}

// Fechar modal ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('qrModal');
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQRModal();
        }
    });
});
