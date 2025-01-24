(() => {
    let stage = 1;
    let active = true;
    const levelsCount = document.querySelectorAll('div[class^=lvl]').length;
    let createMode = false;

    function initTheme() {
        if (localStorage.theme === 'light') {
            document.body.classList.add('light');
            document.getElementById('light-toggle').textContent = 'Lights Off';
        }
    }

    function genLevels() {
        document.querySelectorAll('div[data-set]').forEach((el) => {
            let levelHTML = '';
            const set = el.dataset.set.split('.');
            set.forEach((item) => {
                let blockType = 'curve';
                if (item[0] === 's') blockType = 'straight';
                if (item[0] === 'e') blockType = 'end';
                if (item[0] === 'b') blockType = '';
                const rotation = item[1] ? 'r' + item[1] : '';
                const isDouble = item[2] ? 'double' : '';
                levelHTML += `<div class="block ${blockType} ${isDouble} ${rotation}"></div>`;
            });
            const levelText = el.dataset.text;
            if (levelText) levelHTML += `<div class="msg">${levelText}</span></div>`;
            el.insertAdjacentHTML('beforeend', levelHTML);
        });
    }

function showLevels() {
    document.getElementById('current-level').textContent = stage;

        const previousStage = stage - 1;
        document.querySelector('#level-complete .msg span').textContent = previousStage;
        document.getElementById('total-levels').textContent = levelsCount;
        if (stage > levelsCount) {

            document.getElementById('game-finished').style.display = 'block';
        } else if (stage > 1) {
            document.getElementById('level-complete').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.lvl' + previousStage).remove();
                document.querySelector('div.lvl' + stage).style.display = 'block';
                document.getElementById('level-complete').style.display = 'none';
                active = true;
            }, 2000);
        } else {
            document.querySelector('div.lvl' + stage).style.display = 'block';
        }
    }

    function checkCombo() {
        const blocks = document.querySelectorAll('.lvl' + stage + ' .block');
        let blockClasses = '';
        blocks.forEach((el) => {
            blockClasses += el.className.replace(/\D+/g, '');
        });
        console.info(blockClasses);
        if (document.querySelector('.lvl' + stage).dataset.code === blockClasses) {
            stage++;
            active = false;
            setTimeout(showLevels, 500);
        }
    }

    function updateStats() {
        let code = '', set = '';
        document.querySelectorAll('.new-level .block').forEach((el) => {
            const blockType = el.className.split(' ')[1][0];
            if (blockType !== 'b') code += el.className.replace(/\D+/g, '');
            let randomRotation = Math.floor(Math.random() * 2) + 1;
            if (blockType !== 's') randomRotation = Math.floor(Math.random() * 4) + 1;
            if (blockType === 'b') randomRotation = '';
            set += blockType + randomRotation + '.';
        });
        set = set.slice(0, -1);
        document.querySelector('.level-stats').innerHTML = 'code: ' + code + ' - Set: ' + set;
    }

    initTheme();
    genLevels();
    showLevels();

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('block')) {
            let index = event.target.className.replace(/\D+/g, '');
            if (active && index) {
                event.target.classList.remove('r' + index);
                index++;
                if (event.target.classList.contains('straight')) {
                    if (index == 3) index = 1;
                } else if (index == 5) {
                    index = 1;
                }
                event.target.classList.add('r' + index);
                if (!createMode) {
                    checkCombo();
                } else {
                    updateStats();
                }
            }
        }
    });

    document.getElementById('light-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light');
        document.getElementById('light-toggle').textContent = document.body.classList.contains('light') ? 'Lights Off' : 'Lights On';
        localStorage.setItem('theme', document.body.className);
    });

    document.querySelector('.level-creator').addEventListener('click', () => {
        document.querySelector('#level-creation .new-level').innerHTML = '';
        document.getElementById('level-creation').classList.toggle('fade');
        createMode = !createMode;
    });

    document.querySelectorAll('.toolbox img').forEach((img) => {
        img.addEventListener('click', () => {
            const blockClass = img.className;
            document.querySelector('.new-level').insertAdjacentHTML('beforeend', `<div class="block ${blockClass} r1"></div>`);
        });
    });
})();
