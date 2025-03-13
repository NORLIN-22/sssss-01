document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已加载sprite
    if (!document.querySelector('#svg-sprite-container')) {
        const spriteContainer = document.createElement('div');
        spriteContainer.id = 'svg-sprite-container';
        spriteContainer.style.display = 'none';
        
        // 添加调试信息
        console.log('正在尝试加载 SVG Sprite...');
        
        // 尝试多个可能的路径
        const possiblePaths = [
            'assets/sprite.svg',
            '/assets/sprite.svg',
            './assets/sprite.svg',
            '../assets/sprite.svg'
        ];
        
        // 尝试加载第一个路径
        loadSpriteFromPath(possiblePaths, 0);
        
        function loadSpriteFromPath(paths, index) {
            if (index >= paths.length) {
                console.error('所有路径都无法加载 SVG Sprite 文件');
                return;
            }
            
            const path = paths[index];
            console.log(`尝试从 ${path} 加载 SVG Sprite...`);
            
            const xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    console.log(`成功从 ${path} 加载 SVG Sprite`);
                    spriteContainer.innerHTML = xhr.responseText;
                    document.body.appendChild(spriteContainer);
                    
                    // 触发自定义事件
                    document.dispatchEvent(new CustomEvent('spriteLoaded'));
                } else {
                    console.warn(`路径 ${path} 失败，尝试下一个路径...`);
                    loadSpriteFromPath(paths, index + 1);
                }
            };
            xhr.onerror = function() {
                console.warn(`路径 ${path} 请求失败，尝试下一个路径...`);
                loadSpriteFromPath(paths, index + 1);
            };
            xhr.send();
        }
    }
    
    // 辅助函数：用于创建SVG图标元素
    window.createSvgIcon = function(iconId, className) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        
        if (className) {
            svg.setAttribute('class', className);
        }
        
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + iconId);
        svg.appendChild(use);
        
        return svg;
    };
});
