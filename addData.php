<?php
// PHP скрипт для добавления данных
// Принимает данные из формы методом POST
// и сохраняет в файле database.txt

    $manufacturer = null;
    $name = null;
    $price = null;
    $amount = null;
    if(isset($_POST["manufacturer"])) {
        $manufacturer = htmlentities($_POST["manufacturer"]);
    }
    if(isset($_POST["name"])) {
        $name = htmlentities($_POST["name"]);
    }
    if(isset($_POST["price"])) {
        $price = htmlentities($_POST["price"]);
    }
    if(isset($_POST["amount"])) {
        $amount = htmlentities($_POST["amount"]);
    }
    if($manufacturer && $name && $price && $amount) {
        echo "$manufacturer :: $name :: $price :: $amount";
        $file_add = fopen("database.txt", "a");
        if(flock($file_add, LOCK_EX)) {
            $str = "$manufacturer :: $name :: $price :: $amount";
            fwrite($file_add,$str.PHP_EOL);
        }else {
            echo "LOCKED";
            exit(-1);
        }
        fclose($file_add);
    }
    header("Location: index.html");  
?>