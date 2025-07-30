from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import mm
from datetime import datetime

def generate_parking_report(user, reservations, filepath):
    c = canvas.Canvas(filepath, pagesize=A4)
    width, height = A4

    margin_x = 40
    y = height - 40
    line_height = 16

    def draw_header():
        nonlocal y
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width / 2, y, "Vehicle Vault: Monthly Parking Report")
        y -= 30
        c.setStrokeColor(colors.grey)
        c.line(margin_x, y, width - margin_x, y)
        y -= 20

    def draw_user_info():
        nonlocal y
        c.setFont("Helvetica-Bold", 13)
        username = user.email.split('@')[0].title()
        c.drawString(margin_x, y, f"Name: ")
        c.setFont("Helvetica", 12)
        c.drawString(margin_x + 40, y, username)
        y -= line_height

        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin_x, y, f"Email: ")
        c.setFont("Helvetica", 12)
        c.drawString(margin_x + 42, y, user.email)
        y -= line_height

        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin_x, y, f"Report Month: ")
        c.setFont("Helvetica", 12)
        c.drawString(margin_x + 90, y, datetime.now().strftime('%B %Y'))
        y -= 30

    def draw_summary():
        nonlocal y
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin_x, y, "Summary:")
        y -= line_height

        total_reservations = len(reservations)
        total_cost = sum(r.parking_cost or 0 for r in reservations)

        c.setFont("Helvetica", 12)
        c.drawString(margin_x + 10, y, f"Total Reservations: {total_reservations}")
        y -= line_height
        c.drawString(margin_x + 10, y, f"Total Parking Cost: Rs.{total_cost:.2f}")
        y -= 30

    def draw_table_header():
        nonlocal y
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(colors.black)
        c.drawString(margin_x, y, "Date")
        c.drawString(margin_x + 70, y, "Location")
        c.drawString(margin_x + 200, y, "Spot ID")
        c.drawString(margin_x + 260, y, "Parking Cost")
        c.drawString(margin_x + 320, y, "Parked At")
        c.drawString(margin_x + 400, y, "Left At")
        y -= 5
        c.setStrokeColor(colors.darkgrey)
        c.line(margin_x, y, width - margin_x, y)
        y -= 15

    def draw_reservations():
        nonlocal y
        if not reservations:
            c.setFont("Helvetica-Oblique", 12)
            c.drawString(margin_x, y, "No reservations in the past month.")
            return

        c.setFont("Helvetica-Bold", 13)
        c.drawString(margin_x, y, "Reservation Breakdown")
        y -= 25

        draw_table_header()

        c.setFont("Helvetica", 10)

        for r in reservations:
            if y < 60:
                c.showPage()
                y = height - 50
                draw_header()
                draw_table_header()
                c.setFont("Helvetica", 10)

            date_str = r.parking_timestamp.strftime('%d-%b-%Y')
            lot = r.spot.lot.prime_location_name if r.spot and r.spot.lot else 'N/A'
            spot_id = str(r.spot.id) if r.spot else 'N/A'
            cost = f"Rs.{r.parking_cost:.2f}" if r.parking_cost else 'N/A'
            start_time = r.parking_timestamp.strftime('%H:%M')
            end_time = r.leaving_timestamp.strftime('%H:%M') if r.leaving_timestamp else 'N/A'

            c.drawString(margin_x, y, date_str)
            c.drawString(margin_x + 70, y, lot)
            c.drawString(margin_x + 200, y, spot_id)
            c.drawString(margin_x + 260, y, cost)
            c.drawString(margin_x + 320, y, start_time)
            c.drawString(margin_x + 400, y, end_time)

            y -= line_height

    def draw_footer():
        c.setFont("Helvetica-Oblique", 10)
        c.setFillColor(colors.grey)
        c.drawString(margin_x, 30, "Thank you for using Vehicle Vault – Parking Management System")

    # Page 1
    draw_header()
    draw_user_info()
    draw_summary()
    draw_reservations()
    draw_footer()
    c.save()
    print(f"Report generated: {filepath}")