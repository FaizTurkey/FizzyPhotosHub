import React, { useEffect, useState } from 'react';

const InstallPopup = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Browser jab install prompt dene ke liye ready hota hai tab yeh event fire hota hai
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Default prompt ko rokein
      setDeferredPrompt(e); // Event ko save karein taki baad me trigger kar sakein
      setIsVisible(true); // Custom popup dikhayein
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Install prompt dikhayein
      deferredPrompt.prompt();
      
      // User ke response ka wait karein (Install kiya ya Cancel)
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Prompt use hone ke baad usko clear kar dein
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#fff',
      padding: '15px 20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      zIndex: 1000
    }}>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
        Install PhotoApp for a better experience!
      </p>
      <button 
        onClick={handleInstallClick} 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Install
      </button>
      <button 
        onClick={() => setIsVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#888'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default InstallPopup;