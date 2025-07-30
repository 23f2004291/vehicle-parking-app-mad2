from email.mime.application import MIMEApplication
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = "vehiclevault@example.com"
SENDER_PASSWORD = "password"



def send_email(to, subject, body):

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'html'))

    try:
        with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
            client.send_message(msg)
            # client.login(SENDER_EMAIL, SENDER_PASSWORD)
            client.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
    
def send_email_with_attachment(to, subject, body, attachment_path):
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = to
    msg['Subject'] = subject

    # Add HTML body
    msg.attach(MIMEText(body, 'html'))

    # Add attachment (e.g., PDF)
    if attachment_path and os.path.exists(attachment_path):
        with open(attachment_path, "rb") as file:
            part = MIMEApplication(file.read(), Name=os.path.basename(attachment_path))
            part['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment_path)}"'
            msg.attach(part)

    try:
        with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
            client.send_message(msg)
            client.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# send_email('mili@example.com', 'Test Subject', '<h1>This is a test email</h1>')