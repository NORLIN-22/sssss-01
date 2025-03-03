<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "2216921192@qq.com";
    $subject = "来自网站的新消息";
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    
    mail($to, $subject, $message, $headers);
    
    header("Location: thanks.html");
}
?>
