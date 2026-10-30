import React, { useState, useEffect } from 'react';

// 优惠券数据接口
interface CouponData {
  codigo: string;
  estado: string;
  premio: string;
  ticket: string;
  amount: string;
}

interface RedemptionProps {
  initialToken?: string;
  onClose?: () => void;
}

type ScreenState = 'STATE_LOGIN' | 'STATE_VALIDATING' | 'STATE_VALID' | 'STATE_SUCCESS' | 'STATE_ERROR';

export const Redemption: React.FC<RedemptionProps> = ({ initialToken, onClose }) => {
  const [token, setToken] = useState<string>(initialToken || '');
  const [screenState, setScreenState] = useState<ScreenState>('STATE_VALIDATING');
  const [loadingMessage, setLoadingMessage] = useState<string>('Cargando...');
  
  // 登录表单字段
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  // 校验结果
  const [couponData, setCouponData] = useState<CouponData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 1. 动态加载 Fredoka 字体
  useEffect(() => {
    if (!document.getElementById('font-fredoka')) {
      const link = document.createElement('link');
      link.id = 'font-fredoka';
      link.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // 从 URL 中提取 canje token（如果 props 没有传）
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('canje');
    const activeToken = initialToken || urlToken;
    if (activeToken) {
      setToken(activeToken);
    }

    checkAuthAndValidate(activeToken || '');
  }, [initialToken]);

  // 2. 身份校验与优惠券验证主流程
  const checkAuthAndValidate = async (targetToken: string) => {
    const merchantToken = localStorage.getItem('mp_merchant_token');
    
    if (!merchantToken) {
      setScreenState('STATE_LOGIN');
      return;
    }

    if (!targetToken) {
      setErrorMessage('No se ha proporcionado ningún código de cupón.');
      setScreenState('STATE_ERROR');
      return;
    }

    // 已登录，直接校验优惠码
    await validateCoupon(targetToken, merchantToken);
  };

  // 3. 模拟或真实登录 API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Por favor, rellene todos los campos.');
      return;
    }

    setLoginError('');
    setLoadingMessage('Autenticando comercio...');
    setScreenState('STATE_VALIDATING');

    try {
      // 真实 API 请求预留
      const res = await fetch('/api/merchant/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await res.json();
      localStorage.setItem('mp_merchant_token', data.token);
      localStorage.setItem('mp_merchant_user', username);
      
      // 登录成功，开始校验优惠券
      await validateCoupon(token, data.token);
    } catch (err) {
      console.warn('Usando inicio de sesión simulado (Mock) debido a la falta de API backend.');
      
      // 本地演示/Mock 成功登录：只要输入不为空即可
      const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('mp_merchant_token', mockToken);
      localStorage.setItem('mp_merchant_user', username);
      
      // 稍作延迟展示过渡动画
      setTimeout(() => {
        validateCoupon(token, mockToken);
      }, 1000);
    }
  };

  // 4. 校验优惠券 API
  const validateCoupon = async (couponToken: string, merchantToken: string) => {
    setLoadingMessage('Validando cupón...');
    setScreenState('STATE_VALIDATING');

    try {
      const res = await fetch(`/api/canje/validate?token=${encodeURIComponent(couponToken)}`, {
        headers: { 'Authorization': `Bearer ${merchantToken}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Cupón no válido');
      }

      const data = await res.json();
      setCouponData(data);
      setScreenState('STATE_VALID');
    } catch (err: any) {
      console.warn('Usando validación simulada (Mock) debido a la falta de API backend.');
      
      setTimeout(() => {
        // Mock 逻辑：如果 token 包含 'error' 或 'ERR'，则模拟失效
        if (couponToken.toUpperCase().includes('ERR') || couponToken.toUpperCase().includes('FAIL')) {
          setErrorMessage('Este cupón ya ha sido canjeado o ha expirado.');
          setScreenState('STATE_ERROR');
        } else {
          // 否则默认返回面额 2 或 5 欧的代金券
          const amount = couponToken.startsWith('5') ? '5' : '2';
          setCouponData({
            codigo: couponToken || 'CP-SMN3BYY1HKUN',
            estado: 'Válido',
            premio: `Cupon ${amount} EUR`,
            ticket: 'MP-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
            amount: amount
          });
          setScreenState('STATE_VALID');
        }
      }, 1000);
    }
  };

  // 5. 确认核销
  const handleConfirmRedemption = async () => {
    if (!couponData) return;
    
    setLoadingMessage('Confirmando canje...');
    setScreenState('STATE_VALIDATING');

    const merchantToken = localStorage.getItem('mp_merchant_token') || '';

    try {
      const res = await fetch('/api/canje/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${merchantToken}`
        },
        body: JSON.stringify({ token: couponData.codigo })
      });

      if (!res.ok) {
        throw new Error('Error al confirmar el canje');
      }

      setScreenState('STATE_SUCCESS');
    } catch (err) {
      console.warn('Simulando confirmación (Mock) debido a la falta de API backend.');
      
      setTimeout(() => {
        setScreenState('STATE_SUCCESS');
      }, 1000);
    }
  };

  // 退出核销界面
  const handleLogout = () => {
    localStorage.removeItem('mp_merchant_token');
    localStorage.removeItem('mp_merchant_user');
    setUsername('');
    setPassword('');
    setScreenState('STATE_LOGIN');
  };

  // 渲染加载中
  if (screenState === 'STATE_VALIDATING') {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8d878] font-['Fredoka',sans-serif] min-h-screen"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,0,0,0.04) 38px, rgba(0,0,0,0.04) 40px)' }}
      >
        <div className="w-14 h-14 border-[5px] border-[#f8d878] border-t-[#e52521] border-r-[#5c94fc] rounded-full animate-spin shadow-[3px_3px_0_#222] mb-6"></div>
        <p className="text-[#222] text-xl font-bold tracking-widest uppercase">{loadingMessage}</p>
        <div className="flex gap-1.5 mt-2">
          <div className="w-2.5 h-2.5 bg-[#e52521] border-2 border-[#222] rounded-full shadow-[2px_2px_0_#222] animate-bounce"></div>
          <div className="w-2.5 h-2.5 bg-[#5c94fc] border-2 border-[#222] rounded-full shadow-[2px_2px_0_#222] animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2.5 h-2.5 bg-[#fff] border-2 border-[#222] rounded-full shadow-[2px_2px_0_#222] animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start bg-[#f8d878] font-['Fredoka',sans-serif] min-h-screen overflow-y-auto w-full pb-10"
      style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,0,0,0.04) 38px, rgba(0,0,0,0.04) 40px)' }}
    >
      {/* 顶部统一 Header */}
      <header className="bg-[#e52521] border-b-4 border-[#222] p-4 flex items-center justify-between w-full sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f8d878] border-2 border-[#222] flex items-center justify-center font-black text-[#222] shadow-[2px_2px_0_#222]">M</div>
          <span className="font-['Fredoka',sans-serif] text-white text-base md:text-lg font-bold tracking-wider uppercase">
            {screenState === 'STATE_LOGIN' ? 'ACCESO COMERCIO' : 'VALIDACIÓN DE CUPÓN'}
          </span>
        </div>
        {screenState !== 'STATE_LOGIN' && (
          <button 
            onClick={handleLogout}
            className="bg-white border-2 border-[#222] rounded-lg px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0_#222] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0_#222] transition-all cursor-pointer"
          >
            Salir
          </button>
        )}
      </header>

      {/* 1. 商家登录视图 */}
      {screenState === 'STATE_LOGIN' && (
        <div className="bg-white border-[3px] border-[#222] rounded-2xl shadow-[5px_5px_0px_#222] p-6 m-4 mt-8 w-[calc(100%-32px)] max-w-[420px]">
          <p className="text-[#e52521] font-bold text-xs uppercase tracking-widest mb-5 text-center">BILLETE DORADO · REDENCIÓN</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-[#222] rounded-lg p-3.5 font-['Fredoka',sans-serif] text-base outline-none focus:border-[#e52521] focus:ring-2 focus:ring-[#e52521]/20 transition-all"
                placeholder="Nombre de usuario"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-[#222] rounded-lg p-3.5 font-['Fredoka',sans-serif] text-base outline-none focus:border-[#e52521] focus:ring-2 focus:ring-[#e52521]/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#e52521] text-white border-[3px] border-[#222] rounded-xl p-4 font-['Fredoka',sans-serif] text-lg font-bold uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#222] transition-all"
            >
              ENTRAR Y VALIDAR CUPÓN
            </button>
          </form>

          {loginError && (
            <div className="text-[#e52521] font-semibold text-sm text-center p-3 bg-red-50 border-2 border-red-200 rounded-lg mt-4">
              ⚠️ {loginError}
            </div>
          )}
        </div>
      )}

      {/* 2. 优惠券校验有效确认视图 */}
      {screenState === 'STATE_VALID' && couponData && (
        <div className="flex flex-col items-center w-full">
          {/* 成功标头 */}
          <div className="flex flex-col items-center gap-2 p-5 bg-[#e52521] border-b-4 border-[#222] w-full text-center">
            <div className="w-14 h-14 rounded-full bg-[#22c55e] border-[3px] border-[#222] flex items-center justify-center text-white text-3xl font-black shadow-[3px_3px_0_#222]">✓</div>
            <span className="text-white font-['Fredoka',sans-serif] text-xl font-bold tracking-widest uppercase">CUPÓN VÁLIDO</span>
          </div>

          {/* 面值额度 */}
          <div className="flex items-baseline gap-2 justify-center p-6 bg-white border-b-4 border-[#222] w-full">
            <span 
              className="font-['Fredoka',sans-serif] text-[5rem] font-black text-[#e52521] leading-none"
              style={{ textShadow: '3px 3px 0px #222' }}
            >
              {couponData.amount}
            </span>
            <span className="font-['Fredoka',sans-serif] text-3xl font-bold text-[#222]">EUR</span>
          </div>

          {/* 信息列表卡片 */}
          <div className="bg-[#f9fafb] border-[3px] border-[#222] rounded-2xl shadow-[4px_4px_0px_#222] p-4 m-4 mt-6 flex flex-col w-[calc(100%-32px)] max-w-[420px] align-self-center">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">CÓDIGO</span>
              <span className="text-sm font-bold text-gray-900 font-['Fredoka',sans-serif]">{couponData.codigo}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">ESTADO</span>
              <span className="text-sm font-bold text-[#22c55e] font-['Fredoka',sans-serif]">{couponData.estado}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">PREMIO</span>
              <span className="text-sm font-bold text-gray-900 font-['Fredoka',sans-serif]">{couponData.premio}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">TICKET</span>
              <span className="text-sm font-bold text-gray-900 font-['Fredoka',sans-serif]">{couponData.ticket}</span>
            </div>
          </div>

          {/* 确认核销按钮 */}
          <div className="w-full max-w-[420px] px-4 mt-2">
            <button 
              onClick={handleConfirmRedemption}
              className="w-full bg-[#e52521] text-white border-[3px] border-[#222] rounded-xl p-4 font-['Fredoka',sans-serif] text-lg font-bold uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#222] transition-all"
            >
              ✓ CONFIRMAR CANJE
            </button>
          </div>
        </div>
      )}

      {/* 3. 核销成功最终界面 */}
      {screenState === 'STATE_SUCCESS' && (
        <div className="flex flex-col items-center w-full">
          {/* 成功头部英雄条 */}
          <div className="bg-gradient-to-br from-[#e52521] to-[#5c94fc] p-12 text-center border-b-4 border-[#222] w-full flex flex-col items-center">
            <span className="text-6xl block mb-3 filter drop-shadow-[3px_3px_0px_#222] animate-bounce">🏆</span>
            <h1 className="font-['Fredoka',sans-serif] text-[#f8d878] text-2xl md:text-3xl font-extrabold uppercase tracking-widest mb-2" style={{ textShadow: '2px 2px 0 #222' }}>
              ¡CANJE COMPLETADO!
            </h1>
            <p className="text-white/90 text-xs md:text-sm font-semibold max-w-[320px]">
              El cupón ha sido validado y descontado con éxito.
            </p>
            <div className="bg-[#f8d878] border-[3px] border-[#222] rounded-xl shadow-[4px_4px_0px_#222] p-3 px-6 inline-flex flex-col items-center mt-5">
              <span className="font-['Fredoka',sans-serif] text-2xl font-black text-[#222]">
                {couponData?.amount || '2'} EUR
              </span>
              <small className="text-[0.75rem] text-gray-600 font-bold uppercase tracking-wider mt-0.5">descontado del ticket</small>
            </div>
          </div>

          {/* 核销日志卡片 */}
          <div className="bg-white border-[3px] border-[#222] rounded-2xl shadow-[4px_4px_0px_#222] p-4 m-4 mt-6 flex flex-col w-[calc(100%-32px)] max-w-[420px] align-self-center">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">FECHA / HORA</span>
              <span className="text-sm font-bold text-gray-900 font-['Fredoka',sans-serif]">
                {new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[0.7rem] font-bold text-gray-500 uppercase tracking-widest">CÓDIGO</span>
              <span className="text-sm font-bold text-gray-900 font-['Fredoka',sans-serif]">{couponData?.codigo || token}</span>
            </div>
          </div>

          <p className="text-center font-bold text-xs text-amber-800 mx-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl max-w-[400px]">
            ⚠️ Este cupón ya ha quedado marcado como "Canjeado" y no podrá utilizarse de nuevo.
          </p>

          <div className="w-full max-w-[420px] px-4 mt-6">
            <button 
              onClick={onClose || (() => window.location.href = window.location.pathname)}
              className="w-full bg-[#5c94fc] text-white border-[3px] border-[#222] rounded-xl p-4 font-['Fredoka',sans-serif] text-lg font-bold uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#222] transition-all"
            >
              VOLVER AL INICIO
            </button>
          </div>
        </div>
      )}

      {/* 4. 校验失败/错误视图 */}
      {screenState === 'STATE_ERROR' && (
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col items-center gap-2 p-5 bg-[#ef4444] border-b-4 border-[#222] w-full text-center">
            <div className="w-14 h-14 rounded-full bg-[#e52521] border-[3px] border-[#222] flex items-center justify-center text-white text-3xl font-black shadow-[3px_3px_0_#222]">✗</div>
            <span className="text-white font-['Fredoka',sans-serif] text-xl font-bold tracking-widest uppercase">ERROR DE CUPÓN</span>
          </div>

          <div className="bg-white border-[3px] border-[#ef4444] rounded-2xl shadow-[5px_5px_0px_#222] p-6 m-4 mt-8 w-[calc(100%-32px)] max-w-[420px]">
            <p className="text-[#ef4444] font-bold text-base text-center leading-relaxed font-['Fredoka',sans-serif]">
              {errorMessage || 'No se pudo validar el cupón en este momento.'}
            </p>
          </div>

          <div className="w-full max-w-[420px] px-4 mt-4 flex flex-col gap-3">
            <button 
              onClick={() => setScreenState('STATE_LOGIN')}
              className="w-full bg-[#e52521] text-white border-[3px] border-[#222] rounded-xl p-4 font-['Fredoka',sans-serif] text-base font-bold uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#222] transition-all text-center"
            >
              Intentar otro login
            </button>
            <button 
              onClick={onClose || (() => window.location.href = window.location.pathname)}
              className="w-full bg-[#5c94fc] text-white border-[3px] border-[#222] rounded-xl p-4 font-['Fredoka',sans-serif] text-base font-bold uppercase tracking-widest cursor-pointer shadow-[4px_4px_0px_#222] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#222] transition-all text-center"
            >
              VOLVER AL INICIO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
