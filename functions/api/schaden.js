export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const turnstileToken = formData.get('cf-turnstile-response');
    if (env.TURNSTILE_SECRET) {
      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ success: false, error: 'Bitte lösen Sie das CAPTCHA.' }),
          { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      const verifyBody = new URLSearchParams();
      verifyBody.append('secret', env.TURNSTILE_SECRET);
      verifyBody.append('response', turnstileToken);
      verifyBody.append('remoteip', request.headers.get('CF-Connecting-IP') || '');
      const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: verifyBody,
      });
      const verifyResult = await verifyResponse.json();
      if (!verifyResult.success) {
        return new Response(
          JSON.stringify({ success: false, error: 'CAPTCHA-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
          { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    delete data['cf-turnstile-response'];

    const typ = data._typ || 'Sachversicherung';
    delete data._typ;

    const checkboxFelder = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('cb_')) {
        checkboxFelder.push(value);
      }
    }

    const attachments = [];
    const files = formData.getAll('dokumente');
    for (const file of files) {
      if (file && file.size && file.size > 0 && file.size <= 10 * 1024 * 1024) {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        attachments.push({
          filename: file.name,
          content: btoa(binary),
        });
      }
    }
    delete data.dokumente;

    let betreff = `Neue Schadensmeldung: ${typ}`;
    let htmlBody = buildEmailHtml(typ, data, checkboxFelder);
    let textBody = buildEmailText(typ, data, checkboxFelder);

    const empfaenger = env.SCHADEN_EMAIL || 'info@asw-suedwest.de';

    const emailPayload = {
      from: env.RESEND_FROM || 'ASW Schadenportal <noreply@asw-suedwest.de>',
      to: [empfaenger],
      subject: betreff,
      html: htmlBody,
      text: textBody,
    };

    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend error:', resendResponse.status, error);
      return new Response(
        JSON.stringify({ success: false, error: 'E-Mail konnte nicht gesendet werden.', debug: error }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Schadensmeldung erfolgreich gesendet.' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Ein Fehler ist aufgetreten.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function buildEmailHtml(typ, data, checkboxen) {
  const feldLabels = {
    versicherungsnehmer: 'Versicherungsnehmer',
    scheinnummer: 'Versicherungsscheinnummer',
    ansprechpartner: 'Ansprechpartner',
    email: 'E-Mail',
    telefon: 'Telefonnummer',
    adresse: 'Adresse des Objekts',
    schadentag: 'Schadentag',
    uhrzeit: 'Uhrzeit',
    schadenhergang: 'Schadenhergang',
    geschaedigte_sachen: 'Geschädigte Sachen',
    funktion: 'Funktion Organmitglied',
    anspruchserhebung_datum: 'Erstmalige Anspruchserhebung',
    anspruchserhebung_form: 'Form der Anspruchserhebung',
    kurzbeschreibung: 'Kurzbeschreibung des Anspruchs',
    anspruchsteller: 'Anspruchsteller',
    geforderte_leistung: 'Geforderte Leistung',
    schadenereignis: 'Angaben zum Schadenereignis',
    gemeldet_durch: 'Vorfall gemeldet durch',
    entdeckungszeitpunkt: 'Entdeckungszeitpunkt',
    vorfall_beschreibung: 'Kurzbeschreibung des Vorfalls',
    betroffene_systeme: 'Betroffene Systeme',
  };

  let rows = '';
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('cb_') || key === 'dokumente') continue;
    const label = feldLabels[key] || key;
    const escaped = String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    rows += `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;width:200px;background:#f9fafb;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${escaped}</td></tr>`;
  }

  let checkboxHtml = '';
  if (checkboxen.length > 0) {
    checkboxHtml = `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;vertical-align:top;background:#f9fafb;">Zusatzangaben</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${checkboxen.map(c => `&#10003; ${c}`).join('<br>')}</td></tr>`;
  }

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a2b3c;margin:0;padding:20px;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#1a2b3c;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;">Neue Schadensmeldung</h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px;">${typ}</p>
    </div>
    <div style="padding:24px 32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
        ${checkboxHtml}
      </table>
      <p style="margin-top:24px;font-size:12px;color:#6b7280;">Diese Nachricht wurde automatisch über das ASW südwest Schadenportal generiert.</p>
    </div>
  </div>
</body></html>`;
}

function buildEmailText(typ, data, checkboxen) {
  let text = `NEUE SCHADENSMELDUNG: ${typ}\n${'='.repeat(40)}\n\n`;

  const feldLabels = {
    versicherungsnehmer: 'Versicherungsnehmer',
    scheinnummer: 'Versicherungsscheinnummer',
    ansprechpartner: 'Ansprechpartner',
    email: 'E-Mail',
    telefon: 'Telefonnummer',
    adresse: 'Adresse des Objekts',
    schadentag: 'Schadentag',
    uhrzeit: 'Uhrzeit',
    schadenhergang: 'Schadenhergang',
    geschaedigte_sachen: 'Geschädigte Sachen',
    funktion: 'Funktion Organmitglied',
    anspruchserhebung_datum: 'Erstmalige Anspruchserhebung',
    anspruchserhebung_form: 'Form der Anspruchserhebung',
    kurzbeschreibung: 'Kurzbeschreibung',
    anspruchsteller: 'Anspruchsteller',
    geforderte_leistung: 'Geforderte Leistung',
    schadenereignis: 'Schadenereignis',
    gemeldet_durch: 'Gemeldet durch',
    entdeckungszeitpunkt: 'Entdeckungszeitpunkt',
    vorfall_beschreibung: 'Vorfallbeschreibung',
    betroffene_systeme: 'Betroffene Systeme',
  };

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('cb_') || key === 'dokumente') continue;
    const label = feldLabels[key] || key;
    text += `${label}: ${value}\n`;
  }

  if (checkboxen.length > 0) {
    text += `\nZusatzangaben:\n${checkboxen.map(c => `  ✓ ${c}`).join('\n')}\n`;
  }

  text += `\n---\nAutomatisch generiert über das ASW südwest Schadenportal.`;
  return text;
}
/* trigger redeploy */
