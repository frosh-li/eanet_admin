<?php

if (isset($_POST["PHPSESSID"])) {
    session_id($_POST["PHPSESSID"]);
}
session_start();

if (file_exists("upload/" . $_FILES["Filedata"]["name"])) {
    echo $_FILES["Filedata"]["name"] . " already exists. ";
} else {
    move_uploaded_file($_FILES["Filedata"]["tmp_name"], "./upload/" . $_FILES["Filedata"]["name"]);
    echo "Stored in: " . "./upload/" . $_FILES["Filedata"]["name"];
}
// The Demos don't save files
echo "Make sure Flash Player on OS X works";
exit(0);
?>