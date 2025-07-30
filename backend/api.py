import base64
from datetime import datetime
from flask import request, current_app as app
from flask_restful import Resource, Api, fields, marshal_with, marshal
from flask_security import auth_required, roles_required, current_user
from backend.models import ParkingLot, ParkingSpot, Payment, Reservation, User, Vehicle, db
from sqlalchemy import case, func
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend
import base64
from io import BytesIO
import matplotlib.pyplot as plt


cache = app.cache
api = Api(prefix='/api')

# Define the output format for ParkingLot

parking_lot_fields = {
    'id': fields.Integer,
    'prime_location_name': fields.String,
    'price': fields.Float,
    'address': fields.String,
    'pincode': fields.String,
    'number_of_spots': fields.Integer,
}

class ParkingLotAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(parking_lot_fields)
    def get(self, lot_id):
        parking_lot = ParkingLot.query.get_or_404(lot_id)
        return parking_lot

    @roles_required('admin')
    def put(self, lot_id):
        data = request.get_json()
        parking_lot = ParkingLot.query.get_or_404(lot_id)

        # Update basic fields
        parking_lot.prime_location_name = data.get('prime_location_name', parking_lot.prime_location_name)
        parking_lot.price = data.get('price', parking_lot.price)
        parking_lot.address = data.get('address', parking_lot.address)
        parking_lot.pincode = data.get('pincode', parking_lot.pincode)

        if 'number_of_spots' in data:
            new_spots = data['number_of_spots']
            current_spots = len(parking_lot.spots)

            if new_spots > current_spots:
                # Add new empty spots
                for _ in range(new_spots - current_spots):
                    db.session.add(ParkingSpot(lot_id=parking_lot.id, status='A'))

            elif new_spots < current_spots:
                # Find how many we can safely delete (only if status == 'A')
                deletable_spots = [spot for spot in reversed(parking_lot.spots) if spot.status == 'A']
                to_delete = current_spots - new_spots

                if len(deletable_spots) < to_delete:
                    return {'message': 'Cannot reduce spots. Not enough free spots available to delete.'}, 400

                for spot in deletable_spots[:to_delete]:
                    db.session.delete(spot)

            # Finally update the number
            parking_lot.number_of_spots = new_spots

        db.session.commit()
        return {'message': 'Parking lot updated successfully'}, 200

    
    @roles_required('admin')
    def delete(self, lot_id):
        parking_lot = ParkingLot.query.get_or_404(lot_id)
        #Delete only if all spots are empty
        if any(spot.status != 'A' for spot in parking_lot.spots):
            return {'message': 'Cannot delete parking lot with occupied spots'}, 400
        
        db.session.delete(parking_lot)
        db.session.commit()
        return {'message': 'Parking lot deleted successfully'}, 204
    
class ParkingLotListAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(parking_lot_fields)
    def get(self):
        parking_lots = ParkingLot.query.all()
        return parking_lots   
    def post(self):
        data = request.get_json()
        location = data.get('prime_location_name')
        price = data.get('price')
        address = data.get('address')
        pincode = data.get('pincode')
        number_of_spots = data.get('number_of_spots')
        
        if not all([location, price, address, pincode, number_of_spots]):
            return {'message': 'Missing required fields'}, 400
        new_lot = ParkingLot(
            prime_location_name=location,
            price=price,
            address=address,
            pincode=pincode,
            number_of_spots=number_of_spots
        )
        db.session.add(new_lot)
        db.session.commit()
        # Create initial parking spots
        for _ in range(int(number_of_spots)):
            spot = ParkingSpot(lot_id=new_lot.id, status='A')   # A=Available
            db.session.add(spot)
        db.session.commit()
        return {'message': 'Parking lot created successfully', 'lot_id': new_lot.id}, 201
        

api.add_resource(ParkingLotAPI, '/parking_lots/<int:lot_id>')
api.add_resource(ParkingLotListAPI, '/parking_lots')

