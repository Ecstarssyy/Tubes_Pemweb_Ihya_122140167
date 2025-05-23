"""add max_participants

Revision ID: 175a32884ac6
Revises: 1a1c39e8b123
Create Date: 2025-05-19 08:47:04.028324

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '175a32884ac6'
down_revision = '1a1c39e8b123'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('max_participants', sa.Integer(), nullable=True))
    op.drop_constraint('events_user_id_fkey', 'events', type_='foreignkey')
    op.create_foreign_key(None, 'events', 'users', ['user_id'], ['id'])
    op.drop_constraint('participants_event_id_fkey', 'participants', type_='foreignkey')
    op.create_foreign_key(None, 'participants', 'events', ['event_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'participants', type_='foreignkey')
    op.create_foreign_key('participants_event_id_fkey', 'participants', 'events', ['event_id'], ['id'], ondelete='CASCADE')
    op.drop_constraint(None, 'events', type_='foreignkey')
    op.create_foreign_key('events_user_id_fkey', 'events', 'users', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_column('events', 'max_participants')
    # ### end Alembic commands ###
