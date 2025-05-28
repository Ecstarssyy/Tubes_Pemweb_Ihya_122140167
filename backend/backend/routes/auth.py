from pyramid.view import view_config
from pyramid.response import Response
from pyramid.security import remember, forget
from ..models import User
import json

@view_config(route_name='api_register', request_method='POST', renderer='json')
def register(request):
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not all([username, password, email]):
            return Response(json={'error': 'Missing required fields'}, status=400)

        # Check if username or email already exists
        dbsession = request.dbsession
        existing_user = dbsession.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            return Response(
                json={'error': 'Username or email already exists'}, 
                status=400
            )

        # Create new user
        user = User()
        user.username = username
        user.set_password(password)
        user.email = email
        user.role = 'user'  # Default role
        
        dbsession.add(user)
        dbsession.flush()

        # Create JWT token
        token = request.create_jwt_token(user.id)
        return {
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)

@view_config(route_name='api_login', request_method='POST', renderer='json')
def login(request):
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return Response(json={'error': 'Missing required fields'}, status=400)

        dbsession = request.dbsession
        user = dbsession.query(User).filter_by(username=username).first()

        if not user or not user.check_password(password):
            return Response(
                json={'error': 'Invalid username or password'}, 
                status=401
            )

        # Create JWT token
        token = request.create_jwt_token(user.id)
        return {
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }
    except Exception as e:
        return Response(json={'error': str(e)}, status=400)
