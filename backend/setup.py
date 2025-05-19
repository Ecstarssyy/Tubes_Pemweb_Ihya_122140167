from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_jwt',
    'SQLAlchemy',
    'psycopg2-binary',
    'alembic',
    'wsgicors',
    'bcrypt',
    'pyramid_tm',
    'zope.sqlalchemy',
    'waitress',
]

setup(
    name='event_organizer',
    version='0.1',
    description='Event Organizer Backend',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
    ],
    author='',
    author_email='',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = backend:main',
        ],
    },
)
