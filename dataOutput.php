<?php
// PHP скрипт для вывода данных.
// Возвращает данные из файла database.txt в формате JSON

    $products = [];
    $file_out = fopen("database.txt", "r");
    if(flock($file_out, LOCK_SH)) {
        while(!feof($file_out)) {
            $str = fgets($file_out);
            $length = strlen($str);
            if(strlen($str)) {
            $temp_array = explode(" :: ", $str);

                $product=[
                "manufacturer" => $temp_array[0],
                "name"=>$temp_array[1],
                "price"=>$temp_array[2],
                "amount"=>trim($temp_array[3])
                ];
                $products[]=$product;
            }
        }
    } else {
        echo "LOCKED";
        exit(-1);
    }
    fclose($file_out);
    header('Content-type: application/json');
    echo json_encode($products);
?>