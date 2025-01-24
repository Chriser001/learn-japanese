       const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const romajiDisplay = document.getElementById('romaji');
        const kanaHistoryDisplay = document.getElementById('kana-history');
        const settingsIcon = document.getElementById('settings-icon');
        const settingsMenu = document.getElementById('settings-menu');
        const practiceTypeSelect = document.getElementById('practice-type');
        const learningModeCheckbox = document.getElementById('learning-mode');
        const kanaGroupsContainer = document.getElementById('kana-groups-container');
        const opacityInput = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacity-value');
        const colorInput = document.getElementById('color');
        const speakCheckbox = document.getElementById('speak');
        const fontSelect = document.getElementById('font-select');

        // 田字格的大小
        const gridSize = 200;
        const cellSize = gridSize / 2;

        // 平假名和片假名数组
        const hiragana = [
            'あ', 'い', 'う', 'え', 'お',
            'か', 'き', 'く', 'け', 'こ',
            'さ', 'し', 'す', 'せ', 'そ',
            'た', 'ち', 'つ', 'て', 'と',
            'な', 'に', 'ぬ', 'ね', 'の',
            'は', 'ひ', 'ふ', 'へ', 'ほ',
            'ま', 'み', 'む', 'め', 'も',
            'や', 'ゆ', 'よ',
            'ら', 'り', 'る', 'れ', 'ろ',
            'わ', 'を', 'ん'
        ];
        const katakana = [
            'ア', 'イ', 'ウ', 'エ', 'オ',
            'カ', 'キ', 'ク', 'ケ', 'コ',
            'サ', 'シ', 'ス', 'セ', 'ソ',
            'タ', 'チ', 'ツ', 'テ', 'ト',
            'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
            'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
            'マ', 'ミ', 'ム', 'メ', 'モ',
            'ヤ', 'ユ', 'ヨ',
            'ラ', 'リ', 'ル', 'レ', 'ロ',
            'ワ', 'ヲ', 'ン'
        ];

        // 平假名和片假名对应的罗马音
        const romaji = {
            'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
            'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
            'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
            'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
            'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
            'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
            'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
            'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
            'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
            'わ': 'wa', 'を': 'wo', 'ん': 'n',
            'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
            'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
            'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
            'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
            'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
            'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
            'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
            'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
            'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
            'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n'
        };

        // 假名分组
        const kanaGroups = {
            'あ行': ['あ', 'い', 'う', 'え', 'お'],
            'か行': ['か', 'き', 'く', 'け', 'こ'],
            'さ行': ['さ', 'し', 'す', 'せ', 'そ'],
            'た行': ['た', 'ち', 'つ', 'て', 'と'],
            'な行': ['な', 'に', 'ぬ', 'ね', 'の'],
            'は行': ['は', 'ひ', 'ふ', 'へ', 'ほ'],
            'ま行': ['ま', 'み', 'む', 'め', 'も'],
            'や行': ['や', 'ゆ', 'よ'],
            'ら行': ['ら', 'り', 'る', 'れ', 'ろ'],
            'わ行': ['わ', 'を', 'ん'],
            'ア行': ['ア', 'イ', 'ウ', 'エ', 'オ'],
            'カ行': ['カ', 'キ', 'ク', 'ケ', 'コ'],
            'サ行': ['サ', 'シ', 'ス', 'セ', 'ソ'],
            'タ行': ['タ', 'チ', 'ツ', 'テ', 'ト'],
            'ナ行': ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
            'ハ行': ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
            'マ行': ['マ', 'ミ', 'ム', 'メ', 'モ'],
            'ヤ行': ['ヤ', 'ユ', 'ヨ'],
            'ラ行': ['ラ', 'リ', 'ル', 'レ', 'ロ'],
            'ワ行': ['ワ', 'ヲ', 'ン']
        };

        // 当前显示的假名
        let currentKana = '';

        // 假名透明度（默认20%）
        let kanaOpacity = 0.2;

        // 假名颜色（默认黑色）
        let kanaColor = '#000000';

        // 记录最后 10 个假名
        let kanaHistory = [];

        // 所有假名数组
        let allKana = [...hiragana, ...katakana];

        // 打乱数组顺序（Fisher-Yates 算法）
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // 打乱后的假名数组
        let shuffledKana = shuffleArray(allKana);

        // 当前假名索引
        let currentIndex = 0;

        // 设置历史记录最大长度
        let maxHistoryLength = window.innerHeight > window.innerWidth ? 5 : 10;

        // 检测设备方向并设置历史记录长度
        function setMaxHistoryLength() {
            maxHistoryLength = window.innerHeight > window.innerWidth ? 5 : 10;
            // 如果当前历史记录超过新的最大长度，则裁剪
            while (kanaHistory.length > maxHistoryLength) {
                kanaHistory.shift();
            }
            // 更新显示
            kanaHistoryDisplay.innerHTML = kanaHistory
                .map(k => `<span class="kana-block" onclick="speakKana('${k}')">${k}</span>`)
                .join('');
        }

        // 页面加载时设置历史记录长度
        document.addEventListener('DOMContentLoaded', setMaxHistoryLength);

        // 更新假名记录
        function updateKanaHistory(kana) {
            kanaHistory.push(kana);
            if (kanaHistory.length > maxHistoryLength) {
                kanaHistory.shift();
            }
            
            kanaHistoryDisplay.innerHTML = kanaHistory
                .map(k => `<span class="kana-block" data-kana="${k}">${k}</span>`)
                .join('');

            // 为每个假名块添加事件监听
            document.querySelectorAll('.kana-block').forEach(block => {
                block.addEventListener('mouseenter', showRomajiTooltip);
                block.addEventListener('mouseleave', hideRomajiTooltip);
                block.addEventListener('touchstart', handleTouch);
                // 添加点击事件监听器播放语音
                block.addEventListener('click', (e) => {
                    const kana = e.target.dataset.kana;
                    speakKana(kana);
                });
            });
        }
        // 显示罗马音气泡
        function showRomajiTooltip(e) {
            const kana = e.target.dataset.kana;
            const romajiText = romaji[kana];
            
            // 移除已存在的气泡
            const existingTooltip = document.querySelector('.romaji-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // 创建新气泡
            const tooltip = document.createElement('div');
            tooltip.className = 'romaji-tooltip';
            tooltip.textContent = romajiText;
            document.body.appendChild(tooltip);

            // 计算位置
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

            // 显示气泡
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });

            // 1秒后自动隐藏
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }, 1000);
        }

        function hideRomajiTooltip() {
            const tooltip = document.querySelector('.romaji-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            }
        }

        function handleTouch(e) {
            e.preventDefault();
            showRomajiTooltip(e);
        }

        // 朗读假名
        // 语音合成队列
        let speechQueue = [];
        let isSpeaking = false;

        // 朗读假名
           // 初始化语音合成
           let voices = [];
        let japaneseVoice = null;

        // 等待语音加载
        function loadVoices() {
            return new Promise((resolve) => {
                voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    resolve();
                } else {
                    speechSynthesis.addEventListener('voiceschanged', () => {
                        voices = speechSynthesis.getVoices();
                        resolve();
                    }, { once: true });
                }
            });
        }

        // 获取日语语音
        async function initJapaneseVoice() {
            await loadVoices();
            japaneseVoice = voices.find(voice => voice.lang.includes('ja'));
        }

        // 朗读假名
        async function speakKana(kana) {
            if (!speakCheckbox.checked || !('speechSynthesis' in window)) return;

            try {
                // 确保已加载日语语音
                if (!japaneseVoice) {
                    await initJapaneseVoice();
                }

                // 取消之前的语音
                speechSynthesis.cancel();

                // 创建新的语音实例
                const utterance = new SpeechSynthesisUtterance(kana);
                utterance.voice = japaneseVoice;
                utterance.lang = 'ja-JP';
                utterance.rate = 0.8;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                // 使用 Promise 包装语音播放
                await new Promise((resolve, reject) => {
                    utterance.onend = resolve;
                    utterance.onerror = reject;
                    speechSynthesis.speak(utterance);//支援Safari的关键所在？
                });
            } catch (error) {
                console.error('语音合成错误:', error);
            }
        }

        // 绘制田字格
        function drawGrid() {
            ctx.strokeStyle = '#ffb3b3'; // 浅红色
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]); // 设置虚线样式，5像素线段，5像素间隔

            // 绘制外框
            ctx.strokeRect(0, 0, gridSize, gridSize);

            // 绘制横线
            ctx.beginPath();
            ctx.moveTo(0, cellSize);
            ctx.lineTo(gridSize, cellSize);
            ctx.stroke();

            // 绘制竖线
            ctx.beginPath();
            ctx.moveTo(cellSize, 0);
            ctx.lineTo(cellSize, gridSize);
            ctx.stroke();

            // 重置虚线样式
            ctx.setLineDash([]);
        }

        // 绘制假名
        function drawKana(kana) {
            const selectedFont = fontSelect.value; // 获取用户选择的字体
            ctx.font = `200 150px "${selectedFont}", sans-serif`; // 使用用户选择的字体
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(${parseInt(kanaColor.slice(1, 3), 16)}, ${parseInt(kanaColor.slice(3, 5), 16)}, ${parseInt(kanaColor.slice(5, 7), 16)}, ${kanaOpacity})`;
            ctx.fillText(kana, gridSize / 2, gridSize / 2);
        }

        // 显示罗马音
        function displayRomaji(kana) {
            romajiDisplay.textContent = romaji[kana] || '';
        }

        // 初始化画板
        function init() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            drawGrid();
            currentKana = shuffledKana[currentIndex]; // 获取当前假名
            drawKana(currentKana);
            displayRomaji(currentKana);
            updateKanaHistory(currentKana); // 更新假名记录
            speakKana(currentKana); // 朗读假名
            currentIndex = (currentIndex + 1) % shuffledKana.length; // 更新索引

            // 如果所有假名已输出一次，重新打乱顺序
            if (currentIndex === 0) {
                shuffledKana = shuffleArray(allKana);
            }
        }

        // 获取触摸点的坐标
        function getTouchPos(event) {
            const rect = canvas.getBoundingClientRect();
            const touch = event.touches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
        }

        // 鼠标和触摸事件处理
        let isDrawing = false;

        // 鼠标事件
        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDrawing) {
                ctx.lineWidth = 5; // 画笔粗细
                ctx.strokeStyle = '#000'; // 画笔颜色
                ctx.lineCap = 'round'; // 画笔圆润
                ctx.lineJoin = 'round'; // 连接处圆润
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
            ctx.closePath();
        });

        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });

        // 触摸事件
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // 阻止默认行为
            isDrawing = true;
            const pos = getTouchPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 阻止默认行为
            if (isDrawing) {
                const pos = getTouchPos(e);
                ctx.lineWidth = 5; // 画笔粗细
                ctx.strokeStyle = '#000'; // 画笔颜色
                ctx.lineCap = 'round'; // 画笔圆润
                ctx.lineJoin = 'round'; // 连接处圆润
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            }
        });

        canvas.addEventListener('touchend', () => {
            isDrawing = false;
            ctx.closePath();
        });

        // 获取新增的朗读按钮
        const speakAgainButton = document.getElementById('speak-again');
        // 为朗读按钮添加点击事件
        speakAgainButton.addEventListener('click', () => {
            speakKana(currentKana); // 重新朗读当前假名
        });

        // 橡皮擦功能：仅清除描画内容，不更新假名
        document.getElementById('eraser').addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            drawGrid(); // 重新绘制田字格
            drawKana(currentKana); // 重新绘制当前假名
        });

        // 下一个假名功能
        document.getElementById('next').addEventListener('click', () => {
            init(); // 重新初始化画布
        });

        // 设置菜单显示/隐藏
        settingsIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
        });
    
        // 获取全选复选框
        const selectAllCheckbox = document.getElementById('select-all');


        // 修改假名分组复选框的变化监听，使其同步全选框状态
        document.querySelector('.kana-groups').addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.kana-groups input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            selectAllCheckbox.checked = allChecked;
            updateKanaGroups();
        });

        // 点击页面其他区域关闭设置菜单
        document.addEventListener('click', () => {
            settingsMenu.style.display = 'none';
        });

        // 阻止设置菜单内部的点击事件冒泡
        settingsMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 加载假名分组复选框
        function loadKanaGroups() {
            const kanaGroupsDiv = document.querySelector('.kana-groups');
            kanaGroupsDiv.innerHTML = ''; // 清空选项
            for (const group in kanaGroups) {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = group;
                checkbox.checked = true; // 默认全选
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(group));
                kanaGroupsDiv.appendChild(label);
            }
        }

        // 初始化假名分组复选框
        loadKanaGroups();

        // 限制模式开关
        learningModeCheckbox.addEventListener('change', () => {
            kanaGroupsContainer.style.display = learningModeCheckbox.checked ? 'block' : 'none';
            if (!learningModeCheckbox.checked) {
                allKana = [...hiragana, ...katakana]; // 重置为所有假名
                shuffledKana = shuffleArray(allKana);
                currentIndex = 0;
                init();
            }
        });

        // 更新假名分组
        function updateKanaGroups() {
            const selectedGroups = Array.from(document.querySelectorAll('.kana-groups input:checked'))
                .map(checkbox => kanaGroups[checkbox.value])
                .flat();
            allKana = selectedGroups.length > 0 ? selectedGroups : [...hiragana, ...katakana];
            shuffledKana = shuffleArray(allKana);
            currentIndex = 0;
            init();
        }

        // 监听假名分组复选框的变化
        document.querySelector('.kana-groups').addEventListener('change', updateKanaGroups);

        // 调整练习类型
        practiceTypeSelect.addEventListener('change', () => {
            const type = practiceTypeSelect.value;
            
            // 根据选择的类型设置假名列表
            if (type === 'hiragana') {
                allKana = [...hiragana];
            } else if (type === 'katakana') {
                allKana = [...katakana];
            } else {
                allKana = [...hiragana, ...katakana];
            }

            // 更新限制模式中的选项
            const checkboxes = document.querySelectorAll('.kana-groups input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const groupName = checkbox.value;
                const isHiraganaGroup = groupName.match(/^[あ-ん]/); // 使用日语字符范围判断
                
                if (type === 'mixed') {
                    checkbox.checked = true;
                } else if (type === 'hiragana') {
                    checkbox.checked = isHiraganaGroup;
                } else if (type === 'katakana') {
                    checkbox.checked = !isHiraganaGroup;
                }
            });

            // 如果启用了限制模式，则根据选中的分组更新假名列表
            if (learningModeCheckbox.checked) {
                updateKanaGroups();
            } else {
                shuffledKana = shuffleArray(allKana);
                currentIndex = 0;
                init();
            }
        });

        // 限制模式开关
        learningModeCheckbox.addEventListener('change', () => {
            kanaGroupsContainer.style.display = learningModeCheckbox.checked ? 'block' : 'none';
            if (learningModeCheckbox.checked) {
                updateKanaGroups();
            } else {
                const type = practiceTypeSelect.value;
                if (type === 'hiragana') {
                    allKana = [...hiragana];
                } else if (type === 'katakana') {
                    allKana = [...katakana];
                } else {
                    allKana = [...hiragana, ...katakana];
                }
                shuffledKana = shuffleArray(allKana);
                currentIndex = 0;
                init();
            }
        });

        // 监听假名分组复选框的变化
        document.querySelector('.kana-groups').addEventListener('change', updateKanaGroups);

        // 调整透明度
        opacityInput.addEventListener('input', () => {
            kanaOpacity = opacityInput.value / 100;
            opacityValue.textContent = opacityInput.value;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            drawGrid(); // 重新绘制田字格
            drawKana(currentKana); // 重新绘制假名
        });

        // 调整颜色
        colorInput.addEventListener('input', () => {
            kanaColor = colorInput.value;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            drawGrid(); // 重新绘制田字格
            drawKana(currentKana); // 重新绘制假名
        });

        // 调整字体
        fontSelect.addEventListener('change', () => {
            const selectedFont = fontSelect.value;
            document.body.style.fontFamily = `"${selectedFont}", sans-serif`; // 更新全局字体
            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            drawGrid(); // 重新绘制田字格
            drawKana(currentKana); // 重新绘制假名
        });
        document.addEventListener('DOMContentLoaded', () => {
            initJapaneseVoice();
            // 创建并显示气泡提示
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = '设置在这里';
            document.body.appendChild(tooltip);
            
            // 延迟显示气泡，添加淡入效果
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 500);

            // 点击任意位置关闭气泡
            document.addEventListener('click', () => {
                tooltip.style.opacity = '0';
                // 等待动画完成后移除元素
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }, { once: true });
        });
        // 确保字体加载完成后再初始化画板
        document.fonts.ready.then(() => {
            init();
        });
                const showRomajiCheckbox = document.getElementById('show-romaji');

        // 显示罗马音
        function displayRomaji(kana) {
            romajiDisplay.textContent = showRomajiCheckbox.checked ? (romaji[kana] || '') : '';
        }

        // 获取测试模式复选框和清除按钮
        const testModeCheckbox = document.getElementById('test-mode');
        const eraserButton = document.getElementById('eraser');

        // 存储原始设置状态
        let originalSettings = {
            showRomaji: true,
            speak: true
        };

        // 监听测试模式变化
        testModeCheckbox.addEventListener('change', () => {
            if (testModeCheckbox.checked) {
                // 保存当前设置
                originalSettings.showRomaji = showRomajiCheckbox.checked;
                originalSettings.speak = speakCheckbox.checked;

                // 启用测试模式：隐藏罗马音、关闭朗读、隐藏清除按钮
                showRomajiCheckbox.checked = false;
                speakCheckbox.checked = false;
                eraserButton.style.display = 'none';

                // 禁用显示设置选项
                showRomajiCheckbox.disabled = true;
                speakCheckbox.disabled = true;
            } else {
                // 恢复原始设置
                showRomajiCheckbox.checked = originalSettings.showRomaji;
                speakCheckbox.checked = originalSettings.speak;
                eraserButton.style.display = 'block';

                // 启用显示设置选项
                showRomajiCheckbox.disabled = false;
                speakCheckbox.disabled = false;
            }
            // 更新显示
            displayRomaji(currentKana);
        });

        // 监听罗马音显示选项的变化
        showRomajiCheckbox.addEventListener('change', () => {
            displayRomaji(currentKana);
        });