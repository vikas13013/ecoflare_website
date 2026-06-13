import React from "react";
import { FiX } from "react-icons/fi";
import {
  FaFacebook,
  FaTwitter,
  FaPinterestP,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  if (!isOpen) return null;

  const { t } = useTranslation();

  const productUrl = `${window.location.origin}/products/details/${productId}`;
  const shareText = `Check out ${productName} on EcoFlare!`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(productUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      productUrl
    )}&description=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + productUrl
    )}`,
  };

  const shareButtons = [
    { platform: "facebook", icon: FaFacebook, color: "bg-blue-50 text-blue-600" },
    { platform: "twitter", icon: FaTwitter, color: "bg-sky-50 text-sky-500" },
    { platform: "pinterest", icon: FaPinterestP, color: "bg-red-50 text-red-500" },
    { platform: "whatsapp", icon: FaWhatsapp, color: "bg-green-50 text-green-500" },
  ];

  const handleShare = (platform: string) => {
    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success(t("link_copied"));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 share-modal">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{t("share_this_product")}</h3>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {shareButtons.map(({ platform, icon: Icon, color }) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className="flex flex-col items-center p-4 rounded-xl hover:bg-opacity-80 transition-colors"
            >
              <div className={`${color} p-3 rounded-full mb-2`}>
                <Icon size={20} />
              </div>
              <span className="text-sm capitalize">{platform}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={productUrl}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 whitespace-nowrap"
          >
            {t("copy_link")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;