# Define the output format for ParkingSpot
spot_fields = {
    'id': fields.Integer,
    'lot_id': fields.Integer,
    'status': fields.String,
}
class ParkingSpotAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(spot_fields)
    def get(self, spot_id):
        spot = ParkingSpot.query.get_or_404(spot_id)
        result = marshal(spot, spot_fields)

        if spot.status == 'O':
            reservation = Reservation.query.filter_by(spot_id=spot.id, is_active=True).first()
            if reservation:
                result['occupied_by'] = {
                    'user_id': reservation.user_id,
                    'vehicle_number': reservation.vehicle_number,
                    'start_time': reservation.parking_timestamp.isoformat()
                }

        return result

    @roles_required('user')
    def put(self, spot_id):
        """Update spot status (user only)"""
        spot = ParkingSpot.query.get_or_404(spot_id)
        data = request.get_json()
        new_status = data.get('status')
        if new_status not in ['A', 'O']:
            return {'message': 'Invalid status (use "A" or "O")'}, 400
        spot.status = new_status
        db.session.commit()
        return {'message': 'Spot updated successfully'}, 200

class ParkingSpotListAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(spot_fields)
    def get(self):
        lot_id = request.args.get('lot_id', type=int)
        if lot_id:
            spots = ParkingSpot.query.filter_by(lot_id=lot_id).all()
        else:
            spots = ParkingSpot.query.all()
        return spots



api.add_resource(ParkingSpotAPI, '/parking_spots/<int:spot_id>')
api.add_resource(ParkingSpotListAPI, '/parking_spots')

# Reservation

vehicle_fields = {
    'id': fields.Integer,
    'number': fields.String,
    'name': fields.String
}

reservation_fields = {
    'id': fields.Integer,
    'spot_id': fields.Integer,
    'user_id': fields.Integer,
    'vehicle': fields.Nested(vehicle_fields),
    'parking_timestamp': fields.DateTime(dt_format='iso8601'),
    'leaving_timestamp': fields.DateTime(dt_format='iso8601'),
    'parking_cost': fields.Float,
    'is_active': fields.Boolean
}

class ReservationAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(reservation_fields)
    def get(self, reservation_id):
        """Fetch a reservation by ID"""
        reservation = Reservation.query.get_or_404(reservation_id)
        return reservation

    @auth_required('token')
    def delete(self, reservation_id):
        """Delete a reservation (admin only)"""
        reservation = Reservation.query.get_or_404(reservation_id)
        reservation.is_active = False
        reservation.leaving_timestamp = datetime.now()
        reservation.spot.status = 'A'  # Mark spot available
        db.session.commit()
        return {'message': 'Reservation ended and spot freed'}, 200

    @auth_required('token')
    def put(self, reservation_id):
        # Update reservation (user)
        reservation = Reservation.query.get_or_404(reservation_id)

        if not reservation.is_active:
            return {'message': 'Reservation already ended'}, 400
        parking_lot_price = reservation.spot.lot.price

        reservation.leaving_timestamp = datetime.now()
       
        duration_hours = (reservation.leaving_timestamp - reservation.parking_timestamp).total_seconds() / 3600
        reservation.parking_cost = round(duration_hours * parking_lot_price, 2)
        reservation.is_active = False
        reservation.spot.status = 'A'  # Mark spot available

        db.session.commit()
        return {'message': 'Reservation ended', 'cost': reservation.parking_cost}, 200


class ReservationListAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(reservation_fields)
    def get(self):
        """Get all active reservations"""
        reservations = Reservation.query.filter_by(is_active=True).all()
        return reservations

    @auth_required('token')
    def post(self):
        """Create a new reservation (user only)"""
        data = request.get_json()
        lot_id = data.get('lot_id')
        vehicle_id = data.get('vehicle_id')
        user_id = current_user.id

        if not lot_id or not vehicle_id:
            return {'message': 'Missing required fields'}, 400

        # Get the first available spot
        spot = ParkingSpot.query.filter_by(lot_id=lot_id, status='A').first()
        if not spot:
            return {'message': 'No available parking spots in this lot'}, 400

        reservation = Reservation(
            spot_id=spot.id,
            user_id=user_id,
            vehicle_id=vehicle_id,
            parking_timestamp=datetime.now()
        )

        spot.status = 'O'
        db.session.add(reservation)
        db.session.commit()

        
        return {
            'message': 'Reservation created successfully',
            'reservation_id': reservation.id,
            'vehicle': {
                'name': reservation.vehicle.name,
                'number': reservation.vehicle.number
            },
            'lot_name': spot.lot.prime_location_name,
            'spot_number': spot.id,
            'parking_timestamp': reservation.parking_timestamp.isoformat(),
            'user_id': user_id,
            'price': spot.lot.price
        }, 201


