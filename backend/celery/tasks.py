import pyexcel
from celery import shared_task
from backend.celery.mail_service import send_email
from datetime import datetime, timedelta
from backend.models import User, Reservation, db
from backend.celery.design_pdf import generate_parking_report
import os
from backend.celery.mail_service import send_email_with_attachment

#CSV export - Backend job
@shared_task(ignore_result=False)
def create_csv(user_id):
    reservations = Reservation.query.filter_by(user_id=user_id).all()

    merged_data = []
    for res in reservations:
        row = {
            "Reservation ID": res.id,
            "User Email": res.user.email if res.user else '',
            "Vehicle Number": res.vehicle.number if res.vehicle else '',
            "Vehicle Name": res.vehicle.name if res.vehicle else '',
            "Parking Spot ID": res.spot.id if res.spot else '',
            "Parking Lot": res.spot.lot.prime_location_name if res.spot and res.spot.lot else '',
            "Parking Lot Address": res.spot.lot.address if res.spot and res.spot.lot else '',
            "Pincode": res.spot.lot.pincode if res.spot and res.spot.lot else '',
            "Parking Timestamp": res.parking_timestamp.strftime('%Y-%m-%d %H:%M:%S') if res.parking_timestamp else '',
            "Leaving Timestamp": res.leaving_timestamp.strftime('%Y-%m-%d %H:%M:%S') if res.leaving_timestamp else '',
            "Parking Cost": res.parking_cost if res.parking_cost is not None else '',
            "Payment Amount": res.payment.amount if res.payment else '',
            "Payment Method": res.payment.method if res.payment else '',
            "Payment Time": res.payment.payment_time.strftime('%Y-%m-%d %H:%M:%S') if res.payment and res.payment.payment_time else '',
            "Reservation Active": res.is_active
        }
        merged_data.append(row)

    if not merged_data:
        return 'No data to export.'

    file_path = f'./backend/celery/user-downloads/ParkingSummary_{user_id}.csv'
    pyexcel.save_as(records=merged_data, dest_file_name=file_path)

    return f'ParkingSummary_{user_id}.csv'

# Scheduled Jobs - Daily User Reminder
@shared_task(ignore_result=True)
def daily_user_reminder():
    
    inactive_users = []
    all_users = User.query.all()
    
    for user in all_users:
        latest_reservation = Reservation.query.filter_by(user_id=user.id).order_by(Reservation.parking_timestamp).first()

        if not latest_reservation:
            # User has never reserved
            inactive_users.append(user)
        else:
            # Check if last reservation is older than 7 days
            if latest_reservation.parking_timestamp < datetime.now() - timedelta(days=7):
                inactive_users.append(user)

    for user in inactive_users:
        username = user.email.split('@')[0]
        if username == 'admin':
            continue

        body = f"""
            <h2>Hi {username},</h2>
            <p>We noticed you haven't booked a parking spot recently.</p>
            <p>Don't miss out—book your parking spot now!</p>
            <p><a href="http://localhost:5000/">Book Now</a></p>
            <br>
            <p style="color: gray; font-size: 12px;">This is an automated reminder from the Vehicle Vault - Parking Management System.</p>
            """
        send_email(user.email, f"Friendly Reminder: Reserve Your Parking!", body)
        

@shared_task
def send_monthly_parking_reports():
    users = User.query.all()
    start_date = datetime.now().replace(day=1)
    one_month_ago = datetime.now() - timedelta(days=30)

    report_dir = os.path.abspath('./backend/celery/user-downloads/')
    os.makedirs(report_dir, exist_ok=True)

    sent_count = 0

    for user in users:
        try:
            username = user.email.split('@')[0]
            if username == 'admin':
                continue

            reservations = Reservation.query.filter(
                Reservation.user_id == user.id,
                Reservation.parking_timestamp >= one_month_ago
            ).order_by(Reservation.parking_timestamp.desc()).all()
            
            filename = f"Parking_Monthly_Report_{username}_{start_date.strftime('%B_%Y')}.pdf"
            filepath = os.path.join(report_dir, filename)

            # Generate PDF
            generate_parking_report(user, reservations, filepath)

            # Prepare email body
            html_body = f"""
            <html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <div style="max-width: 600px; margin: auto; padding: 30px; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">Monthly Parking Report</h2>
                    <p>Hello <strong>{username}</strong>,</p>
                    <p>Hope you're doing great!</p>
                    <p>Here's your <strong>Monthly Parking Report</strong>, reflecting your parking activity over the last month.</p>
                    <p>Thank you for being a part of Vehicle Vault!</p>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #555;">Regards,<br><strong>Team Vehicle Vault</strong></p>
                </div>
            </body>
            </html>
            """

            send_email_with_attachment(
                to=user.email,
                subject=f"Monthly Parking Report - {start_date.strftime('%B %Y')}",
                body=html_body,
                attachment_path=filepath
            )

            print(f"[SEND] Sent report to {user.email}")
            sent_count += 1

        except Exception as e:
            print(f"[ERROR] Failed to send report to {user.email}: {e}")

    return f"Sent {sent_count} monthly parking reports."
