import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        catalog: 'Catalog',
        ai_studio: 'AI Studio',
        gallery: 'Gallery',
        contact: 'Contact',
        orders: 'Orders'
      },
      gallery: {
        tap_to_read: 'Tap to Read',
        transformation_stories: 'Transformation Stories',
        trending: 'Trending',
        views: 'Views',
        reviews: 'Reviews'
      },
      contact: {
        get_in_touch: 'Get In Touch',
        send_message: 'Send us a Message',
        full_name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        service_interested: 'Service Interested In',
        consultation_type: 'Consultation Type',
        online_consultation: 'Online Consultation',
        in_person_visit: 'In-Person Visit',
        preferred_time: 'Preferred Time',
        message_label: 'Message',
        message_placeholder: "Tell us about your requirements, style preferences, or any questions you have...",
        submit: 'Send Message',
        retry: 'Retry'
      }
    }
  },
  ta: { translation: {
    nav: { home: 'முகப்பு', catalog: 'பட்டியல்', ai_studio: 'AI ஸ்டுடியோ', gallery: 'கேலரி', contact: 'தொடர்பு', orders: 'ஆர்டர்கள்' },
    gallery: { tap_to_read: 'படிக்க தட்டவும்', transformation_stories: 'மாற்றம் கதைகள்', trending: 'பிரபலமானவை', views: 'காண்பிகள்', reviews: 'விமர்சனங்கள்' },
    contact: { get_in_touch: 'எங்களை தொடர்பு கொள்ளுங்கள்', send_message: 'எங்களுக்கு செய்தி அனுப்பவும்', full_name: 'முழு பெயர்', email: 'மின்னஞ்சல் முகவரி', phone: 'தொலைபேசி எண்', service_interested: 'சேவை விருப்பம்', consultation_type: 'ஆலோசனை வகை', online_consultation: 'ஆன்லைன் ஆலோசனை', in_person_visit: 'நேரடியாக வருகை', preferred_time: 'விருப்ப நேரம்', message_label: 'செய்தி', message_placeholder: 'உங்கள் தேவைகள், பாணி விருப்பங்கள் குறித்து எழுதுங்கள்...', submit: 'செய்தி அனுப்பவும்', retry: 'மீண்டும் முயற்சி' }
  }},
  hi: { translation: {
    nav: { home: 'होम', catalog: 'कैटलॉग', ai_studio: 'एआई स्टूडियो', gallery: 'गैलरी', contact: 'संपर्क', orders: 'ऑर्डर्स' },
    gallery: { tap_to_read: 'पढ़ने के लिए टैप करें', transformation_stories: 'रूपांतरण कहानियाँ', trending: 'ट्रेंडिंग', views: 'व्यूज़', reviews: 'रिव्यूज़' },
    contact: { get_in_touch: 'संपर्क करें', send_message: 'हमें संदेश भेजें', full_name: 'पूरा नाम', email: 'ईमेल पता', phone: 'फोन नंबर', service_interested: 'रुचि की सेवा', consultation_type: 'परामर्श प्रकार', online_consultation: 'ऑनलाइन परामर्श', in_person_visit: 'ऑफलाइन विज़िट', preferred_time: 'पसंदीदा समय', message_label: 'संदेश', message_placeholder: 'अपनी आवश्यकताएँ और शैली प्राथमिकताएँ लिखें...', submit: 'संदेश भेजें', retry: 'फिर कोशिश करें' }
  }},
  te: { translation: {
    nav: { home: 'హోమ్', catalog: 'కాటలాగ్', ai_studio: 'ఏఐ స్టూడియో', gallery: 'గ్యాలరీ', contact: 'సంప్రదించండి', orders: 'ఆర్డర్లు' },
    gallery: { tap_to_read: 'చదవడానికి ట్యాప్ చేయండి', transformation_stories: 'మార్పు కథలు', trending: 'ట్రెండింగ్', views: 'వ్యూస్', reviews: 'రివ్యూలు' },
    contact: { get_in_touch: 'మమ్మల్ని సంప్రదించండి', send_message: 'మాకు సందేశం పంపండి', full_name: 'పూర్తి పేరు', email: 'ఇమెయిల్ చిరునామా', phone: 'ఫోన్ నంబర్', service_interested: 'సేవ ఆసక్తి', consultation_type: 'కన్సల్టేషన్ రకం', online_consultation: 'ఆన్‌లైన్ కన్సల్టేషన్', in_person_visit: 'సాక్షాత్ విజిట్', preferred_time: 'ఇష్టమైన సమయం', message_label: 'సందేశం', message_placeholder: 'మీ అవసరాలు, శైలి అభిరుచులు వ్రాయండి...', submit: 'సందేశం పంపండి', retry: 'మళ్లీ ప్రయత్నించండి' }
  }},
  ml: { translation: {
    nav: { home: 'ഹോം', catalog: 'കാറ്റലോഗ്', ai_studio: 'എഐ സ്റ്റുഡിയോ', gallery: 'ഗാലറി', contact: 'ബന്ധപ്പെടുക', orders: 'ഓർഡറുകൾ' },
    gallery: { tap_to_read: 'വായിക്കാൻ ടാപ്പ് ചെയ്യുക', transformation_stories: 'മാറ്റത്തിന്റെ കഥകൾ', trending: 'ട്രെൻഡിംഗ്', views: 'വ്യൂസ്', reviews: 'റിവ്യൂകൾ' },
    contact: { get_in_touch: 'ഞങ്ങളെ ബന്ധപ്പെടുക', send_message: 'ഞങ്ങൾക്ക് സന്ദേശം അയക്കുക', full_name: 'പൂർണ്ണ പേര്', email: 'ഇമെയിൽ വിലാസം', phone: 'ഫോൺ നമ്പർ', service_interested: 'താല്പര്യ സേവനം', consultation_type: 'കൺസൾട്ടേഷൻ തരം', online_consultation: 'ഓൺലൈൻ കൺസൾട്ടേഷൻ', in_person_visit: 'സ്വകാര്യ സന്ദർശനം', preferred_time: 'ഇഷ്ടസമയം', message_label: 'സന്ദേശം', message_placeholder: 'നിങ്ങളുടെ ആവശ്യങ്ങൾയും സ്റ്റൈൽ മുൻഗണനകളും എഴുതുക...', submit: 'സന്ദേശം അയക്കുക', retry: 'വീണ്ടും ശ്രമിക്കുക' }
  }},
  kn: { translation: {
    nav: { home: 'ಮುಖಪುಟ', catalog: 'ಪಟ್ಟಿ', ai_studio: 'ಎಐ ಸ್ಟುಡಿಯೋ', gallery: 'ಗ್ಯಾಲರಿ', contact: 'ಸಂಪರ್ಕ', orders: 'ಆರ್ಡರ್‌ಗಳು' },
    gallery: { tap_to_read: 'ಓದಲು ಟ್ಯಾಪ್ ಮಾಡಿ', transformation_stories: 'ರೂಪಾಂತರ ಕಥೆಗಳು', trending: 'ಟ್ರೆಂಡಿಂಗ್', views: 'ವೀಕ್ಷಣೆಗಳು', reviews: 'ವಿಮರ್ಶೆಗಳು' },
    contact: { get_in_touch: 'ನಮಗೆ ಸಂಪರ್ಕಿಸಿ', send_message: 'ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ', full_name: 'ಪೂರ್ಣ ಹೆಸರು', email: 'ಇಮೇಲ್ ವಿಳಾಸ', phone: 'ಫೋನ್ ಸಂಖ್ಯೆ', service_interested: 'ಆಸಕ್ತಿ ಸೇವೆ', consultation_type: 'ಸಾಲಹೆ ಪ್ರಕಾರ', online_consultation: 'ಆನ್‌ಲೈನ್ ಸಲಹೆ', in_person_visit: 'ವೈಯಕ್ತಿಕ ಭೇಟಿ', preferred_time: 'ಆಯ್ಕೆ ಸಮಯ', message_label: 'ಸಂದೇಶ', message_placeholder: 'ನಿಮ್ಮ ಅಗತ್ಯಗಳು, ಶೈಲಿ ಆದ್ಯತೆಗಳನ್ನು ಬರೆಯಿರಿ...', submit: 'ಸಂದೇಶ ಕಳುಹಿಸಿ', retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' }
  }}
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('digitailor_lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
