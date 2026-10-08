import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiGlobe } from "react-icons/fi";

const Footer = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <footer className="bg-gradient-to-br from-amber-950 to-black text-amber-100 py-16 mt-20 border-t border-amber-900/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

          {/* 1. Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                <span className="text-white font-bold text-2xl">DL</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter leading-none">
                  Abyssinia
                </h2>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mt-1">
                  Digital Learning Hub
                </p>
              </div>
            </div>
            <p className="text-amber-200/60 text-sm leading-relaxed max-w-xs">
              Empowering Ethiopia's future through accessible, high-quality digital education. Join our community of learners and educators.
            </p>
          </div>

          {/* 2. Copyright center*/}
          <div className="text-center space-y-6 md:mt-4">
            <div className="border-t border-amber-900/50 pt-6">
              <p className="text-sm font-medium text-amber-300">© 2026 Abyssinia DL. All Rights Reserved.</p>
              <p className="text-[10px] text-amber-500/50 mt-2 uppercase tracking-widest">
                Designed by Group 25 at CTBE section 2
              </p>
            </div>
          </div>

          {/* 3. Contact & Socials Right */}
          <div className="flex flex-col items-end space-y-6 text-right">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4">Contact Us</h3>
              <div className="space-y-3 text-sm text-amber-200/80">
                <p className="flex items-center justify-end gap-3 hover:text-amber-400 transition-colors">
                  support@abyssiniadl.com <FiMail className="text-amber-600" />
                </p>
                <p className="flex items-center justify-end gap-3 hover:text-amber-400 transition-colors">
                  +251 911 000 000 <FiPhone className="text-amber-600" />
                </p>
                <p className="flex items-center justify-end gap-3 hover:text-amber-400 transition-colors">
                  Addis Ababa, Ethiopia <FiMapPin className="text-amber-600" />
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <SocialIcon icon={<FiFacebook />} />
              <SocialIcon icon={<FiTwitter />} />
              <SocialIcon icon={<FiInstagram />} />
              <SocialIcon icon={<FiLinkedin />} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }) => (
  <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-amber-400 hover:bg-amber-600 hover:text-white transition-all transform hover:scale-110 border border-white/5 shadow-lg">
    {icon}
  </a>
);

export default Footer;
