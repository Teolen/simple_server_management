<?php
// PHP скрипт для удаления данных из файла database.txt
// Принимает JSON удаляемой позиции.

    header("Content-Type: application/json");
    $data = json_decode(file_get_contents("php://input"));
    $removable = $data[0]." :: ".$data[1]." :: ".$data[2]." :: ".$data[3].PHP_EOL;
    $return = null;
    $file_temp = "";
    
    $file_read = fopen("database.txt","r");
    if(flock($file_read,LOCK_SH)) {
        while(!feof($file_read)) {
            $line = fgets($file_read);
            if($line !== $removable) {
                $file_temp=$file_temp.$line;
            } else {
                $return = $line;
            }
        }
    } else {
        echo "READING LOCKED";
        exit(-1);
    }
    fclose($file_read);

    $file_delete = fopen("database.txt","w");
    if(flock($file_delete,LOCK_EX)) {
        fwrite($file_delete,$file_temp);
    } else {
        echo "WRITE LOCKED";
        exit(-1);
    }
    fclose($file_delete);

    if($return) {
        echo "Удалено: ".$return;
    } else {
        echo "Ошибка при удалении";
    }
?>