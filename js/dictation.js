// 在文件顶部声明全局变量
let currentTool = "pencil";
let gridContainer;

document.addEventListener("DOMContentLoaded", function() {
    // 获取 gridContainer 引用
    gridContainer = document.getElementById("grid-container");
    
    // 检查是否需要显示浮层
    const lastVisit = localStorage.getItem('lastVisitTime');
    const currentTime = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数

    if (!lastVisit || (currentTime - parseInt(lastVisit)) > oneWeek) {
        // 创建浮层
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        
        const content = document.createElement('div');
        content.className = 'overlay-content';
        content.innerHTML = `
            <h2>简单的必读说明 下周见</h2>
            <p>• 本页目标为iPad设计，Mac上Chrome/Safari测试没问题，非为手机设计</p>
            <p>• 点击格子上方的罗马音即可清空对应的格子中书写的内容</p>
            <p>• 点击右上角的🧽，会清空所有一书写的内容，不会重新排序</p>
            <p>• 点击🔀按钮会清除所有已经书写的内容并重新随机排列顺序</p>
            <p>• 代码生成源：DeepSeek/Claude</p>

        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        // 点击任意位置关闭浮层
        overlay.addEventListener('click', () => {
            overlay.remove();
            localStorage.setItem('lastVisitTime', currentTime.toString());
        });
    }
    // 初始化按钮和事件监听
    initializeButtons();
    // 初始化生成田字格
    generateGrid();
});

// 所有的假名数据
const romajiList = [
    "a", "i", "u", "e", "o",
    "ka", "ki", "ku", "ke", "ko",
    "sa", "shi", "su", "se", "so",
    "ta", "chi", "tsu", "te", "to",
    "na", "ni", "nu", "ne", "no",
    "ha", "hi", "fu", "he", "ho",
    "ma", "mi", "mu", "me", "mo",
    "ya", "yu", "yo",
    "ra", "ri", "ru", "re", "ro",
    "wa", "wo", "n"
];

const kanaMap = {
    'a': ['あ', 'ア'], 'i': ['い', 'イ'], 'u': ['う', 'ウ'], 'e': ['え', 'エ'], 'o': ['お', 'オ'],
    'ka': ['か', 'カ'], 'ki': ['き', 'キ'], 'ku': ['く', 'ク'], 'ke': ['け', 'ケ'], 'ko': ['こ', 'コ'],
    'sa': ['さ', 'サ'], 'shi': ['し', 'シ'], 'su': ['す', 'ス'], 'se': ['せ', 'セ'], 'so': ['そ', 'ソ'],
    'ta': ['た', 'タ'], 'chi': ['ち', 'チ'], 'tsu': ['つ', 'ツ'], 'te': ['て', 'テ'], 'to': ['と', 'ト'],
    'na': ['な', 'ナ'], 'ni': ['に', 'ニ'], 'nu': ['ぬ', 'ヌ'], 'ne': ['ね', 'ネ'], 'no': ['の', 'ノ'],
    'ha': ['は', 'ハ'], 'hi': ['ひ', 'ヒ'], 'fu': ['ふ', 'フ'], 'he': ['へ', 'ヘ'], 'ho': ['ほ', 'ホ'],
    'ma': ['ま', 'マ'], 'mi': ['み', 'ミ'], 'mu': ['む', 'ム'], 'me': ['め', 'メ'], 'mo': ['も', 'モ'],
    'ya': ['や', 'ヤ'], 'yu': ['ゆ', 'ユ'], 'yo': ['よ', 'ヨ'],
    'ra': ['ら', 'ラ'], 'ri': ['り', 'リ'], 'ru': ['る', 'ル'], 're': ['れ', 'レ'], 'ro': ['ろ', 'ロ'],
    'wa': ['わ', 'ワ'], 'wo': ['を', 'ヲ'], 'n': ['ん', 'ン']
};

// 显示浮层
function showOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    const content = document.createElement('div');
    content.className = 'overlay-content';
    content.innerHTML = `
        <h2>简单的必读说明 下周见</h2>
        <p>• 本页目标为iPad设计，Mac上Chrome/Safari测试没问题，非为手机设计</p>
        <p>• 点击格子上方的罗马音即可清空对应的格子中书写的内容</p>
        <p>• 点击右上角的🧽，会清空所有一书写的内容，不会重新排序</p>
        <p>• 点击🔀按钮会清除所有已经书写的内容并重新随机排列顺序</p>
        <p>• 代码生成源：DeepSeek/Claude</p>
    `;
    
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        overlay.remove();
        localStorage.setItem('lastVisitTime', new Date().getTime().toString());
    });
}

// 初始化按钮和事件监听
function initializeButtons() {
    const pencilBtn = document.getElementById("pencil-btn");
    const eraserBtn = document.getElementById("eraser-btn");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const showKanaBtn = document.getElementById("show-kana-btn");

    pencilBtn.classList.add("active");

    pencilBtn.addEventListener("click", () => {
        currentTool = "pencil";
        pencilBtn.classList.add("active");
        eraserBtn.classList.remove("active");
    });

    eraserBtn.addEventListener("click", () => {
        clearAllCanvases();
        currentTool = "pencil";
        pencilBtn.classList.add("active");
        eraserBtn.classList.remove("active");
    });

    clearAllBtn.addEventListener("click", handleClearAll);
    showKanaBtn.addEventListener("click", handleShowKana);
}

// 处理显示/隐藏假名
function handleShowKana() {
    const kanaTexts = document.querySelectorAll(".kana-text");
    const showKanaBtn = document.getElementById("show-kana-btn");

    kanaTexts.forEach(kanaText => {
        const romaji = kanaText.previousElementSibling.textContent;
        const [hiragana, katakana] = kanaMap[romaji];
        kanaText.textContent = `${hiragana} ${katakana}`;
        kanaText.style.display = kanaText.style.display === "none" ? "block" : "none";
    });
    showKanaBtn.classList.toggle("active");
}

// 处理清除所有内容
function handleClearAll() {
    clearAllCanvases();
    const romajiTexts = document.querySelectorAll(".romaji");
    const kanaTexts = document.querySelectorAll(".kana-text");
    const showKanaBtn = document.getElementById("show-kana-btn");

    kanaTexts.forEach(kanaText => {
        kanaText.style.display = "none";
    });

    showKanaBtn.classList.remove("active");

    const shuffledRomajiList = [...romajiList].sort(() => Math.random() - 0.5);

    romajiTexts.forEach((romajiText, index) => {
        setTimeout(() => {
            romajiText.textContent = shuffledRomajiList[index];
        }, index * 50);
    });
}

// 清除所有画布内容
function clearAllCanvases() {
    const canvases = document.querySelectorAll(".canvas");
    canvases.forEach(canvas => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// 生成田字格
function generateGrid() {
    gridContainer.innerHTML = "";
    romajiList.forEach((romaji, index) => {
        const gridItem = createGridItem(romaji);
        gridContainer.appendChild(gridItem);
    });
}

// 创建单个田字格项
function createGridItem(romaji) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const romajiText = document.createElement("div");
    romajiText.classList.add("romaji");
    romajiText.textContent = romaji;
    romajiText.style.cursor = "pointer";
    romajiText.title = "点击清除画板";

    const kanaText = document.createElement("div");
    kanaText.className = "kana-text";
    kanaText.style.display = "none";

    const cell = document.createElement("div");
    cell.classList.add("grid-cell");

    const canvas = document.createElement("canvas");
    canvas.classList.add("canvas");
    canvas.width = 100;
    canvas.height = 100;

    romajiText.addEventListener("click", () => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    gridItem.appendChild(romajiText);
    gridItem.appendChild(kanaText);
    gridItem.appendChild(cell);
    cell.appendChild(canvas);

    initCanvas(canvas);

    return gridItem;
}

// 初始化画板
function initCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    function startDrawing(e) {
        if (currentTool === "pencil") {
            isDrawing = true;
            const { offsetX, offsetY } = getEventPosition(e);
            [lastX, lastY] = [offsetX, offsetY];
            disableScroll();
        }
        e.preventDefault();
    }

    function draw(e) {
        if (!isDrawing) return;

        const { offsetX, offsetY } = getEventPosition(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        [lastX, lastY] = [offsetX, offsetY];
        e.preventDefault();
    }

    function stopDrawing() {
        if (currentTool === "pencil") {
            isDrawing = false;
            enableScroll();
        }
    }
}

// 工具函数
function getEventPosition(e) {
    const rect = e.target.getBoundingClientRect();
    if (e.touches) {
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    }
    return {
        offsetX: e.offsetX,
        offsetY: e.offsetY
    };
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let scrollPosition = 0;

function disableScroll() {
    if (isMobileDevice()) {
        scrollPosition = window.scrollY;
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = "100%";
    }
}

function enableScroll() {
    if (isMobileDevice()) {
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        document.body.style.top = "auto";
        window.scrollTo(0, scrollPosition);
    }
}