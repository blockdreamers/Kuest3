import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Globe, MessageCircle, Send, Twitter, ExternalLink, Mail, Check } from 'lucide-react';

const exchanges = [
  { id: 'binance', name: 'Binance', logo: 'https://assets.coingecko.com/markets/images/52/small/binance.jpg?1519353250' },
  { id: 'okx', name: 'OKX', logo: 'https://assets.coingecko.com/markets/images/96/small/okx.jpeg?1669701786' },
  { id: 'kucoin', name: 'KuCoin', logo: 'https://assets.coingecko.com/markets/images/61/small/kucoin.png?1640584259' },
  { id: 'bybit', name: 'Bybit', logo: 'https://assets.coingecko.com/markets/images/698/small/bybit_spot.png?1646064509' },
  { id: 'gate', name: 'Gate.io', logo: 'https://assets.coingecko.com/markets/images/60/small/gate_io_logo.jpg?1519208841' },
  { id: 'mexc', name: 'MEXC', logo: 'https://assets.coingecko.com/markets/images/405/small/mexc.jpeg?1675237989' }
];

const ListingApplication = () => {
  const [formData, setFormData] = useState({
    logo: '',
    projectNameKo: '',
    projectNameEn: '',
    ticker: '',
    totalSupply: '',
    circulatingSupply: '',
    listedExchanges: [] as string[],
    coingeckoUrl: '',
    coinmarketcapUrl: '',
    websiteUrl: '',
    discordUrl: '',
    telegramUrl: '',
    redditUrl: '',
    email: '',
    recaptcha: false
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setFormData(prev => ({ ...prev, logo: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleExchange = (exchangeId: string) => {
    setFormData(prev => ({
      ...prev,
      listedExchanges: prev.listedExchanges.includes(exchangeId)
        ? prev.listedExchanges.filter(id => id !== exchangeId)
        : [...prev.listedExchanges, exchangeId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">코인 리스팅 신청</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              코인 로고 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>로고 이미지 파일 권장사항:</p>
                <p>- PNG 포맷</p>
                <p>- 600*600px</p>
              </div>
            </div>
          </div>

          {/* Project Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="projectNameKo" className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 (국문) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectNameKo"
                name="projectNameKo"
                value={formData.projectNameKo}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="projectNameEn" className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 (영문) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectNameEn"
                name="projectNameEn"
                value={formData.projectNameEn}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Token Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-2">
                코인티커 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 mb-2">
                총 발행량 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="totalSupply"
                name="totalSupply"
                value={formData.totalSupply}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="circulatingSupply" className="block text-sm font-medium text-gray-700 mb-2">
                유통량 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="circulatingSupply"
                name="circulatingSupply"
                value={formData.circulatingSupply}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Listed Exchanges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상장된 거래소 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {exchanges.map(exchange => (
                <button
                  key={exchange.id}
                  type="button"
                  onClick={() => toggleExchange(exchange.id)}
                  className={`relative p-4 border rounded-lg transition-all duration-200 ${
                    formData.listedExchanges.includes(exchange.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {formData.listedExchanges.includes(exchange.id) && (
                    <div className="absolute top-1 right-1">
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                  <img src={exchange.logo} alt={exchange.name} className="w-full h-auto rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="coinmarketcapUrl" className="block text-sm font-medium text-gray-700 mb-2">
                CoinMarketCap URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="url"
                  id="coinmarketcapUrl"
                  name="coinmarketcapUrl"
                  value={formData.coinmarketcapUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <ExternalLink className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </div>
            <div>
              <label htmlFor="coingeckoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                CoinGecko URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="url"
                  id="coingeckoUrl"
                  name="coingeckoUrl"
                  value={formData.coingeckoUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <ExternalLink className="w-5 h-5 text-gray-400 ml-2" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                웹사이트 URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-gray-400 absolute ml-3" />
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="discordUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Discord URL
              </label>
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 text-gray-400 absolute ml-3" />
                <input
                  type="url"
                  id="discordUrl"
                  name="discordUrl"
                  value={formData.discordUrl}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="telegramUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Telegram URL
              </label>
              <div className="flex items-center">
                <Send className="w-5 h-5 text-gray-400 absolute ml-3" />
                <input
                  type="url"
                  id="telegramUrl"
                  name="telegramUrl"
                  value={formData.telegramUrl}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="redditUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Reddit URL
              </label>
              <div className="flex items-center">
                <Twitter className="w-5 h-5 text-gray-400 absolute ml-3" />
                <input
                  type="url"
                  id="redditUrl"
                  name="redditUrl"
                  value={formData.redditUrl}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 absolute ml-3" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* reCAPTCHA */}
          <div className="flex items-center justify-center py-4">
            <div className="g-recaptcha" data-sitekey="your-recaptcha-site-key"></div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              리스팅 신청하기
            </button>
          </div>
        </form>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
          <Check className="w-5 h-5" />
          <span>리스팅 신청이 완료되었습니다!</span>
        </div>
      )}
    </div>
  );
};

export default ListingApplication;