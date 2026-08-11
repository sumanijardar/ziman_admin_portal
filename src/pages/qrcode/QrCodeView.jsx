import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const QrCodeView = () => {
    const { code } = useParams();
    const [agreed, setAgreed] = useState(false);

    return (
        <div style={{
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', sans-serif",
            padding: '20px',
            paddingBottom: '100px',
            color: '#333',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Header Text */}


                {/* Unique Code */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#333'
                }}>
                    Unique Code :- <span style={{ color: '#000' }}>{code}</span>
                </div>

                {/* Dummy ID Card Image Area */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px'
                }}>
                    {/* Responsive container for the card image */}
                    <div style={{
                        width: '100%',
                        maxWidth: '300px',
                        aspectRatio: '3/2',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e0e0e0',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <span style={{ fontSize: '0.9rem' }}>[ID Card Image Placeholder]</span>
                        {/* If you have an image, replace the span with this img tag: */}
                        {/* <img src="/path-to-id-card.jpg" alt="ID Card" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> */}
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '5px 0' }} />

                {/* Dummy Details List */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    fontSize: '1rem',
                    color: '#333',
                    padding: '0 10px'
                }}>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Childname</strong> <span style={{ marginRight: '5px' }}>:</span> Nishant Sharma</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Standard</strong> <span style={{ marginRight: '5px' }}>:</span> 10</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Division</strong> <span style={{ marginRight: '5px' }}>:</span> B</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Rollnumber</strong> <span style={{ marginRight: '5px' }}>:</span> 110</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Childaddress</strong> <span style={{ marginRight: '5px' }}>:</span> Koparkhairane</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Childschoolname</strong> <span style={{ marginRight: '5px' }}>:</span> CBM</div>
                    <div style={{ display: 'flex' }}><strong style={{ width: '140px', flexShrink: 0 }}>Schooladdress</strong> <span style={{ marginRight: '5px' }}>:</span> Sion</div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '5px 0' }} />

                {/* Terms and Privacy */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1rem',
                    padding: '0 10px',
                    marginBottom: '20px'
                }}>


                </div>
            </div>


        </div>
    );
};

export default QrCodeView;
