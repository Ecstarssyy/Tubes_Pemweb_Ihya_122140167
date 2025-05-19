from pyramid.view import view_config
from pyramid.response import Response
from pyramid.security import remember, forget
from ..models import User
import json

from pyramid.csrf import check_csrf_token
from pyramid.security import forget
from datetime import datetime

@view_config(route_name='api_register', request_method='POST', renderer='json')
def register(request):
    try:
        # Validate request body
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not all([username, password, email]):
            return Response(
                json={'error': 'Missing required fields: username, password, and email are required'}, 
                status=400
            )

        # Input validation
        if len(username) < 3:
            return Response(
                json={'error': 'Username must be at least 3 characters long'},
                status=400
            )
        if len(password) < 6:
            return Response(
                json={'error': 'Password must be at least 6 characters long'},
                status=400
            )
        if '@' not in email:
            return Response(
                json={'error': 'Invalid email format'},
                status=400
            )

        # Check if username or email already exists
        dbsession = request.dbsession
        existing_user = dbsession.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            error_field = 'username' if existing_user.username == username else 'email'
            return Response(
                json={'error': f'This {error_field} is already taken'}, 
                status=400
            )

        # Create new user
        user = User()
        user.username = username
        user.set_password(password)
        user.email = email
        user.role = 'user'  # Default role
        user.created_at = datetime.utcnow()
        
        dbsession.add(user)
        dbsession.flush()  # Get user ID without committing

        # Create JWT token with custom claims
        token = request.create_jwt_token(
            user.id,
            roles=[user.role],
            callback=lambda p: dict(
                sub=str(user.id),
                role=user.role,
                username=user.username
            )
        )

        # Set CORS headers
        response = Response(
            json={
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            },
            status=201
        )
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        return response

    except ValueError as e:
        return Response(json={'error': str(e)}, status=400)
    except Exception as e:
        request.dbsession.rollback()
        return Response(json={'error': 'Registration failed. Please try again.'}, status=500)

@view_config(route_name='api_login', request_method='POST', renderer='json')
def login(request):
    try:
        # Validate request body
        data = request.json_body
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return Response(json={'error': 'Username and password are required'}, status=400)

        # Find user and verify password
        dbsession = request.dbsession
        user = dbsession.query(User).filter_by(username=username).first()

        if not user or not user.check_password(password):
            return Response(
                json={'error': 'Invalid username or password'}, 
                status=401
            )

        # Create JWT token with custom claims
        token = request.create_jwt_token(
            user.id,
            roles=[user.role],
            callback=lambda p: dict(
                sub=str(user.id),
                role=user.role,
                username=user.username
            )
        )

        # Set CORS headers
        response = Response(
            json={
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role
                }
            }
        )
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        return response

    except ValueError as e:
        return Response(json={'error': str(e)}, status=400)
    except Exception as e:
        return Response(json={'error': 'Login failed. Please try again.'}, status=500)
