/**
 * Módulo de Notificaciones para Easy-Migration
 * Permite alertar al equipo cuando se recibe un nuevo lead en el formulario.
 */

// Configuración opcional de canales de notificación externa
export const notificationConfig = {
    // Si deseas recibir alertas en Discord/Telegram/Slack/Make/Zapier, ingresa la URL de webhook aquí
    webhookUrl: '',
    
    // Configuración de EmailJS (si deseas recibir correos automáticos sin backend propio)
    emailJs: {
        publicKey: '',     // Tu Public Key de EmailJS
        serviceId: '',     // ID del servicio de correo (ej. 'service_xxxx')
        templateId: ''     // ID de la plantilla de correo (ej. 'template_xxxx')
    },

    // Número de WhatsApp oficial para atención directa (código de país + número, sin + ni espacios)
    whatsappNumber: '15551234567'
};

/**
 * Genera el enlace directo a WhatsApp con un mensaje predeterminado o con los datos del lead.
 * @param {Object} [leadData] - Datos opcionales del lead.
 * @returns {string} URL formateada para abrir WhatsApp.
 */
export function obtenerEnlaceWhatsApp(leadData = null) {
    let mensaje = "¡Hola Easy Migration! Deseo recibir información y asesoría sobre sus servicios de asistencia migratoria y traducción legal.";

    if (leadData && leadData.nombre) {
        mensaje = `¡Hola! Mi nombre es ${leadData.nombre}. Acabo de solicitar una cita en su página web sobre trámites para ${leadData.paisInteres || 'migración'}.`;
    }

    return `https://wa.me/${notificationConfig.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Notifica al equipo sobre la llegada de un nuevo lead.
 * Se ejecuta de forma asíncrona y no bloquea el flujo principal ni la base de datos si falla.
 * @param {Object} leadData - Datos del formulario enviados por el cliente.
 */
export async function notificarNuevoLead(leadData) {
    const tareasNotificacion = [];

    // 1. Notificación vía Webhook (Discord, Telegram, Slack, Zapier, etc.) si está configurado
    if (notificationConfig.webhookUrl) {
        tareasNotificacion.push(
            fetch(notificationConfig.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `🔔 **¡Nueva Solicitud de Cita en Easy-Migration!**\n` +
                             `👤 **Nombre:** ${leadData.nombre}\n` +
                             `📧 **Email:** ${leadData.email}\n` +
                             `📱 **Teléfono:** ${leadData.telefono}\n` +
                             `🌎 **País de interés:** ${leadData.paisInteres}\n` +
                             `💬 **Mensaje:** ${leadData.mensaje}\n` +
                             `📅 **Fecha:** ${new Date().toLocaleString()}`
                })
            }).catch(err => console.warn('Advertencia: No se pudo enviar notificación por Webhook:', err))
        );
    }

    // 2. Notificación vía EmailJS si está configurado y la librería está cargada
    if (notificationConfig.emailJs.publicKey && notificationConfig.emailJs.serviceId && typeof window.emailjs !== 'undefined') {
        tareasNotificacion.push(
            window.emailjs.send(
                notificationConfig.emailJs.serviceId,
                notificationConfig.emailJs.templateId,
                {
                    from_name: leadData.nombre,
                    from_email: leadData.email,
                    phone: leadData.telefono,
                    country: leadData.paisInteres,
                    message: leadData.mensaje,
                    submitted_at: new Date().toLocaleString()
                }
            ).catch(err => console.warn('Advertencia: No se pudo enviar notificación por EmailJS:', err))
        );
    }

    if (tareasNotificacion.length > 0) {
        await Promise.allSettled(tareasNotificacion);
    }
}
