///////////////////////////////////////////////////////////////////////////////////////
//相手変更関数
///////////////////////////////////////////////////////////////////////////////////////
function changeOpp() {
    //CPUの選択状況を取得
    var cpuChecked = document.getElementById('opp_0').checked;
    //CPU選択時
    if (cpuChecked) {
        //順番を選択化
        document.getElementById('turn_0').disabled = false;
        document.getElementById('turn_9').disabled = false;
    }
    //自分で操作選択時
    else {
        document.getElementById('turn_0').disabled = true;
        document.getElementById('turn_9').disabled = true;
    }
}


///////////////////////////////////////////////////////////////////////////////////////
//Start関数
///////////////////////////////////////////////////////////////////////////////////////
function opeGame() {
    //現在の状態を取得（ゲームが開始されているか）
    var started = document.getElementById('started').value;

    //ゲームを開始する場合
    if (started == '0') {
        //ゲーム開始フラグを変更
        document.getElementById('started').value = '9';
        //ボタンをSTOPに変更
        document.getElementById('start_btn').value = 'STOP';
        //ルールを変更不可にする
        document.getElementById('opp_0').disabled = true;
        document.getElementById('opp_9').disabled = true;
        document.getElementById('turn_0').disabled = true;
        document.getElementById('turn_9').disabled = true;
        //相手を取得
        var opp = document.getElementById('opp_0').checked;
        //順番を取得
        var turn = document.getElementById('turn_0').checked;
        //CPUが先行の場合
        if (opp && !turn) {
            opeCPU();
        }
    }
    //ゲームを中断する場合
    else {
        //ゲーム開始フラグを変更
        document.getElementById('started').value = '0';
        //ボタンをSTARTに変更
        document.getElementById('start_btn').value = 'START';
        //ルールを変更不可にする
        document.getElementById('opp_0').disabled = false;
        document.getElementById('opp_9').disabled = false;
        document.getElementById('turn_0').disabled = false;
        document.getElementById('turn_9').disabled = false;
        //テーブルオブジェクトを取得
        var table = document.getElementById('yonmoku_table');
        //ゲームテーブルの中身を削除
        for(let row of table.rows){
            for (let cell of row.cells) {
                cell.innerText = '';
            }
        };
        //ゲームのターン数を初期化
        document.getElementById('turn_cnt').value = '1';
    }
}



///////////////////////////////////////////////////////////////////////////////////////
//ターン判別
///////////////////////////////////////////////////////////////////////////////////////
function authMyTurn(turn_cnt, opp, turn) {
    //戻り値
    var ret = false;
    //相手がCPUの場合
    if (opp) {
        //ターン数をMOD
        var turn_mod = turn_cnt % 2;
        //自分が先行でターン数が奇数の場合
        if (turn && turn_mod == 1) {
            ret = true;
        }
        //自分が後攻でターン数が偶数
        else if (!turn && turn_mod == 0){
            ret = true;
        }
    }
    //自分操作の場合
    else if (!opp) {
        ret = true;
    };
    return ret;
}



///////////////////////////////////////////////////////////////////////////////////////
//プレイヤー関数
///////////////////////////////////////////////////////////////////////////////////////
function onclickTd(td) {
    //ゲーム開始フラグの取得
    var started = document.getElementById('started').value;
    //ゲームがスタートしている場合
    if (started == '9') {
        //ターン数を取得
        var turn_cnt = Number(document.getElementById('turn_cnt').value);
        //相手を取得
        var opp = document.getElementById('opp_0').checked;
        //順番を取得
        var turn = document.getElementById('turn_0').checked;
        //自分のターンの場合
        if (authMyTurn(turn_cnt, opp, turn)) {
            //テーブルオブジェクトを取得
            var table = document.getElementById('yonmoku_table');
            //挿入位置＆文字を定義
            var inputRow = 0;
            var inputColumn = 0;
            var inputText = '';
            //選択された列（comuln）と行（row）の値を取得
            var column = td.cellIndex;
            var tr = td.parentNode;
            var row = tr.sectionRowIndex;
            //列のすべての値を配列で取得
            var vals = [];
            for(let row of table.rows){
                var val = row.cells[column].innerText;
                if (val != '') {
                    vals.push(val);
                }
            }
            //挿入位置・文字を決定
            inputRow = 5-vals.length;
            inputColumn = column;
            if (turn_cnt%2 == 1) {
                inputText = '○';
            }
            else {
                inputText = '×';
            }
            //埋め文字を挿入
            table.rows[inputRow].cells[inputColumn].innerText = inputText;
            //ターン数を変更
            document.getElementById('turn_cnt').value = String(turn_cnt+1);
            //勝敗判定
            var shousha = judge(table, 0, turn_cnt, opp);
            if (shousha != '') {
                alert(`${shousha}の勝ちです。`);
                //ゲーム開始フラグを変更
                document.getElementById('started').value = '99';
                //ボタンをRESTARTに変更
                document.getElementById('start_btn').value = 'RESTART';
            }
            else {
                //相手のターン
                if (opp && turn_cnt != 42) {
                    opeCPU();
                }
            }
        }
    }
};


