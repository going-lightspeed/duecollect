module.exports = [
"[project]/src/lib/mail-credentials.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mailCredentials",
    ()=>mailCredentials,
    "receivingConfigured",
    ()=>receivingConfigured,
    "sendingConfigured",
    ()=>sendingConfigured
]);
/**
 * The ONE place Remitra gets the mailbox email + password from.
 *
 * Put the values in .env.local (never commit that file):
 *
 *   MAIL_EMAIL=billing@yourdomain.com
 *   MAIL_PASSWORD=your-app-password
 *
 * Gmail/Outlook need an "app password", not your normal password.
 * Hosts default from the email domain (Gmail/Outlook/Yahoo auto-detected);
 * override with MAIL_SMTP_HOST / MAIL_IMAP_HOST for anything else.
 *
 * The old SMTP_* variables still work as a fallback.
 */ const PRESETS = {
    "gmail.com": {
        smtp: "smtp.gmail.com",
        imap: "imap.gmail.com"
    },
    "googlemail.com": {
        smtp: "smtp.gmail.com",
        imap: "imap.gmail.com"
    },
    "outlook.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "hotmail.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "live.com": {
        smtp: "smtp-mail.outlook.com",
        imap: "outlook.office365.com"
    },
    "yahoo.com": {
        smtp: "smtp.mail.yahoo.com",
        imap: "imap.mail.yahoo.com"
    },
    "zoho.com": {
        smtp: "smtp.zoho.com",
        imap: "imap.zoho.com"
    }
};
function bareAddress(from) {
    const m = from.match(/<([^>]+)>/);
    return (m ? m[1] : from).trim();
}
function mailCredentials() {
    const email = (process.env.MAIL_EMAIL || process.env.SMTP_USER || "").trim();
    const password = process.env.MAIL_PASSWORD || process.env.SMTP_PASS || "";
    const domain = email.split("@")[1]?.toLowerCase() || "";
    const preset = PRESETS[domain];
    const smtpHost = process.env.MAIL_SMTP_HOST || process.env.SMTP_HOST || preset?.smtp || "";
    const imapHost = process.env.MAIL_IMAP_HOST || preset?.imap || (smtpHost ? smtpHost.replace(/^smtp[-.]?/, "imap.") : "");
    const smtpPort = Number(process.env.MAIL_SMTP_PORT || process.env.SMTP_PORT || 587);
    const from = process.env.MAIL_FROM || process.env.SMTP_FROM || (email ? `Remitra <${email}>` : "");
    return {
        email,
        password,
        from,
        fromAddress: from ? bareAddress(from).toLowerCase() : email.toLowerCase(),
        smtp: {
            host: smtpHost,
            port: smtpPort,
            secure: (process.env.MAIL_SMTP_SECURE ?? process.env.SMTP_SECURE) === "true" || smtpPort === 465
        },
        imap: {
            host: imapHost,
            port: Number(process.env.MAIL_IMAP_PORT || 993),
            secure: (process.env.MAIL_IMAP_SECURE ?? "true") !== "false"
        }
    };
}
function sendingConfigured() {
    const c = mailCredentials();
    return Boolean(c.email && c.password && c.smtp.host);
}
function receivingConfigured() {
    const c = mailCredentials();
    return Boolean(c.email && c.password && c.imap.host);
}
}),
];

//# sourceMappingURL=src_lib_mail-credentials_ts_0-uliaydhxuzi._.js.map