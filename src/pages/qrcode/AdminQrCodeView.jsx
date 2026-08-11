import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import Swal from 'sweetalert2';

const AdminQrCodeView = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const [isSharing, setIsSharing] = useState(false);

    const getQrBlob = () => {
        return new Promise((resolve, reject) => {
            const svg = document.getElementById("qr-code-svg");
            if (!svg) {
                reject(new Error("SVG element not found"));
                return;
            }

            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const padding = 20;
                const canvas = document.createElement("canvas");
                const width = img.naturalWidth || img.width || 250;
                const height = img.naturalHeight || img.height || 250;
                const textAreaHeight = 65;

                canvas.width = width + padding * 2;
                canvas.height = height + padding * 2 + textAreaHeight;

                const ctx = canvas.getContext("2d");
                
                // White background
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw QR Code
                ctx.drawImage(img, padding, padding, width, height);

                // Separator line
                ctx.strokeStyle = "#e0e0e0";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(padding, height + padding + 8);
                ctx.lineTo(canvas.width - padding, height + padding + 8);
                ctx.stroke();

                // Draw Code text
                ctx.textAlign = "center";
                ctx.font = "bold 16px 'Segoe UI', Arial, sans-serif";
                ctx.fillStyle = "#2c3e50";
                ctx.fillText(`Code: ${code || 'N/A'}`, canvas.width / 2, height + padding + 30);

                // Draw Link text
                ctx.font = "12px 'Segoe UI', Arial, sans-serif";
                ctx.fillStyle = "#3498db";
                const qrUrl = code ? `https://sarsspl.com/ziman/qrcode-view/${code}` : '';
                ctx.fillText(qrUrl, canvas.width / 2, height + padding + 50);

                URL.revokeObjectURL(url);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas toBlob failed"));
                    }
                }, 'image/png');
            };

            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(err || new Error("Failed to load SVG into Image"));
            };

            img.src = url;
        });
    };

    const downloadQR = async () => {
        try {
            const blob = await getQrBlob();
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.download = `${code || 'qr'}-code.png`;
            downloadLink.href = url;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading QR:", error);
            Swal.fire({
                icon: 'error',
                title: 'Download Failed',
                text: 'QR Code download me error aaya. Please retry.',
            });
        }
    };

    const shareOnWhatsApp = async () => {
        setIsSharing(true);
        try {
            const blob = await getQrBlob();
            const captionText = `QR Code for ${code}`;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // On Mobile: use native share if supported because it opens installed WhatsApp app directly
            if (isMobile && navigator.canShare) {
                const file = new File([blob], `${code || 'qr'}-code.png`, { type: 'image/png' });
                if (navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: `QR Code ${code}`,
                            text: captionText,
                            files: [file]
                        });
                        setIsSharing(false);
                        return;
                    } catch (shareErr) {
                        if (shareErr.name === 'AbortError') {
                            setIsSharing(false);
                            return; // User cancelled share
                        }
                        console.warn("Mobile Web Share failed, trying fallback...", shareErr);
                    }
                }
            }

            // On Desktop: Always copy image to clipboard & open WhatsApp Web directly
            let copied = false;
            if (navigator.clipboard && window.ClipboardItem) {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    copied = true;
                } catch (err) {
                    console.error("Clipboard write error:", err);
                }
            }

            window.open('https://web.whatsapp.com', '_blank');
        } catch (error) {
            console.error("Error in shareOnWhatsApp:", error);
            Swal.fire({
                icon: 'error',
                title: 'Share Error',
                text: 'WhatsApp share process me error aaya.',
            });
        } finally {
            setIsSharing(false);
        }
    };

    const shareSystemQR = async () => {
        setIsSharing(true);
        try {
            const blob = await getQrBlob();
            const file = new File([blob], `${code || 'qr'}-code.png`, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: `QR Code - ${code}`,
                        text: `QR Code for ${code}`,
                        files: [file]
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error('Error sharing:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Share Error',
                            text: 'System share cancel ya failed ho gaya.'
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'System Share Unsupported',
                    text: 'Aapke browser/device par direct file share option active nahi hai. "Share QR Image (WhatsApp)" ya "Download QR" use karein.',
                    confirmButtonColor: '#3498db'
                });
            }
        } catch (error) {
            console.error("Error in shareSystemQR:", error);
            Swal.fire({
                icon: 'error',
                title: 'Share Error',
                text: 'QR image share karne me error aaya.',
            });
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="card" style={{ padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', background: '#fff', maxWidth: '400px', width: '100%' }}>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontWeight: 'bold' }}>QR Code</h3>

                <div style={{ background: '#fff', padding: '20px', display: 'inline-block', borderRadius: '10px', border: '1px solid #eee' }}>
                    <QRCodeSVG
                        id="qr-code-svg"
                        value={code ? `https://sarsspl.com/ziman/qrcode-view/${code}` : 'N/A'}
                        size={250}
                        level={"H"}
                        includeMargin={true}
                    />
                </div>

                <div style={{ marginTop: '20px', fontWeight: '500', fontSize: '18px', color: '#7f8c8d' }}>
                    Code: <span style={{ color: '#2c3e50', fontWeight: 'bold' }}>{code}</span>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button
                        onClick={shareOnWhatsApp}
                        disabled={isSharing}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isSharing ? '#95a5a6' : '#25D366',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: isSharing ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                        onMouseOver={(e) => { if (!isSharing) e.target.style.backgroundColor = '#1da851'; }}
                        onMouseOut={(e) => { if (!isSharing) e.target.style.backgroundColor = '#25D366'; }}
                    >
                        <i className="fa fa-whatsapp" style={{ fontSize: '20px' }}></i> {isSharing ? 'Processing...' : 'Share QR Image (WhatsApp)'}
                    </button>

                    <button
                        onClick={shareSystemQR}
                        disabled={isSharing}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isSharing ? '#95a5a6' : '#27ae60',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: isSharing ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                        onMouseOver={(e) => { if (!isSharing) e.target.style.backgroundColor = '#2ecc71'; }}
                        onMouseOut={(e) => { if (!isSharing) e.target.style.backgroundColor = '#27ae60'; }}
                    >
                        <i className="fa fa-share-alt"></i> {isSharing ? 'Processing...' : 'Share Desktop System Apps'}
                    </button>

                    <button
                        onClick={downloadQR}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#3498db',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        <i className="fa fa-download"></i> Download QR (PNG)
                    </button>

                    <button
                        onClick={() => window.close()}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: '1px solid #bdc3c7',
                            backgroundColor: '#ecf0f1',
                            color: '#7f8c8d',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                        }}
                        onMouseOver={(e) => { e.target.style.backgroundColor = '#bdc3c7'; e.target.style.color = 'white'; }}
                        onMouseOut={(e) => { e.target.style.backgroundColor = '#ecf0f1'; e.target.style.color = '#7f8c8d'; }}
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminQrCodeView;







