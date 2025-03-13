#!/bin/bash
mkdir -p assets/svg/optimized/{home,projects,games,experience}

# 优化主页SVG
svgo -f assets/svg/home/ -o assets/svg/optimized/home/

# 优化项目SVG
svgo -f assets/svg/home/projects/ -o assets/svg/optimized/projects/

# 优化游戏SVG
svgo -f assets/svg/home/games/ -o assets/svg/optimized/games/

# 优化经验SVG
svgo -f assets/svg/home/experience/ -o assets/svg/optimized/experience/

echo "SVG优化完成！"

