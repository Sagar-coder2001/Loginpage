
import React, { useRef, useState } from 'react'
import './RegisterQrCode.css'
import QRCode from 'qrcode.react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faWhatsapp, faTwitter, faFacebook } from '@fortawesome/free-brands-icons';
const RegisterQrCode = () => {
    const [userdetails, setuserdetails] = useState({
        username: '',
        mobile: ''
    })

    const [qrCodeValue, setQRCodeValue] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrCodeRef = useRef(null);
    const [submited, setsubmitd] = useState(false)

    const saveDetails = (e) => {
        e.preventDefault();
        if (userdetails.username == '' && userdetails.mobile === '') {
            alert('Please Field All Filds')
        }
        else {
            const generatedQRCodeValue = `${userdetails.username} ${userdetails.mobile}`;
            setQRCodeValue(generatedQRCodeValue);
            setShowQR(true);
            // setuserdetails({
            //     username : '',
            //     mobile : ''
            // })
            setsubmitd(true)

        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setuserdetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleDownload = () => {
        if (qrCodeRef.current) {
            const canvas = qrCodeRef.current.firstChild;
            if (canvas) {
                const url = canvas.toDataURL("image/png");
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qrcode.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.error("No canvas element found in QRCode component.");
            }
        } else {
            console.error("QRCode component not yet rendered.");
        }
    };

    const shareQrCode = async () => {
        try {
            if (navigator.share) {
                const canvas = qrCodeRef.current.firstChild;
                if (canvas) {
                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                    await navigator.share({
                        files: [new File([blob], 'qrcode.png', { type: 'image/png' })],
                        title: 'QR Code',
                        text: 'Share this QR Code',
                    });
                } else {
                    console.error("No canvas element found in QRCode component.");
                }
            } else {
                const qrCodeUrl = qrCodeRef.current.firstChild.toDataURL("image/png");
                const shareUrl = encodeURIComponent(qrCodeUrl);
                const whatsappUrl = `whatsapp://send?text=${shareUrl}`;
                const instagramUrl = `https://www.instagram.com/share?url=${shareUrl}`;
                const twitterUrl = `https://twitter.com/share?url=${shareUrl}`;
                window.open(whatsappUrl, '_blank');
                window.open(instagramUrl, '_blank');
                window.open(twitterUrl, '_blank');
            }
        } catch (error) {
            console.error('Error sharing QR Code:', error);
        }
    }
    return (
        <>
            <div>
                <div className="login-container">
                    {
                        !submited ? (
                            <form action="" onSubmit={saveDetails}>
                                <h2>Register</h2>
                                <div className="input-container">
                                    <input
                                        type="text"
                                        placeholder="Enter Your Name"
                                        name="username"
                                        value={userdetails.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-container">
                                    <input
                                        type="tel"
                                        placeholder="Enter Your Mobile"
                                        name="mobile"
                                        value={userdetails.mobile}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-container">
                                    <button type='submit'>Submit</button>
                                </div>
                            </form>
                        ) : null
                    }

                    {showQR && (
                        <div className="qrcode-container" ref={qrCodeRef}>
                            <QRCode
                                value={qrCodeValue}
                                size={150}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                    )}
                    {
                        showQR && (
                            <div className="qr-download">
                                <button onClick={handleDownload}> <i class="fa-solid fa-download"></i> Download</button>
                                <button onClick={shareQrCode}><i class="fa-solid fa-share"></i> Share</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default RegisterQrCode
