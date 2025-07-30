from flask import current_app as app
from celery.schedules import crontab
from backend.celery.tasks import daily_user_reminder, send_monthly_parking_reports

celery_app = app.extensions['celery']


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Daily at 8 PM
    sender.add_periodic_task(
        crontab(hour=20, minute=0),
        daily_user_reminder.s(),
        name='send daily reminder to inactive users'
    )
    # Monthly on the 1st at 8:00 AM
    sender.add_periodic_task(
        crontab(hour=8, minute=0, day_of_month=1),
        send_monthly_parking_reports.s(),
        name='send monthly parking reports'
    )


@celery_app.task
def test(arg):
    print(arg)

