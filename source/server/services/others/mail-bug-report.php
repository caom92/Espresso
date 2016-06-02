<?php

// Import PHPMailer using the composer autoloader
require_once realpath(
    dirname(__FILE__)."/../../../../external/PHPMailer/vendor/autoload.php"
);

// For this script, the client does not send a json object, rather, it sends
// the binary data using the default channels of POST and FILES for proper
// form submition and translation into an email

// Create the email body by pasting all the posted data into it
$body = "Usuario: " . $_POST["user-name"] . "\n"
    . "ID de empleado: " . $_POST["user-id"] . "\n"
    . "Zona: " . $_POST["zone-selection"] . "\n"
    . "Procedimiento: " . $_POST["procedure-selection"] . "\n"
    . "Navegadores: ";
    
// paste browsers
foreach ($_POST["browser-selection"] as $browser) {
    $body .= $browser . " ";
}

// continue with the rest of the body
$body .= "\n" . "Severidad: " . $_POST["severity-selection"] . "\n"
    . "Resumen: " . $_POST["summary"] . "\n"
    . "Pasos para reproducirlo: " . $_POST["steps"] . "\n"
    . "Salida esperada: " . $_POST["expectation"] . "\n"
    . "Salida obtenida: " . $_POST["reality"] . "\n";
    
// create the body of the confirmation mail
$confirmationBody = "";

if ($_POST["lang"] == "en") {
    $confirmationBody .= "This is an automated response to the bug report that"
        . " you submitted earlier. We'll start working on solving the problem "
        . "as soon as possible. You don't need to reply to this message. If "
        . "you did not submitted any bug report to us, please just disregard "
        . "this message. ";
} else {
    $confirmationBody .= "Esta es una respuesta automatizada al reporte de "
        . "problema que nos envió hace unos momentos. Comenzaremos a trabajar"
        . " en resolver el problema tan pronto como nos sea posible. No es "
        . " necesario que conteste este mensaje. Si usted no nos envió ningún"
        . " reporte, por favor sólo ignore este mensaje.";
}

//Create a new PHPMailer instance
$mail = new PHPMailerOAuth;
$confirmationMail = new PHPMailerOAuth;

//Tell PHPMailer to use SMTP
$mail->isSMTP();
$confirmationMail->isSMTP();

//Set the hostname of the mail server
$mail->Host = "smtp.gmail.com";
$confirmationMail->Host = "smtp.gmail.com";

//Set the SMTP port number 
$mail->Port = 587;
$confirmationMail->Port = 587;

//Set the encryption system to use 
$mail->SMTPSecure = "tls";
$confirmationMail->SMTPSecure = "tls";

//Whether to use SMTP authentication
$mail->SMTPAuth = true;
$confirmationMail->SMTPAuth = true;

//Set AuthType
$mail->AuthType = "XOAUTH2";
$confirmationMail->AuthType = "XOAUTH2";

//User Email to use for SMTP authentication
// Use the same Email used in Google Developer Console
$mail->oauthUserEmail = "caom92@gmail.com";
$confirmationMail->oauthUserEmail = "caom92@gmail.com";

//Obtained From Google Developer Console
$mail->oauthClientId = 
"400565202453-2816cv5dbclt3s8l2u5p0qq8f713orrf.apps.googleusercontent.com";
$confirmationMail->oauthClientId = 
"400565202453-2816cv5dbclt3s8l2u5p0qq8f713orrf.apps.googleusercontent.com";

//Obtained From Google Developer Console
$mail->oauthClientSecret = "PJdHoakwXn2IQ4p0L52eu9NW";
$confirmationMail->oauthClientSecret = "PJdHoakwXn2IQ4p0L52eu9NW";

//Obtained By running get_oauth_token.php after setting up APP in Google 
// Developer Console.
$mail->oauthRefreshToken = "1/SQZQxNs4NhjJcAYN6JWHYvsKcWQL0XRsQAaHsfuH3iI";
$confirmationMail->oauthRefreshToken = "1/SQZQxNs4NhjJcAYN6JWHYvsKcWQL0XRsQAaHsfuH3iI";

//Set who the message is to be sent from
//For gmail, this generally needs to be the same as the user you logged in as
$mail->setFrom("caom92@gmail.com", "Espresso mailing system");
$confirmationMail->setFrom("caom92@gmail.com", "Espresso mailing system");

//Set who the message is to be sent to
$mail->addAddress("caom92@live.com", "Carlos Oliva");
$confirmationMail->addAddress($_POST["email"], "Carlos Oliva");

//Set the subject line
$mail->Subject = "Jacobs Farm - Del Cabo: Bug Report";
if ($_POST["lang"] == "en") {
    $confirmationMail->Subject = 
        "Jacobs Farm : Bug report submission confirmation";
} else {
    $confirmationMail->Subject = 
        "Del Cabo : Confirmación de envío de reporte de problema";
}

//Use plain text message
$mail->isHTML(false);
$confirmationMail->isHTML(false);

//Replace the plain text body with one created manually
$mail->Body = $body;
$confirmationMail->Body = $confirmationBody;

// attach the image files
$length = count($_FILES["screenshot-attachment"]["tmp_name"]);

for ($i = 0; $i < $length; $i++) {
    $mail->AddAttachment($_FILES["screenshot-attachment"]["tmp_name"][$i], 
    $_FILES["screenshot-attachment"]["name"][$i]);
}

// the json object to be sent to the client in response
$outputJSON;

// send the file
if ($mail->Send()) {
    // notify the client if the file was mailed successfully
    $outputJSON = [
        "error_code" => 0,
        "error_message" => "",
        "data" => []
    ];
} else {
    // if the file was not mailed, notify the client
    $outputJSON = [
        "error_code" => 1,
        "error_message" => $mail->ErrorInfo,
        "data" => []
    ];
}

// send the confirmation email, it is not really important if this 
// message does not make it to the recipient
$confirmationMail->Send();

// Send the data to the client as a JSON with the following format
// {
//     error_code:[int],
//     error_message:[string],
//     data:[]
// }
echo json_encode($outputJSON);

?>