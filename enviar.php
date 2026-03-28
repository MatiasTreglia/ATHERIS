<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nombre  = strip_tags(trim($_POST["name"]));
    $email   = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $mensaje = nl2br(htmlspecialchars(trim($_POST["message"])));

    if (empty($nombre) || empty($mensaje) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["result" => "error", "message" => "Datos incompletos"]);
        exit;
    }

    $destinatario_empresa = "ventas@atherisinfo.com";
    $remitente_sistema = "no-reply@atherisinfo.com"; // Asegúrate que esta cuenta exista en tu HostGator

    // Configuración de Cabeceras para HTML
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Atheris Info <$remitente_sistema>" . "\r\n";

    // --- ESTILO CSS COMÚN ---
    $style_container = "font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; color: #333;";
    $style_header = "background-color: #00ced1; padding: 30px; text-align: center; color: white;"; // Turquesa (DarkTurquoise)
    $style_body = "padding: 30px; line-height: 1.6; background-color: #ffffff;";
    $style_footer = "background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eeeeee;";
    $style_label = "color: #00ced1; font-weight: bold; text-transform: uppercase; font-size: 11px; margin-bottom: 5px; display: block;";
    $style_box = "background-color: #f4fbfc; padding: 15px; border-radius: 5px; border-left: 4px solid #00ced1; margin-bottom: 20px;";

    // --- CORREO 1: PARA LA EMPRESA ---
    $asunto_admin = "⭐ Nueva consulta: $nombre";
    $cuerpo_admin = "
    <div style='$style_container'>
        <div style='$style_header'>
            <h1 style='margin:0; font-size: 24px;'>Nuevo Mensaje Web</h1>
        </div>
        <div style='$style_body'>
            <span style='$style_label'>Remitente</span>
            <p style='margin: 0 0 20px 0;'><strong>$nombre</strong> ($email)</p>
            
            <span style='$style_label'>Mensaje del Cliente</span>
            <div style='$style_box'>$mensaje</div>
            
            <p style='font-size: 13px; color: #666;'>Puedes responder directamente a este correo para contactar al cliente.</p>
        </div>
        <div style='$style_footer'>
            Sistema de Notificaciones Atheris Info
        </div>
    </div>";

    $headers_admin = $headers . "Reply-To: $email" . "\r\n";
    mail($destinatario_empresa, $asunto_admin, $cuerpo_admin, $headers_admin);

    // --- CORREO 2: PARA EL CLIENTE (CONFIRMACIÓN) ---
    $asunto_cliente = "Recibimos tu mensaje - Atheris Info";
    $cuerpo_cliente = "
    <div style='$style_container'>
        <div style='$style_header'>
            <h1 style='margin:0; font-size: 24px;'>¡Hola $nombre!</h1>
        </div>
        <div style='$style_body'>
            <p style='font-size: 16px;'>Gracias por contactarnos. Hemos recibido tu consulta correctamente.</p>
            <p>Nuestro equipo revisará tu mensaje y te responderá a la brevedad posible.</p>
            
            <div style='margin: 30px 0; border-top: 1px solid #eee;'></div>
            
            <span style='$style_label'>Resumen de tu consulta</span>
            <div style='font-style: italic; color: #555;'>\"$mensaje\"</div>
        </div>
        <div style='$style_footer'>
            <strong>Atheris Info</strong><br>
            Buenos Aires, Argentina<br>
            <a href='https://atherisinfo.com' style='color: #00ced1; text-decoration: none;'>www.atherisinfo.com</a>
        </div>
    </div>";

    $envio_cliente = mail($email, $asunto_cliente, $cuerpo_cliente, $headers);

    if ($envio_cliente) {
        echo json_encode(["result" => "success"]);
    } else {
        echo json_encode(["result" => "error", "message" => "Error al enviar"]);
    }
}
?>