///////////////////////////////////////////////////////////////////////////////////////
//CPU関数
///////////////////////////////////////////////////////////////////////////////////////
function opeCPU() {
    //ゲーム開始フラグの取得
    var started = document.getElementById('started').value;
    //ターン数を取得
    var turn_cnt = Number(document.getElementById('turn_cnt').value);
    //ゲームが開始している場合
    if (started == '9') {
        //テーブルオブジェクトを取得
        var table = document.getElementById('yonmoku_table');
        //挿入位置＆文字を定義
        var inputRow = 0;
        var inputColumn = 0;
        var inputText = '';
        //ループ変数
        var auth = true;
        //挿入位置が決定するまでループ
        while (auth) {
            //ランダムで挿入列を定義
            var column = Math.floor(Math.random() * 7);
            //列のすべての値を配列で取得
            var vals = [];
            for(let row of table.rows){
                var val = row.cells[column].innerText;
                if (val != '') {
                    vals.push(val);
                }
            };
            //挿入位置・文字を決定
            inputRow = 5-vals.length;
            inputColumn = column;
            if (turn_cnt%2 == 1) {
                inputText = '○';
            }
            else {
                inputText = '×';
            }
            if (inputRow >= 0) {
                //埋め文字を挿入
                table.rows[inputRow].cells[inputColumn].innerText = inputText;
                //ループを終了
                auth = false;
            }
        }
        //勝敗判定
        var shousha = judge(table, 9, turn_cnt);
        if (shousha != '') {
            alert(`${shousha}の勝ちです。`);
            //ゲーム開始フラグを変更
            document.getElementById('started').value = '99';
            //ボタンをRESTARTに変更
            document.getElementById('start_btn').value = 'RESTART';
        }
        //ターン数を変更
        document.getElementById('turn_cnt').value = String(turn_cnt+1);
    }
};

