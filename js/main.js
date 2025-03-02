document.body.classList.add('preload');

// 配置常量
const CONFIG = {
    SCALE: 1.05,
    ROTATE_MULTIPLIER: {
        DESKTOP: 4,
        MOBILE: 2
    },
    TRANSITION: {
        DURATION: 600,
        TIMING: 'cubic-bezier(0.23, 1, 0.32, 1)'
    }
};

// 核心功能类
class CardEffect {
    constructor(cardElement) {
        this.card = cardElement;
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('load', () => {
            document.body.classList.remove('preload');
            this.updateSize();
        });

        window.addEventListener('resize', this.updateSize.bind(this));
        document.addEventListener('mousemove', this.handle3DEffect.bind(this));
        document.addEventListener('mouseleave', this.reset3DEffect.bind(this));
    }

    updateSize() {
        requestAnimationFrame(() => {
            this.card.style.transform = `scale(${CONFIG.SCALE})`;
        });
    }

    handle3DEffect(e) {
        // 在移动端禁用3D效果
        if (window.innerWidth <= 768) {
            return;
        }
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const rotateMultiplier = innerWidth <= 768 ? CONFIG.ROTATE_MULTIPLIER.MOBILE : CONFIG.ROTATE_MULTIPLIER.DESKTOP;
        const rotateY = (clientX / innerWidth - 0.5) * rotateMultiplier;
        const rotateX = (clientY / innerHeight - 0.5) * -rotateMultiplier;
        
        requestAnimationFrame(() => {
            if (this.card) {
                this.card.style.transform = `
                    perspective(1500px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(${CONFIG.SCALE})
                `;
            }
        });
    }

    reset3DEffect() {
        if (this.card) {
            this.card.style.transition = `transform ${CONFIG.TRANSITION.DURATION}ms ${CONFIG.TRANSITION.TIMING}`;
            this.card.style.transform = `
                perspective(1500px)
                rotateX(0deg)
                rotateY(0deg)
                scale(${CONFIG.SCALE})
            `;
            setTimeout(() => this.card.style.transition = '', CONFIG.TRANSITION.DURATION);
        }
    }
}

// 添加节流函数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 修改滚动检测函数
function handleScroll() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelector('.nav-links');
    const scrollPosition = window.scrollY;
    const heroSection = document.querySelector('.hero-section');
    const contentArea = document.querySelector('.content-area');
    
    if (heroSection && contentArea) {
        const heroSectionHeight = heroSection.offsetHeight;
        const contentAreaTop = contentArea.offsetTop;
        const contentAreaBottom = contentAreaTop + contentArea.offsetHeight;
        
        if (scrollPosition >= heroSectionHeight && scrollPosition < contentAreaBottom) {
            navMenu.classList.add('in-white-section');
            navLinks.classList.add('in-white-section');
        } else {
            navMenu.classList.remove('in-white-section');
            navLinks.classList.remove('in-white-section');
        }
    }
}

// 修改颜色检测函数
function detectBackgroundColor() {
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelector('.nav-links');
    const contentArea = document.querySelector('.content-area');
    const navMenuRect = navMenu.getBoundingClientRect();
    const contentAreaRect = contentArea.getBoundingClientRect();

    // 计算圆角矩形区域的顶部（包括圆角部分）
    const contentAreaTop = contentAreaRect.top - 30; // 30px 是圆角的高度

    // 检查是否在白色区域（包括圆角部分）
    if (contentAreaTop < navMenuRect.bottom) {
        navMenu.classList.add('in-white-section');
        navLinks.classList.add('in-white-section');
    } else {
        navMenu.classList.remove('in-white-section');
        navLinks.classList.remove('in-white-section');
    }
}

// 添加白色区域高度控制函数
function updateContentArea(startPosition = '100vh', height = '100vh') {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
        contentArea.style.setProperty('--content-start', startPosition);
        contentArea.style.setProperty('--content-height', height);
    }
}

// 使用示例：
// updateContentArea('80vh', '120vh'); // 调整开始位置和高度
// updateContentArea(undefined, '150vh'); // 只调整高度

// 使用节流函数包装滚动处理
const throttledScroll = throttle(handleScroll, 250); // 增加到250ms
const throttledColorDetect = throttle(detectBackgroundColor, 250);

// 更新事件监听器
window.addEventListener('scroll', throttledScroll);
window.addEventListener('scroll', throttledColorDetect);
window.addEventListener('load', () => {
    handleScroll();
    detectBackgroundColor();
});

// 添加页面位置记录和恢复功能
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        // 刷新页面后立即检测背景颜色
        detectBackgroundColor();
        handleScroll();
    }
});

// 添加滚动动画观察器
function initScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 只触发一次动画
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // 当元素15%进入视口时触发
    });

    sections.forEach(section => observer.observe(section));
}

// 初始化游戏图标动画
function initGameIconAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.game-item-content').forEach(container => {
        observer.observe(container);
    });
}

// 复制功能
function copyToClipboard(text) {
    // 创建临时输入框
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    
    // 选择并复制
    input.select();
    document.execCommand('copy');
    
    // 移除临时输入框
    document.body.removeChild(input);
    
    // 显示提示
    showCopyTooltip();
}

// 提示动画
function showCopyTooltip() {
    const tooltip = document.createElement('div');
    tooltip.textContent = '复制成功！';
    tooltip.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(56, 124, 232, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(tooltip);
    
    // 2秒后移除提示
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => document.body.removeChild(tooltip), 300);
    }, 2000);
}

// 添加点击事件监听器
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', function() {
        const text = this.querySelector('span').textContent;
        let copyText = '';
        
        // 根据图标类型确定要复制的内容
        if (text.includes('131-4706-3894')) {
            copyText = '13147063894';
        } else if (text.includes('@')) {
            copyText = '2216921192@qq.com';
        } else if (text.includes('norlin')) {
            copyText = 'norlin2216';
        }
        
        if (copyText) {
            copyToClipboard(copyText);
        }
    });

    // 添加鼠标样式
    item.style.cursor = 'pointer';
});

// 优化导航栏颜色切换检测
function updateNavigation() {
    const nav = document.querySelector('.nav-menu');
    const contentArea = document.querySelector('.content-area');
    const heroSection = document.querySelector('.hero-section');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // 获取内容区域的位置信息
    const contentRect = contentArea.getBoundingClientRect();
    const heroRect = heroSection.getBoundingClientRect();
    
    // 设置一个偏移量，让过渡更早开始
    const offset = 50;
    
    // 检查是否接近内容区域
    if (contentRect.top - offset <= nav.offsetHeight) {
        nav.classList.add('in-white-section');
    } else if (heroRect.bottom - offset > nav.offsetHeight) {
        nav.classList.remove('in-white-section');
    }
}

// 使用节流函数包装updateNavigation
const throttledUpdateNavigation = throttle(updateNavigation, 10);

// 添加滚动监听
window.addEventListener('scroll', throttledUpdateNavigation);
window.addEventListener('resize', throttledUpdateNavigation);

// 确保页面加载时也执行一次检查
document.addEventListener('DOMContentLoaded', updateNavigation);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    const card = new CardEffect(document.querySelector('.fullscreen-card'));
    initScrollAnimations();
    initGameIconAnimations();
});