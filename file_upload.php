<?php 
include_once("db_connect.php");
if(!empty($_FILES)){     
    $upload_dir = "views/document/uploads/";
    $fileName = $_FILES['file']['name'];
    $uploaded_file = $upload_dir.$fileName;  
    if(move_uploaded_file($_FILES['file']['tmp_name'],$uploaded_file)){
        //insert file information into db table
		$mysql_insert = "INSERT INTO uploads (file_name,file_path,upload_time)VALUES('".$fileName."','".$uploaded_file."','".date("Y-m-d H:i:s")."')";
		
		mysqli_query($conn, $mysql_insert) or die("database error:". mysqli_error($conn));
    }   
}