api.add_resource(ReservationAPI, '/reservations/<int:reservation_id>')
api.add_resource(ReservationListAPI, '/reservations')

class ActiveUserReservationAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(reservation_fields)
    def get(self):
        active_reservations = Reservation.query.filter_by(user_id=current_user.id, is_active=True).all()
        return active_reservations


api.add_resource(ActiveUserReservationAPI, '/active-reservations')

# In ReservationAPI
class SpotReservationAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(reservation_fields)
    def get(self, spot_id):
        reservation = Reservation.query.filter_by(spot_id=spot_id, is_active=True).first_or_404()
        return reservation

api.add_resource(SpotReservationAPI, '/spot-reservation/<int:spot_id>')


#Payment
payment_fields = {
    'id': fields.Integer,
    'reservation_id': fields.Integer,
    'amount': fields.Float,
    'payment_time': fields.DateTime(dt_format='iso8601'),
    'method': fields.String
}

class PaymentAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(payment_fields)
    def get(self, payment_id):
        payment = Payment.query.get_or_404(payment_id)
        return payment

class PaymentListAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(payment_fields)
    def get(self):
        # List all payments
        payments = Payment.query.all()
        return payments

    @auth_required('token')
    def post(self):
        
        data = request.get_json()
        reservation_id = data.get('reservation_id')
        amount = data.get('amount')
        method = data.get('method', 'UPI')

        if not reservation_id or amount is None:
            return {'message': 'reservation_id and amount are required'}, 400

        reservation = Reservation.query.get(reservation_id)
        if not reservation:
            return {'message': 'Reservation not found'}, 404

        # Create payment
        payment = Payment(
            reservation_id=reservation_id,
            amount=amount,
            method=method,
            payment_time=datetime.now()
        )

        db.session.add(payment)
        db.session.commit()

        return {'message': 'Payment created successfully', 'payment_id': payment.id}, 201
class MyPaymentsAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(payment_fields)
    def get(self):
        """Get payments made by the logged-in user only"""
        current_user = current_user

        payments = Payment.query.join(Reservation).filter(
            Reservation.user_id == current_user.id
        ).all()

        return payments
class PaymentStatsAPI(Resource):
    @roles_required('admin')
    # @cache.cached(timeout = 5)
    def get(self):
        """Returns total revenue and optional filters like user_id or month"""
        user_id = request.args.get('user_id')
        month = request.args.get('month')  # Format: YYYY-MM

        query = Payment.query

        if user_id:
            query = query.join(Reservation).filter(Reservation.user_id == int(user_id))

        if month:
            try:
                year, month_number = map(int, month.split('-'))
                start_date = datetime(year, month_number, 1)
                if month_number == 12:
                    end_date = datetime(year + 1, 1, 1)
                else:
                    end_date = datetime(year, month_number + 1, 1)
                query = query.filter(Payment.payment_time >= start_date, Payment.payment_time < end_date)
            except:
                return {'message': 'Invalid month format. Use YYYY-MM'}, 400

        total_amount = sum([p.amount for p in query.all()])
        count = query.count()

        return {
            'total_payments': count,
            'total_amount': total_amount
        }
    
api.add_resource(PaymentAPI, '/payments/<int:payment_id>')
api.add_resource(PaymentListAPI, '/payments')
api.add_resource(MyPaymentsAPI, '/my_payments')
api.add_resource(PaymentStatsAPI, '/payment_stats')

# Define the output format for User
user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'active': fields.Boolean
}

class UserListAPI(Resource):
    @roles_required('admin')
    @cache.cached(timeout = 5)
    @marshal_with(user_fields)
    def get(self):
        return User.query.all()

api.add_resource(UserListAPI, '/users')

# Define the output format for AdminSummary

vehicle_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'number': fields.String,
    'user_id': fields.Integer
}

class VehicleListAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    @marshal_with(vehicle_fields)
    def get(self):
        user = current_user
        return Vehicle.query.filter_by(user_id=user.id).all()

    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        number = data.get('number')

        if not name or not number:
            return {'message': 'Both name and number are required'}, 400

        user = current_user
        vehicle = Vehicle(name=name, number=number, user_id=user.id)
        db.session.add(vehicle)
        db.session.commit()
        return {'message': 'Vehicle added successfully', 'id': vehicle.id}, 201

