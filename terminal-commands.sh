cd "/Users/edy/Desktop/测试/版2/pages"

# 如果lianxi.html存在则重命名为contact.html
[ -f "lianxi.html" ] && mv lianxi.html contact.html

# 如果contact.html不存在则创建它
[ ! -f "contact.html" ] && cp about.html contact.html
