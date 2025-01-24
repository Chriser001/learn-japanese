// 检查localStorage中的振假名内容
function checkStoredContent() {
    const storedData = localStorage.getItem('furiganaContent');
    if (storedData) {
        try {
            const { content, timestamp } = JSON.parse(storedData);
            const now = new Date().getTime();
            const oneDayInMs = 24 * 60 * 60 * 1000;
            
            if (now - timestamp <= oneDayInMs) {
                const outputText = document.getElementById('outputText');
                outputText.innerHTML = content;
                
                // 设置字体大小
                const savedFontSize = parseInt(localStorage.getItem('furiganaFontSize')) || 18;
                outputText.style.fontSize = `${savedFontSize}px`;
                
                // 设置 ruby 和 rt 元素的字体大小
                const rubyElements = outputText.querySelectorAll('ruby');
                rubyElements.forEach(ruby => {
                    ruby.style.fontSize = `${savedFontSize}px`;
                });
                
                const rtElements = outputText.querySelectorAll('rt');
                rtElements.forEach(rt => {
                    rt.style.fontSize = `${savedFontSize * 0.6}px`;
                });
                
                toggleTextareaHeight(true);
            } else {
                localStorage.removeItem('furiganaContent');
                localStorage.removeItem('furiganaFontSize')
            }
        } catch (e) {
            console.error('解析存储的振假名数据时出错:', e);
            localStorage.removeItem('furiganaContent');
        }
    }
}

// 控制输入框高度的函数
function toggleTextareaHeight(collapse = false) {
    const inputText = document.getElementById('inputText');
    if (collapse) {
        inputText.classList.add('textarea-collapsed');
    } else {
        inputText.classList.remove('textarea-collapsed');
    }
}

// 加载歌曲列表
async function loadSongList() {
    try {
        const response = await fetch('/static/songs.json');
        const data = await response.json();
        const songSelect = document.getElementById('songSelect');
        
        data.songs.forEach(song => {
            const option = document.createElement('option');
            option.value = song.title;
            option.textContent = `${song.title} - ${song.artist}`;
            songSelect.appendChild(option);
        });

        // 添加歌曲选择事件监听
        songSelect.addEventListener('change', function() {
            const selectedTitle = this.value;
            if (!selectedTitle) return;

            const selectedSong = data.songs.find(song => song.title === selectedTitle);
            if (selectedSong) {
                const lyrics = selectedSong.lyrics.join('\n');
                document.getElementById('inputText').value = lyrics;
            }
        });
    } catch (error) {
        console.error('加载歌曲列表失败:', error);
    }
}

// 初始化事件监听器和功能
function initializeApp() {
    // 页面加载时检查存储的内容
    window.addEventListener('load', () => {
        checkStoredContent();
        loadSongList(); // 加载歌曲列表
    });

    // 为版本号添加点击事件
    document.getElementById('version-number').addEventListener('click', function() {
        localStorage.removeItem('furiganaContent');
        console.log('已清空本地存储的振假名内容');
    });

    // 添加粘贴按钮事件处理
    document.getElementById('pasteButton').addEventListener('click', async function() {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                document.getElementById('inputText').value = text;
            }
        } catch (err) {
            console.error('无法访问剪贴板:', err);
            alert('无法访问剪贴板，请检查浏览器权限设置');
        }
    });

    const statusBar = document.getElementById('status-bar');

    // Kuromoji.js 初始化
    let tokenizer = null;
    kuromoji.builder({ 
        dicPath: "./../dict"
    }).build(function (err, _tokenizer) {
        if (err) {
            console.error("Kuromoji 初始化失败:", err);
            statusBar.textContent = "词典加载失败，请刷新页面重试";
            statusBar.style.backgroundColor = "#dc3545";
            return;
        }
        tokenizer = _tokenizer;
        statusBar.textContent = "词典加载完毕！";
        statusBar.style.backgroundColor = "#28a745";
        
        const processButton = document.getElementById('processButton');
        processButton.disabled = false;
        processButton.textContent = "添加振假名";
    
        setTimeout(() => {
            statusBar.style.opacity = "0";
            setTimeout(() => {
                statusBar.style.display = "none";
            }, 300);
        }, 3000);
    
        const inputText = document.getElementById('inputText');
        const clearButton = document.getElementById('clearButton');
    
        clearButton.addEventListener('click', () => {
            inputText.value = '';
        });
    
        inputText.addEventListener('focus', () => {
            toggleTextareaHeight(false);
        });

        inputText.addEventListener('blur', () => {
            toggleTextareaHeight(true);
        });

        document.getElementById('processButton').addEventListener('click', function () {
            const inputText = document.getElementById('inputText');
            const text = inputText.value;
            if (!text) {
                alert("请输入日文文本！");
                return;
            }

            if (!tokenizer) {
                alert("词典加载中，请稍后再试...");
                return;
            }

            toggleTextareaHeight(true);
            
            const lines = text.split('\n');
            const processedLines = lines.map(line => {
                if (!line.trim()) return '\n';
                
                const tokens = tokenizer.tokenize(line);
                return tokens.map(token => {
                    const surface = token.surface_form;
                    let reading = token.reading;
                    
                    if (reading) {
                        reading = reading.replace(/[\u30A1-\u30F6]/g, match => 
                            String.fromCharCode(match.charCodeAt(0) - 0x60)
                        );
                    }
    
                    if (reading && /[\u4e00-\u9faf]/.test(surface)) {
                        return `<ruby>${surface}<rt>${reading}</rt></ruby>`;
                    }
                    return surface;
                }).join('') + '\n';
            });
    
            const outputContent = processedLines.join('');
            document.getElementById('outputText').innerHTML = outputContent;
            
            const storageData = {
                content: outputContent,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('furiganaContent', JSON.stringify(storageData));
            
            inputText.value = '';

            const savedFontSize = parseInt(localStorage.getItem('furiganaFontSize')) || 18;
            const outputTextElement = document.getElementById('outputText');
            outputTextElement.style.fontSize = `${savedFontSize}px`;
            
            const rubyElements = outputTextElement.querySelectorAll('ruby');
            rubyElements.forEach(ruby => {
                ruby.style.fontSize = `${savedFontSize}px`;
            });
            
            const rtElements = outputTextElement.querySelectorAll('rt');
            rtElements.forEach(rt => {
                rt.style.fontSize = `${savedFontSize * 0.6}px`;
            });
        });
    });

    initializeFontSizeControl();
}

// 字体大小调节功能
function initializeFontSizeControl() {
    const outputText = document.getElementById('outputText');
    const increaseButton = document.getElementById('increase-font');
    const decreaseButton = document.getElementById('decrease-font');
    let currentFontSize = parseInt(localStorage.getItem('furiganaFontSize')) || 18;

    function updateFontSize() {
        outputText.style.fontSize = `${currentFontSize}px`;
        
        const rubyElements = outputText.querySelectorAll('ruby');
        rubyElements.forEach(ruby => {
            ruby.style.fontSize = `${currentFontSize}px`;
        });
        
        const rtElements = outputText.querySelectorAll('rt');
        rtElements.forEach(rt => {
            rt.style.fontSize = `${currentFontSize * 0.6}px`;
        });
    }

    updateFontSize();

    increaseButton.addEventListener('click', () => {
        if (currentFontSize < 36) {
            currentFontSize += 2;
            updateFontSize();
            localStorage.setItem('furiganaFontSize', currentFontSize.toString());
        }
    });

    decreaseButton.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            updateFontSize();
            localStorage.setItem('furiganaFontSize', currentFontSize.toString());
        }
    });
}

// 初始化应用
initializeApp();