class VehicleAPI(Resource):
    @auth_required('token')
    # @cache.memoize(timeout = 5)
    @marshal_with(vehicle_fields)
    def get(self, vehicle_id):
        user = current_user
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        if vehicle.user_id != user.id:
            return {'message': 'Access denied'}, 403
        return vehicle

    @auth_required('token')
    def put(self, vehicle_id):
        user = current_user
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        if vehicle.user_id != user.id:
            return {'message': 'Access denied'}, 403

        data = request.get_json()
        vehicle.name = data.get('name', vehicle.name)
        vehicle.number = data.get('number', vehicle.number)
        db.session.commit()
        return {'message': 'Vehicle updated successfully'}, 200

    @auth_required('token')
    def delete(self, vehicle_id):
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        if vehicle.user_id != current_user.id:
            return {'message': 'Access denied'}, 403

        # Check if vehicle is linked to active reservation
        active_res = Reservation.query.filter_by(vehicle_id=vehicle.id, is_active=True).first()
        if active_res:
            return {'message': 'Vehicle has an active reservation and cannot be deleted'}, 400

        db.session.delete(vehicle)
        db.session.commit()
        return {'message': 'Vehicle deleted successfully'}, 200

# Register the resources
api.add_resource(VehicleListAPI, '/vehicles')
api.add_resource(VehicleAPI, '/vehicles/<int:vehicle_id>')

