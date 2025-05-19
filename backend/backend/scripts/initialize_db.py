import os
import sys
import transaction
from datetime import datetime
from pyramid.paster import (
    get_appsettings,
    setup_logging,
)
from pyramid.scripts.common import parse_vars

# Add the parent directory to sys.path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

from backend.models import (
    get_engine,
    get_session_factory,
    get_tm_session,
)
from backend.models.user import User
from backend.models.event import Event
from backend.models.participant import Participant

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)
        
        # Create admin user
        admin = User(
            username='admin',
            email='admin@example.com',
            role='admin'
        )
        admin.set_password('admin123')
        dbsession.add(admin)
        dbsession.flush()  # This ensures admin gets an ID

        # Create sample event
        event = Event(
            title='Sample Conference',
            description='A sample tech conference',
            date=datetime(2025, 6, 1, 10, 0),
            location='Virtual',
            max_participants=100,
            user_id=admin.id  # Use user_id instead of created_by
        )
        dbsession.add(event)
        dbsession.flush()

        # Create sample participant
        participant = Participant(
            name='John Doe',
            email='john@example.com',
            phone='123-456-7890',
            event_id=event.id
        )
        dbsession.add(participant)

if __name__ == '__main__':
    main()
