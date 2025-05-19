import unittest
from pyramid import testing
from ..models import get_engine, get_session_factory, get_tm_session
from ..models.user import User
from ..models.event import Event
import transaction

def dummy_request(dbsession):
    return testing.DummyRequest(dbsession=dbsession)

class BaseTest(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp(settings={
            'sqlalchemy.url': 'postgresql://postgres:postgres@localhost:5432/event_organizer_test'
        })
        self.config.include('..models')
        settings = self.config.get_settings()

        self.engine = get_engine(settings)
        session_factory = get_session_factory(self.engine)

        self.session = get_tm_session(session_factory, transaction.manager)

    def init_database(self):
        from ..models.meta import Base
        Base.metadata.create_all(self.engine)

    def tearDown(self):
        from ..models.meta import Base
        testing.tearDown()
        transaction.abort()
        Base.metadata.drop_all(self.engine)

class TestUserModel(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()

    def test_password_hashing(self):
        user = User(username='test', email='test@example.com')
        user.set_password('password123')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.check_password('wrongpassword'))

class TestEventModel(BaseTest):
    def setUp(self):
        super().setUp()
        self.init_database()

    def test_create_event(self):
        with transaction.manager:
            user = User(username='test', email='test@example.com')
            user.set_password('password123')
            self.session.add(user)
            self.session.flush()

            event = Event(
                title='Test Event',
                description='Test Description',
                date='2025-06-01 10:00:00',
                location='Test Location',
                user_id=user.id
            )
            self.session.add(event)
            self.session.flush()

            self.assertEqual(event.title, 'Test Event')
            self.assertEqual(event.user_id, user.id)
