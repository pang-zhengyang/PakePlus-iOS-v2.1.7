window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 缓存 base 标签状态（假设页面加载后不变）
const baseEl = document.querySelector('head base[target]');
const isBaseTargetBlank = baseEl && baseEl.target.toLowerCase() === '_blank';

// 安全 URL 校验
const isValidHttpUrl = (str) => {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

// 防重跳转锁
let isRedirecting = false;

const hookClick = (e) => {
    if (isRedirecting) return;

    const link = e.target.closest?.('a'); // 安全调用（兼容旧浏览器可去掉 ?）
    if (!link || !link.href) return;

    const shouldIntercept = 
        link.target === '_blank' || 
        (isBaseTargetBlank && link.target !== '_self');

    if (shouldIntercept && isValidHttpUrl(link.href)) {
        e.preventDefault();
        isRedirecting = true;
        location.href = link.href;
    }
};

// 拦截 window.open（严格模式）
const originalOpen = window.open;
window.open = function (url, target = '', features) {
    if ((target === '_blank' || !target) && typeof url === 'string' && isValidHttpUrl(url)) {
        location.href = url;
    } else {
        return originalOpen.call(window, url, target, features);
    }
};

// 绑定全局点击拦截
document.addEventListener('click', hookClick, { capture: true });