///////////////////////////////////////////////////////////////////////////////////////
//勝敗判定関数
///////////////////////////////////////////////////////////////////////////////////////
function judge(table, player, turn_cnt, opp) {
    //判定
    var hantei = false;
    //勝利者
    var ret = '';
    //勝利条件を定義
    var con1 = '○○○○';
    var con2 = '××××';
    //行の配列を取得
    var rows = ['','','','','',''];
    var columns = ['','','','','','',''];
    var nanames = ['','','','','','','','','','','',''];
    //操作中のインデックスを定義
    var rowIndex = 0;
    var cellIndex = 0;
    //テーブルの中身を確認
    for(let row of table.rows){
        //現在の行のインデックスを取得
        rowIndex = row.rowIndex;
        for (let cell of row.cells) {
            cellIndex = cell.cellIndex;
            //挿入文字列を定義
            var str_cell = cell.innerText;
            if (str_cell == '') {
                str_cell = '-';
            }
            //行の文字列に追加
            rows[rowIndex] = rows[rowIndex]+str_cell;
            //列の文字列に追加
            columns[cellIndex] = columns[cellIndex]+str_cell;
            //斜めの文字列に追加
            switch(rowIndex) {
                case 0: {
                    switch(cellIndex) {
                        case 0:
                            nanames[0] = nanames[0]+str_cell;
                            break;
                        case 1:
                            nanames[1] = nanames[1]+str_cell;
                            break;
                        case 2:
                            nanames[2] = nanames[2]+str_cell;
                            break;
                        case 3:
                            nanames[3] = nanames[3]+str_cell;
                            nanames[4] = nanames[4]+str_cell;
                            break;
                        case 4:
                            nanames[5] = nanames[5]+str_cell;
                            break;
                        case 5:
                            nanames[6] = nanames[6]+str_cell;
                            break;
                        case 6:
                            nanames[7] = nanames[7]+str_cell;
                            break;
                    }
                    break;
                }
                case 1: {
                    switch(cellIndex) {
                        case 0:
                            nanames[8] = nanames[8]+str_cell;
                            break;
                        case 1:
                            nanames[0] = nanames[0]+str_cell;
                            break;
                        case 2:
                            nanames[1] = nanames[1]+str_cell;
                            nanames[4] = nanames[4]+str_cell;
                            break;
                        case 3:
                            nanames[2] = nanames[2]+str_cell;
                            nanames[5] = nanames[5]+str_cell;
                            break;
                        case 4:
                            nanames[3] = nanames[3]+str_cell;
                            nanames[6] = nanames[6]+str_cell;
                            break;
                        case 5:
                            nanames[7] = nanames[7]+str_cell;
                            break;
                        case 6:
                            nanames[9] = nanames[9]+str_cell;
                            break;
                    }
                    break;
                }
                case 2: {
                    switch(cellIndex) {
                        case 0:
                            nanames[10] = nanames[10]+str_cell;
                            break;
                        case 1:
                            nanames[8] = nanames[8]+str_cell;
                            nanames[4] = nanames[4]+str_cell;
                            break;
                        case 2:
                            nanames[0] = nanames[0]+str_cell;
                            nanames[5] = nanames[5]+str_cell;
                            break;
                        case 3:
                            nanames[1] = nanames[1]+str_cell;
                            nanames[6] = nanames[6]+str_cell;
                            break;
                        case 4:
                            nanames[2] = nanames[2]+str_cell;
                            nanames[7] = nanames[7]+str_cell;
                            break;
                        case 5:
                            nanames[3] = nanames[3]+str_cell;
                            nanames[9] = nanames[9]+str_cell;
                            break;
                        case 6:
                            nanames[11] = nanames[11]+str_cell;
                            break;
                    }
                    break;
                }
                case 3: {
                    switch(cellIndex) {
                        case 0:
                            nanames[4] = nanames[4]+str_cell;
                            break;
                        case 1:
                            nanames[5] = nanames[5]+str_cell;
                            nanames[10] = nanames[10]+str_cell;
                            break;
                        case 2:
                            nanames[6] = nanames[6]+str_cell;
                            nanames[8] = nanames[8]+str_cell;
                            break;
                        case 3:
                            nanames[0] = nanames[0]+str_cell;
                            nanames[7] = nanames[7]+str_cell;
                            break;
                        case 4:
                            nanames[1] = nanames[1]+str_cell;
                            nanames[9] = nanames[9]+str_cell;
                            break;
                        case 5:
                            nanames[2] = nanames[2]+str_cell;
                            nanames[11] = nanames[11]+str_cell;
                            break;
                        case 6:
                            nanames[3] = nanames[3]+str_cell;
                            break;
                    }
                    break;
                }
                case 4: {
                    switch(cellIndex) {
                        case 0:
                            nanames[5] = nanames[5]+str_cell;
                            break;
                        case 1:
                            nanames[6] = nanames[6]+str_cell;
                            break;
                        case 2:
                            nanames[7] = nanames[7]+str_cell;
                            nanames[10] = nanames[10]+str_cell;
                            break;
                        case 3:
                            nanames[8] = nanames[8]+str_cell;
                            nanames[9] = rows[cellIndex]+str_cell;
                            break;
                        case 4:
                            nanames[0] = nanames[0]+str_cell;
                            nanames[11] = nanames[11]+str_cell;
                            break;
                        case 5:
                            nanames[1] = nanames[1]+str_cell;
                            break;
                        case 6:
                            nanames[2] = nanames[2]+str_cell;
                            break;
                    }
                    break;
                }
                case 5: {
                    switch(cellIndex) {
                        case 0:
                            nanames[6] = nanames[6]+str_cell;
                            break;
                        case 1:
                            nanames[7] = nanames[7]+str_cell;
                            break;
                        case 2:
                            nanames[9] = nanames[9]+str_cell;
                            break;
                        case 3:
                            nanames[10] = nanames[10]+str_cell;
                            nanames[11] = nanames[11]+str_cell;
                            break;
                        case 4:
                            nanames[8] = nanames[8]+str_cell;
                            break;
                        case 5:
                            nanames[0] = nanames[0]+str_cell;
                            break;
                        case 6:
                            nanames[1] = nanames[1]+str_cell;
                            break;
                    }
                    break;
                }
            }
        }
    };
    //行の判別
    for (let row of rows) {
        //○か×の４連系がある場合
        if (row.includes(con1) || row.includes(con2)) {
            hantei = true;
        }
    }
    //列の判別
    for (let column of columns) {
        //○か×の４連系がある場合
        if (column.includes(con1) || column.includes(con2)) {
            hantei = true;
        }
    }
    //斜めの判断
    for (let naname of nanames) {
        //○か×の４連系がある場合
        if (naname.includes(con1) || naname.includes(con2)) {
            hantei = true;
        }
    }
    //勝者が決まった場合
    if (hantei) {
        //自分が操作した時に決まった場合
        if (player == 0) {
            if (opp) {
                ret = 'あなた';
            }
            else if (turn_cnt%2 == 1){
                ret = '先行';
            }
            else {
                ret = '後攻';
            }
        }
        else {
            ret = 'CPU';
        }
    }
    console.log(rows);
    console.log(columns);
    //勝者文字列を返す
    return ret;
}