class PaymentRecordAPI(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    def get(self):

        payments = Payment.query.join(Payment.reservation).filter(
            Reservation.user_id == current_user.id
        ).all()

        result = []
        for payment in payments:
            reservation = payment.reservation
            vehicle = reservation.vehicle
            spot = reservation.spot
            lot = spot.lot if spot else None

            # Calculate parking duration (in hours)
            start = reservation.parking_timestamp
            end = reservation.leaving_timestamp
            duration = (end - start).total_seconds() / 3600 if start and end else None

            record = {
                'reservation_id': reservation.id,
                'user_id': current_user.id,
                'user_email': current_user.email,
                'vehicle': {
                    'name': vehicle.name if vehicle else '',
                    'number': vehicle.number if vehicle else '',
                },
                'lot_name': lot.prime_location_name if lot else '',
                'spot_number': spot.id if spot else '',
                'start_time': start.isoformat() if start else None,
                'end_time': end.isoformat() if end else None,
                'parking_duration': round(duration, 2) if duration else 'N/A',
                'amount': payment.amount,
                'method': payment.method,
                'payment_time': payment.payment_time.isoformat() if payment.payment_time else None,
            }

            result.append(record)

        return result, 200
api.add_resource(PaymentRecordAPI, '/my_payment_records')




class ParkingSummary(Resource):
    @auth_required('token')
    # @cache.cached(timeout = 5)
    def get(self):
        try:

            # 1. Revenue Chart
            revenue_data = db.session.query(
                ParkingLot.prime_location_name,
                func.coalesce(func.sum(Payment.amount), 0).label('total_revenue')
            ).join(ParkingSpot, ParkingLot.id == ParkingSpot.lot_id
            ).join(Reservation, ParkingSpot.id == Reservation.spot_id
            ).join(Payment, Reservation.id == Payment.reservation_id
            ).group_by(ParkingLot.id).all()

            locations = [r[0] for r in revenue_data]
            revenues = [r[1] for r in revenue_data]

            plt.figure(figsize=(6, 4))
            plt.bar(locations, revenues, color='purple')
            plt.title("Revenue by Parking Lot")
            plt.xlabel("Location")
            plt.ylabel("Revenue")
            plt.xticks(rotation=45)

            buf = BytesIO()
            plt.tight_layout()
            plt.savefig(buf, format="png")
            buf.seek(0)
            revenue_img = base64.b64encode(buf.read()).decode('utf-8')
            plt.close()

            # 2. Occupancy Chart
            spot_status_data = db.session.query(
                ParkingLot.prime_location_name,
                func.sum(case((ParkingSpot.status == 'A', 1), else_=0)).label('available'),
                func.sum(case((ParkingSpot.status == 'O', 1), else_=0)).label('occupied')
            ).join(ParkingSpot, ParkingLot.id == ParkingSpot.lot_id
            ).group_by(ParkingLot.id).all()

            print("Occupancy data fetched")

            locations = [s[0] for s in spot_status_data]
            available = [s[1] for s in spot_status_data]
            occupied = [s[2] for s in spot_status_data]

            x = range(len(locations))
            plt.figure(figsize=(6, 4))
            plt.bar(x, available, width=0.4, label='Available', align='center', color='#bc13f4')
            plt.bar(x, occupied, width=0.4, label='Occupied', bottom=available, align='center', color='purple')
            plt.xticks(x, locations, rotation=45)
            plt.title("Occupancy by Parking Lot")
            plt.xlabel("Location")
            plt.ylabel("Spots")
            plt.legend()

            buf2 = BytesIO()
            plt.tight_layout()
            plt.savefig(buf2, format="png")
            buf2.seek(0)
            occupancy_img = base64.b64encode(buf2.read()).decode('utf-8')
            plt.close()

            return {
                'revenue_chart': revenue_img,
                'occupancy_chart': occupancy_img
            }, 200

        except Exception as e:
            print("ERROR in /api/parking-summary:", str(e))
            return {'error': str(e)}, 500



api.add_resource(ParkingSummary, '/parking-summary')

from flask_restful import Resource
from flask_security import auth_required, current_user
from backend.models import Reservation, Payment, Vehicle, db
from sqlalchemy import func
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from datetime import datetime

class UserSummaryAPI(Resource):
    @auth_required('token')
    def get(self):
        try:
            # --- 1. Total Spend Over Time ---
            spend_data = db.session.query(
                func.date(Payment.payment_time),
                func.sum(Payment.amount)
            ).join(Payment.reservation
            ).filter(Reservation.user_id == current_user.id
            ).group_by(func.date(Payment.payment_time)
            ).order_by(func.date(Payment.payment_time)).all()

            spend_dates = [str(d[0]) for d in spend_data]
            spend_amounts = [d[1] for d in spend_data]

            plt.figure(figsize=(6, 3))
            plt.plot(spend_dates, spend_amounts, marker='o', color='purple')
            plt.xticks(rotation=45)
            plt.title("Total Spend Over Time")
            plt.xlabel("Date")
            plt.ylabel("Amount (₹)")
            plt.tight_layout()

            buf1 = BytesIO()
            plt.savefig(buf1, format="png")
            buf1.seek(0)
            spend_chart = base64.b64encode(buf1.read()).decode('utf-8')
            plt.close()

            # --- 2. Reservation Frequency By Day of Week ---
            reservations = Reservation.query.filter_by(user_id=current_user.id).all()
            weekday_count = [0] * 7  # Monday=0 ... Sunday=6

            for res in reservations:
                if res.parking_timestamp:
                    weekday = res.parking_timestamp.weekday()
                    weekday_count[weekday] += 1

            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            plt.figure(figsize=(6, 3))
            plt.bar(days, weekday_count, color='#bc13f4')
            plt.title("Reservations by Day of Week")
            plt.xlabel("Day")
            plt.ylabel("Count")
            plt.tight_layout()

            buf2 = BytesIO()
            plt.savefig(buf2, format="png")
            buf2.seek(0)
            weekday_chart = base64.b64encode(buf2.read()).decode('utf-8')
            plt.close()

            # --- 3. Vehicle Usage Count ---
            vehicle_data = db.session.query(
                Vehicle.name,
                func.count(Reservation.id)
            ).join(Reservation, Vehicle.id == Reservation.vehicle_id
            ).filter(Reservation.user_id == current_user.id
            ).group_by(Vehicle.id).all()

            vehicle_labels = [v[0] for v in vehicle_data]
            vehicle_counts = [v[1] for v in vehicle_data]

            plt.figure(figsize=(6, 3))
            plt.pie(vehicle_counts, labels=vehicle_labels, autopct='%1.1f%%', colors=['#bc13f4', 'purple', '#e0b3ff'])
            plt.title("Vehicle Usage Distribution")
            plt.tight_layout()

            buf3 = BytesIO()
            plt.savefig(buf3, format="png")
            buf3.seek(0)
            vehicle_chart = base64.b64encode(buf3.read()).decode('utf-8')
            plt.close()

            return {
                'spend_chart': spend_chart,
                'weekday_chart': weekday_chart,
                'vehicle_chart': vehicle_chart
            }, 200

        except Exception as e:
            print("Error in /user-summary:", str(e))
            return {'error': str(e)}, 500
api.add_resource(UserSummaryAPI, '/user-summary')
