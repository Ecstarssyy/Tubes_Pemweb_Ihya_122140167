from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from . import Base
import bcrypt

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), nullable=False, default='user')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    events = relationship("Event", back_populates="user")
    
    def set_password(self, password):
        pwhash = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
        self.password_hash = pwhash.decode('utf8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf8'), 
                            self.password_hash.encode('utf8'))
