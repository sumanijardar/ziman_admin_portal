import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const QrCodeView = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const downloadQR = () => {
        const svg = document.getElementById("qr-code-svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = () => {
            // Added padding for the downloaded image
            const padding = 20;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            
            // White background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.drawImage(img, padding, padding);
            const pngFile = canvas.toDataURL("image/png");
            
            const downloadLink = document.createElement("a");
            downloadLink.download = `${code || 'qr'}-code.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    };

    const shareQR = async () => {
        if (!navigator.canShare || !navigator.canShare({ files: [new File([], '')] })) {
            alert('Sharing files is not supported on this browser/device.');
            return;
        }

        const svg = document.getElementById("qr-code-svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        img.onload = async () => {
            const padding = 20;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, padding, padding);
            
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `${code || 'qr'}-code.png`, { type: 'image/png' });
                try {
                    await navigator.share({
                        title: 'QR Code',
                        text: `QR Code for ${code}`,
                        files: [file]
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                }
            }, 'image/png');
        };
        
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
    };

    return (
        <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', background: '#fff', maxWidth: '400px', width: '100%' }}>
                <h3 style={{ marginBottom: '20px', color: '#2c3e50', fontWeight: 'bold' }}>QR Code</h3>
                
                <div style={{ background: '#fff', padding: '20px', display: 'inline-block', borderRadius: '10px', border: '1px solid #eee' }}>
                    <QRCodeSVG 
                        id="qr-code-svg"
                        value={code || 'N/A'} 
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
                        onClick={shareQR}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#27ae60',
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
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2ecc71'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
                    >
                        <i className="fa fa-share-alt"></i> Share QR
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

export default QrCodeView;
